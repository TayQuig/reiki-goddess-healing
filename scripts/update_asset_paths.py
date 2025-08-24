#!/usr/bin/env python3
"""Update all asset paths in components to use shared-assets package."""

import re
from pathlib import Path
from typing import Dict, List, Tuple

class AssetPathUpdater:
    """Updates asset paths to use the shared-assets package."""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root).resolve()
        self.updates = []
        
        # Map original paths to new shared-assets paths
        self.path_mappings = {
            '/img/': '@reiki-goddess/shared-assets/images/',
            '/static/img/': '@reiki-goddess/shared-assets/images/',
            '../static/img/': '@reiki-goddess/shared-assets/images/',
            './static/img/': '@reiki-goddess/shared-assets/images/',
        }
        
        # Map page names to asset folders
        self.page_folders = {
            'Contact': 'contact',
            'About': 'about',
            'Home': 'home',
            'Blog': 'blog'
        }
    
    def update_file(self, file_path: Path) -> bool:
        """Update asset paths in a single file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            
            # Determine which page folder to use based on component location
            page_folder = self.detect_page_folder(file_path)
            
            # Update image src attributes
            content = re.sub(
                r'src="\/img\/(.*?)"',
                f'src={{require("@reiki-goddess/shared-assets/images/{page_folder}/\\1")}}',
                content
            )
            
            # Update CSS background URLs
            content = re.sub(
                r'bg-\[url\(\/img\/(.*?)\)\]',
                f'bg-[url(@reiki-goddess/shared-assets/images/{page_folder}/\\1)]',
                content
            )
            
            # Update any remaining /img/ references
            content = re.sub(
                r'\/img\/(.*?)(["\'`])',
                f'@reiki-goddess/shared-assets/images/{page_folder}/\\1\\2',
                content
            )
            
            # Fix any double slashes
            content = re.sub(r'\/\/', '/', content)
            
            if content != original:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                self.updates.append({
                    'file': str(file_path.relative_to(self.project_root)),
                    'page_folder': page_folder
                })
                return True
            
            return False
            
        except Exception as e:
            print(f"❌ Error updating {file_path}: {e}")
            return False
    
    def detect_page_folder(self, file_path: Path) -> str:
        """Detect which page folder to use for assets based on file path."""
        path_str = str(file_path)
        
        for page_name, folder_name in self.page_folders.items():
            if page_name in path_str:
                return folder_name
        
        # Default to generic if no match
        return 'shared'
    
    def update_directory(self, directory: Path) -> int:
        """Update all TypeScript/React files in a directory."""
        updated_count = 0
        
        for file_path in directory.rglob("*.tsx"):
            if self.update_file(file_path):
                updated_count += 1
                print(f"✅ Updated: {file_path.relative_to(self.project_root)}")
        
        for file_path in directory.rglob("*.ts"):
            if 'index.ts' not in str(file_path):  # Skip index files
                if self.update_file(file_path):
                    updated_count += 1
                    print(f"✅ Updated: {file_path.relative_to(self.project_root)}")
        
        return updated_count
    
    def create_asset_manifest(self) -> None:
        """Create or update the asset manifest file."""
        manifest_path = self.project_root / "packages/shared-assets/src/images.ts"
        
        # Scan for all images in shared-assets
        images_dir = self.project_root / "packages/shared-assets/images"
        images = {}
        
        for folder in ['contact', 'about', 'home', 'blog']:
            folder_path = images_dir / folder
            if folder_path.exists():
                images[folder] = []
                for img in folder_path.iterdir():
                    if img.is_file():
                        images[folder].append(img.name)
        
        # Generate manifest content
        manifest_content = """/**
 * Asset manifest for shared-assets package
 * Auto-generated - do not edit manually
 */

"""
        
        for folder, files in images.items():
            manifest_content += f"// {folder.capitalize()} page assets\n"
            for file in sorted(files):
                var_name = file.replace('-', '_').replace('.', '_').upper()
                manifest_content += f"export const {folder.upper()}_{var_name} = require('../images/{folder}/{file}');\n"
            manifest_content += "\n"
        
        # Write manifest
        with open(manifest_path, 'w') as f:
            f.write(manifest_content)
        
        print(f"📝 Updated asset manifest: {manifest_path.relative_to(self.project_root)}")
    
    def generate_report(self) -> None:
        """Generate a report of all updates."""
        print("\n" + "=" * 50)
        print("Asset Path Update Report")
        print("=" * 50)
        
        if self.updates:
            print(f"\nUpdated {len(self.updates)} files:")
            
            # Group by page folder
            by_folder = {}
            for update in self.updates:
                folder = update['page_folder']
                if folder not in by_folder:
                    by_folder[folder] = []
                by_folder[folder].append(update['file'])
            
            for folder, files in by_folder.items():
                print(f"\n{folder.capitalize()} assets ({len(files)} files):")
                for file in files:
                    print(f"  - {file}")
        else:
            print("\nNo files needed updating.")

def main():
    """Main execution function."""
    print("🚀 Starting Asset Path Updates")
    print("=" * 50)
    
    updater = AssetPathUpdater()
    
    # Update shared-components
    print("\n📦 Updating shared-components...")
    components_dir = Path("packages/shared-components/src")
    components_updated = updater.update_directory(components_dir)
    print(f"   Updated {components_updated} component files")
    
    # Update asset manifest
    print("\n📝 Updating asset manifest...")
    updater.create_asset_manifest()
    
    # Generate report
    updater.generate_report()
    
    print("\n✨ Asset path updates complete!")

if __name__ == "__main__":
    main()