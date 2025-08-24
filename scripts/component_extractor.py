#!/usr/bin/env python3
"""
Anima Component Extractor - Automates extraction of Anima-generated components
into the monorepo shared packages structure.
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import shutil
from datetime import datetime

class AnimaComponentExtractor:
    """Extracts and transforms Anima components for monorepo integration."""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root).resolve()
        self.shared_components = self.project_root / "packages" / "shared-components" / "src"
        self.shared_assets = self.project_root / "packages" / "shared-assets"
        self.extraction_log = []
        
    def extract_component(
        self,
        source_path: str,
        component_name: str,
        target_dir: str,
        update_imports: bool = True
    ) -> Path:
        """
        Extract a single Anima component to shared packages.
        
        Args:
            source_path: Path to source component file
            component_name: Name of the component
            target_dir: Target directory relative to shared-components/src
            update_imports: Whether to update image/asset imports
        
        Returns:
            Path to the extracted component
        """
        source = self.project_root / source_path
        
        if not source.exists():
            raise FileNotFoundError(f"Source file not found: {source}")
        
        # Read source content
        with open(source, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Transform the component
        transformed = self.transform_component(content, component_name, update_imports)
        
        # Create target directory
        target_path = self.shared_components / target_dir / f"{component_name}.tsx"
        target_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Write transformed component
        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(transformed)
        
        # Log extraction
        self.extraction_log.append({
            'timestamp': datetime.now().isoformat(),
            'source': str(source),
            'target': str(target_path),
            'component': component_name
        })
        
        print(f"✅ Extracted: {component_name} → {target_path.relative_to(self.project_root)}")
        return target_path
    
    def transform_component(
        self,
        content: str,
        component_name: str,
        update_imports: bool = True
    ) -> str:
        """
        Transform Anima component for monorepo structure.
        
        Args:
            content: Original component content
            component_name: Name of the component
            update_imports: Whether to update imports
        
        Returns:
            Transformed component content
        """
        transformed = content
        
        if update_imports:
            # Update image imports from /img/ to shared-assets
            transformed = re.sub(
                r'src="\/img\/(.*?)"',
                r'src={require("@reiki-goddess/shared-assets/images/\1")}',
                transformed
            )
            
            # Update CSS image URLs
            transformed = re.sub(
                r'url\(\/img\/(.*?)\)',
                r'url(@reiki-goddess/shared-assets/images/\1)',
                transformed
            )
            
            # Add shared-assets import if images are used
            if '@reiki-goddess/shared-assets' in transformed and 'import' not in transformed:
                transformed = f'// Auto-generated from Anima design\n{transformed}'
        
        # Add TypeScript interface if not present
        if 'interface' not in transformed and 'Props' not in transformed:
            interface = self.generate_interface(component_name)
            transformed = f'{interface}\n\n{transformed}'
        
        # Update export to named export if needed
        transformed = re.sub(
            r'export const (\w+) = \(\): JSX\.Element =>',
            f'export const {component_name}: React.FC = () =>',
            transformed
        )
        
        return transformed
    
    def generate_interface(self, component_name: str) -> str:
        """Generate TypeScript interface for component."""
        return f"""import React from 'react';

interface {component_name}Props {{
  className?: string;
  // Add props as needed
}}"""
    
    def batch_extract_sections(
        self,
        sections_config: List[Dict[str, str]]
    ) -> List[Path]:
        """
        Extract multiple sections based on configuration.
        
        Args:
            sections_config: List of extraction configurations
        
        Returns:
            List of extracted component paths
        """
        extracted_paths = []
        
        for config in sections_config:
            try:
                path = self.extract_component(
                    config['source'],
                    config['name'],
                    config.get('target_dir', 'components')
                )
                extracted_paths.append(path)
            except Exception as e:
                print(f"❌ Failed to extract {config['name']}: {e}")
        
        # Generate index file for extracted components
        if extracted_paths:
            self.generate_index_file(extracted_paths)
        
        return extracted_paths
    
    def refactor_monolith(
        self,
        monolith_path: str,
        sections_map: List[Dict]
    ) -> List[Path]:
        """
        Break a monolithic component into modular sections.
        
        Args:
            monolith_path: Path to monolithic component
            sections_map: List of section definitions with line ranges
        
        Returns:
            List of extracted section paths
        """
        source = self.project_root / monolith_path
        
        if not source.exists():
            raise FileNotFoundError(f"Monolith file not found: {source}")
        
        with open(source, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        extracted_paths = []
        
        for section in sections_map:
            # Extract lines for this section
            start = section['start'] - 1  # Convert to 0-based
            end = section['end']
            section_lines = lines[start:end]
            
            # Create a temporary file with section content
            temp_content = ''.join(section_lines)
            
            # Add necessary imports from monolith
            imports = self.extract_imports(lines[:30])  # Check first 30 lines for imports
            section_content = imports + '\n\n' + temp_content
            
            # Create wrapper component structure
            wrapped_content = self.wrap_section_content(
                section_content,
                section['name']
            )
            
            # Save as new component
            target_dir = section.get('target_dir', 'components')
            target_path = self.shared_components / target_dir / f"{section['name']}.tsx"
            target_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(target_path, 'w', encoding='utf-8') as f:
                f.write(wrapped_content)
            
            extracted_paths.append(target_path)
            print(f"✅ Refactored section: {section['name']} → {target_path.relative_to(self.project_root)}")
        
        return extracted_paths
    
    def extract_imports(self, lines: List[str]) -> str:
        """Extract import statements from lines."""
        imports = []
        for line in lines:
            if line.strip().startswith('import'):
                imports.append(line)
        return ''.join(imports)
    
    def wrap_section_content(self, content: str, section_name: str) -> str:
        """Wrap section content in proper component structure."""
        return f"""import React from 'react';

interface {section_name}Props {{
  className?: string;
}}

export const {section_name}: React.FC<{section_name}Props> = ({{ className }}) => {{
  return (
    <section className={{className}}>
      {content.strip()}
    </section>
  );
}};
"""
    
    def generate_index_file(self, component_paths: List[Path]) -> None:
        """Generate index.ts file for extracted components."""
        exports = []
        
        for path in component_paths:
            component_name = path.stem
            relative_path = path.relative_to(self.shared_components)
            dir_path = relative_path.parent
            
            exports.append(f"export {{ {component_name} }} from './{dir_path}/{component_name}';")
        
        index_path = self.shared_components / "index.ts"
        
        # Read existing exports if file exists
        existing_exports = []
        if index_path.exists():
            with open(index_path, 'r') as f:
                existing_exports = f.readlines()
        
        # Merge and deduplicate exports
        all_exports = list(set(existing_exports + exports))
        all_exports.sort()
        
        with open(index_path, 'w') as f:
            f.write('\n'.join(all_exports))
        
        print(f"✅ Updated index file: {index_path.relative_to(self.project_root)}")
    
    def update_asset_paths(self, directory: str) -> int:
        """
        Update all asset paths in a directory to use shared-assets.
        
        Args:
            directory: Directory to process
        
        Returns:
            Number of files updated
        """
        target_dir = self.project_root / directory
        updated_count = 0
        
        for file_path in target_dir.rglob("*.tsx"):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            
            # Update image paths
            content = re.sub(
                r'src="\/img\/(.*?)"',
                r'src={require("@reiki-goddess/shared-assets/images/\1")}',
                content
            )
            
            # Update static paths
            content = re.sub(
                r'\/static\/img\/(.*?)"',
                r'@reiki-goddess/shared-assets/images/\1"',
                content
            )
            
            if content != original:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                updated_count += 1
                print(f"✅ Updated assets in: {file_path.relative_to(self.project_root)}")
        
        return updated_count
    
    def save_extraction_log(self) -> None:
        """Save extraction log to file."""
        log_path = self.project_root / "extraction_log.json"
        
        with open(log_path, 'w') as f:
            json.dump(self.extraction_log, f, indent=2)
        
        print(f"📝 Extraction log saved: {log_path.relative_to(self.project_root)}")


# Configuration for Contact page sections
CONTACT_SECTIONS = [
    {
        'source': 'Contact/src/screens/Contact/sections/ContactFormSection/ContactFormSection.tsx',
        'name': 'ContactLastNameField',  # Renamed for clarity
        'target_dir': 'Contact'
    },
    {
        'source': 'Contact/src/screens/Contact/sections/EmailInfoSection/EmailInfoSection.tsx',
        'name': 'ContactPhoneField',  # Actually phone number field
        'target_dir': 'Contact'
    },
    {
        'source': 'Contact/src/screens/Contact/sections/PhoneInfoSection/PhoneInfoSection.tsx',
        'name': 'ContactEmailField',  # Actually email field
        'target_dir': 'Contact'
    },
    {
        'source': 'Contact/src/screens/Contact/sections/CallToActionSection/CallToActionSection.tsx',
        'name': 'ContactMessageField',  # Message textarea
        'target_dir': 'Contact'
    },
    {
        'source': 'Contact/src/screens/Contact/sections/LocationInfoSection/LocationInfoSection.tsx',
        'name': 'ContactCTAFooter',  # CTA and footer combined
        'target_dir': 'Contact'
    }
]

# Configuration for About page refactoring
ABOUT_SECTIONS = [
    {
        'name': 'AboutHeroSection',
        'start': 38,
        'end': 100,
        'target_dir': 'About'
    },
    {
        'name': 'AboutIntroSection',
        'start': 100,
        'end': 150,
        'target_dir': 'About'
    },
    {
        'name': 'AboutGallerySection',
        'start': 150,
        'end': 250,
        'target_dir': 'About'
    },
    {
        'name': 'AboutTestimonialsSection',
        'start': 250,
        'end': 350,
        'target_dir': 'About'
    },
    {
        'name': 'AboutServicesSection',
        'start': 350,
        'end': 420,
        'target_dir': 'About'
    },
    {
        'name': 'AboutCTASection',
        'start': 420,
        'end': 480,
        'target_dir': 'About'
    },
    {
        'name': 'AboutFooterSection',
        'start': 480,
        'end': 503,
        'target_dir': 'About'
    }
]


def main():
    """Main execution function."""
    print("🚀 Starting Anima Component Extraction")
    print("=" * 50)
    
    extractor = AnimaComponentExtractor()
    
    # Step 1: Extract Contact sections
    print("\n📦 Extracting Contact Page Sections...")
    contact_paths = extractor.batch_extract_sections(CONTACT_SECTIONS)
    print(f"   Extracted {len(contact_paths)} Contact sections")
    
    # Step 2: Refactor About page
    print("\n📦 Refactoring About Page...")
    # Note: This would need the actual line numbers verified
    # about_paths = extractor.refactor_monolith(
    #     'About/src/screens/About/About.tsx',
    #     ABOUT_SECTIONS
    # )
    # print(f"   Refactored into {len(about_paths)} About sections")
    
    # Step 3: Update asset paths
    print("\n🔄 Updating Asset Paths...")
    updated = extractor.update_asset_paths('packages/shared-components')
    print(f"   Updated {updated} files with new asset paths")
    
    # Step 4: Save extraction log
    extractor.save_extraction_log()
    
    print("\n✨ Extraction Complete!")
    print(f"   Total components extracted: {len(extractor.extraction_log)}")


if __name__ == "__main__":
    main()