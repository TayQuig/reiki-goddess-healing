#!/usr/bin/env python3
"""Analyze About page structure to identify logical sections for extraction."""

import re
from pathlib import Path

def analyze_about_page():
    """Analyze the About page to identify section boundaries."""
    about_path = Path("About/src/screens/About/About.tsx")
    
    with open(about_path, 'r') as f:
        lines = f.readlines()
    
    sections = []
    current_section = None
    indent_stack = []
    
    for i, line in enumerate(lines, 1):
        # Look for major section markers
        if '<header' in line:
            sections.append({'name': 'Header/Navigation', 'start': i, 'type': 'header'})
        elif '<section' in line:
            sections.append({'name': f'Section at line {i}', 'start': i, 'type': 'section'})
        elif '<footer' in line:
            sections.append({'name': 'Footer', 'start': i, 'type': 'footer'})
        elif 'className="absolute w-[1' in line and 'top-[' in line:
            # Major absolute positioned containers
            sections.append({'name': f'Container at line {i}', 'start': i, 'type': 'container'})
        
        # Look for text content to identify section purposes
        if i > 30:  # Skip imports
            if 'Welcome to' in line or 'About Us' in line:
                sections.append({'name': 'Hero/Welcome', 'start': i, 'type': 'content'})
            elif 'Harness the' in line or 'healing' in line.lower():
                sections.append({'name': 'Healing Content', 'start': i, 'type': 'content'})
            elif 'Services' in line or 'service' in line.lower():
                sections.append({'name': 'Services', 'start': i, 'type': 'content'})
            elif 'Testimonial' in line or 'review' in line.lower():
                sections.append({'name': 'Testimonials', 'start': i, 'type': 'content'})
            elif 'Gallery' in line or 'image' in line.lower():
                if 'src=' in line and '.png' in line:
                    sections.append({'name': 'Image/Gallery', 'start': i, 'type': 'image'})
    
    # Print analysis
    print("About Page Structure Analysis")
    print("=" * 50)
    print(f"Total lines: {len(lines)}")
    print("\nIdentified Sections:")
    print("-" * 50)
    
    for section in sections[:30]:  # Show first 30 sections
        print(f"Line {section['start']:4}: {section['type']:10} - {section['name']}")
    
    # Suggest logical groupings
    print("\n\nSuggested Section Extraction:")
    print("-" * 50)
    
    suggested_sections = [
        {'name': 'AboutHeader', 'start': 39, 'end': 61, 'description': 'Navigation header'},
        {'name': 'AboutHero', 'start': 62, 'end': 131, 'description': 'Hero section with main image'},
        {'name': 'AboutIntro', 'start': 111, 'end': 131, 'description': 'Introduction text'},
        {'name': 'AboutValues', 'start': 132, 'end': 179, 'description': 'Values/mission section'},
        {'name': 'AboutHealing', 'start': 180, 'end': 229, 'description': 'Healing services boxes'},
        {'name': 'AboutTestimonials', 'start': 230, 'end': 350, 'description': 'Testimonials section'},
        {'name': 'AboutGallery', 'start': 351, 'end': 450, 'description': 'Image gallery'},
        {'name': 'AboutCTA', 'start': 451, 'end': 502, 'description': 'Call to action and footer'}
    ]
    
    for section in suggested_sections:
        print(f"{section['name']:20} Lines {section['start']:3}-{section['end']:3}: {section['description']}")
    
    return suggested_sections

if __name__ == "__main__":
    sections = analyze_about_page()