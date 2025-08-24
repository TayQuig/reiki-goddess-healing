#!/usr/bin/env python3
"""Extract About page sections into modular components."""

import re
from pathlib import Path

def extract_about_sections():
    """Extract sections from About page into separate components."""
    about_path = Path("About/src/screens/About/About.tsx")
    target_dir = Path("packages/shared-components/src/About")
    target_dir.mkdir(parents=True, exist_ok=True)
    
    with open(about_path, 'r') as f:
        lines = f.readlines()
    
    # Define sections with accurate line boundaries
    sections = [
        {
            'name': 'AboutHeader',
            'start': 39,
            'end': 61,
            'description': 'Navigation header'
        },
        {
            'name': 'AboutHero', 
            'start': 62,
            'end': 110,
            'description': 'Hero section with main image and title'
        },
        {
            'name': 'AboutIntro',
            'start': 111,
            'end': 131,
            'description': 'Introduction paragraph and CTA'
        },
        {
            'name': 'AboutValues',
            'start': 132,
            'end': 179,
            'description': 'Values and mission section'
        },
        {
            'name': 'AboutServices',
            'start': 180,
            'end': 239,
            'description': 'Service boxes with credentials'
        },
        {
            'name': 'AboutContact',
            'start': 240,
            'end': 283,
            'description': 'Contact CTA section'
        },
        {
            'name': 'AboutTestimonials',
            'start': 284,
            'end': 397,
            'description': 'Testimonials section'
        },
        {
            'name': 'AboutFooter',
            'start': 398,
            'end': 502,
            'description': 'Footer with links and copyright'
        }
    ]
    
    # Extract imports from the original file
    imports = []
    for i, line in enumerate(lines[:30]):
        if 'import' in line:
            imports.append(line)
    
    imports_block = ''.join(imports)
    
    # Extract each section
    for section in sections:
        start_idx = section['start'] - 1
        end_idx = section['end']
        
        # Get the section content
        section_lines = lines[start_idx:end_idx]
        section_content = ''.join(section_lines)
        
        # Create component file
        component_content = f"""import React from 'react';

interface {section['name']}Props {{
  className?: string;
}}

/**
 * {section['description']}
 * Extracted from About page lines {section['start']}-{section['end']}
 */
export const {section['name']}: React.FC<{section['name']}Props> = ({{ className }}) => {{
  return (
    <>
{section_content}
    </>
  );
}};
"""
        
        # Fix image paths
        component_content = re.sub(
            r'src="\/img\/(.*?)"',
            r'src={require("@reiki-goddess/shared-assets/images/about/\1")}',
            component_content
        )
        
        component_content = re.sub(
            r'url\(\/img\/(.*?)\)',
            r'url(@reiki-goddess/shared-assets/images/about/\1)',
            component_content
        )
        
        # Save component file
        component_path = target_dir / f"{section['name']}.tsx"
        with open(component_path, 'w') as f:
            f.write(component_content)
        
        print(f"✅ Extracted {section['name']:20} ({section['description']})")
    
    # Create index file
    index_content = ""
    for section in sections:
        index_content += f"export {{ {section['name']} }} from './{section['name']}';\n"
    
    index_path = target_dir / "index.ts"
    with open(index_path, 'w') as f:
        f.write(index_content)
    
    print(f"\n✅ Created index file with {len(sections)} exports")
    
    # Create composed About page using extracted sections
    composed_content = f"""import React from 'react';
import {{
  AboutHeader,
  AboutHero,
  AboutIntro,
  AboutValues,
  AboutServices,
  AboutContact,
  AboutTestimonials,
  AboutFooter
}} from '@reiki-goddess/shared-components/About';

/**
 * Composed About page using extracted modular sections
 */
export const About: React.FC = () => {{
  return (
    <div className="bg-[#fefbf5] grid justify-items-center [align-items:start] w-screen">
      <div className="bg-[#fefbf5] w-[1440px] h-[6682px] relative">
        <AboutHeader />
        <AboutHero />
        <AboutIntro />
        <AboutValues />
        <AboutServices />
        <AboutContact />
        <AboutTestimonials />
        <AboutFooter />
      </div>
    </div>
  );
}};
"""
    
    composed_path = target_dir / "AboutComposed.tsx"
    with open(composed_path, 'w') as f:
        f.write(composed_content)
    
    print(f"✅ Created composed About page using all sections")
    
    return len(sections)

if __name__ == "__main__":
    count = extract_about_sections()
    print(f"\n✨ Successfully extracted {count} sections from About page")