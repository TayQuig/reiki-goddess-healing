#!/usr/bin/env python3
"""Fix missing variables in About components."""

from pathlib import Path

def fix_about_header():
    """Fix AboutHeader component."""
    file_path = Path("/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/packages/shared-components/src/About/AboutHeader.tsx")
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Add navigationItems array
    new_content = content.replace(
        "export const AboutHeader: React.FC<AboutHeaderProps> = ({ className }) => {\n  return (",
        """export const AboutHeader: React.FC<AboutHeaderProps> = ({ className }) => {
  const navigationItems = ['Home', 'About', 'Services', 'Blog', 'Contact'];
  
  return ("""
    )
    
    with open(file_path, 'w') as f:
        f.write(new_content)
    
    print("✅ Fixed AboutHeader.tsx")

def fix_about_testimonials():
    """Fix AboutTestimonials component."""
    file_path = Path("/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/packages/shared-components/src/About/AboutTestimonials.tsx")
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Add missing variables
    new_content = content.replace(
        "export const AboutTestimonials: React.FC<AboutTestimonialsProps> = ({ className }) => {\n  return (",
        """export const AboutTestimonials: React.FC<AboutTestimonialsProps> = ({ className }) => {
  const galleryImages = [
    require("@reiki-goddess/shared-assets/images/about/rectangle-5.png"),
    require("@reiki-goddess/shared-assets/images/about/rectangle-6.png"),
    require("@reiki-goddess/shared-assets/images/about/rectangle-7.png"),
    require("@reiki-goddess/shared-assets/images/about/rectangle-8.png"),
    require("@reiki-goddess/shared-assets/images/about/rectangle-10.png")
  ];
  
  const testimonial = {
    text: "The energy healing session I had was transformative. I felt a deep sense of peace and clarity that lasted for weeks.",
    author: "Sarah M.",
    rating: 5
  };
  
  const stars = Array(testimonial.rating).fill(0);
  
  return ("""
    )
    
    with open(file_path, 'w') as f:
        f.write(new_content)
    
    print("✅ Fixed AboutTestimonials.tsx")

def fix_index_ts():
    """Fix index.ts exports."""
    file_path = Path("/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/packages/shared-components/src/index.ts")
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Remove incorrect exports
    lines_to_remove = [
        "export { Footer, NavigationItem } from './Footer';",
        "export { Header, HeaderProps } from './Navigation';"
    ]
    
    for line in lines_to_remove:
        content = content.replace(line + "\n", "")
        content = content.replace(line, "")
    
    # Add correct exports if needed
    if "export { Footer } from './Footer/Footer';" not in content:
        content = content.replace(
            "// Footer components",
            """// Footer components
export { Footer } from './Footer/Footer';"""
        )
    
    if "export { Header } from './Navigation/Header';" not in content:
        content = content.replace(
            "// Navigation components",
            """// Navigation components  
export { Header } from './Navigation/Header';"""
        )
    
    with open(file_path, 'w') as f:
        f.write(content)
    
    print("✅ Fixed index.ts")

def main():
    """Main function."""
    print("🚀 Fixing About components...")
    
    fix_about_header()
    fix_about_testimonials()
    fix_index_ts()
    
    print("\n✨ All components fixed!")

if __name__ == "__main__":
    main()