#!/usr/bin/env python3
"""Fix malformed comments in TypeScript files."""

import re
from pathlib import Path

def fix_comments_in_file(file_path):
    """Fix malformed single-line comments in a file."""
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Fix patterns like "/ comment" to "// comment"
    # But avoid matching division operators like "a / b"
    fixed_content = re.sub(r'(\s+)/ ([A-Z]|\w+\s)', r'\1// \2', content)
    
    if fixed_content != content:
        with open(file_path, 'w') as f:
            f.write(fixed_content)
        print(f"Fixed: {file_path}")
        return True
    return False

def main():
    """Main function to fix comments in all TypeScript files."""
    project_root = Path("/Users/taylorquigley/Documents/Directories/reiki-goddess-healing")
    components_dir = project_root / "packages/shared-components/src"
    
    files_to_fix = [
        "HeaderSection/HeaderSection.test.tsx",
        "Contact/ContactCTAFooter.tsx",
        "Contact/ContactLastNameField.tsx",
        "Contact/ContactPhoneField.tsx",
        "Contact/ContactEmailField.tsx",
        "Contact/ContactMessageField.tsx",
        "ResponsiveContainer/ResponsiveContainer.tsx",
        "ResponsiveContainer.tsx",
        "PrivacyCompliance.tsx",
        "SecureContactForm.tsx"
    ]
    
    fixed_count = 0
    for file_path in files_to_fix:
        full_path = components_dir / file_path
        if full_path.exists():
            if fix_comments_in_file(full_path):
                fixed_count += 1
    
    print(f"\nFixed {fixed_count} files")

if __name__ == "__main__":
    main()