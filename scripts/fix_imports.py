#!/usr/bin/env python3
"""Fix duplicate React imports in extracted components."""

import re
from pathlib import Path

def fix_duplicate_imports(file_path):
    """Fix duplicate React imports in a file."""
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Pattern to match the duplicate import issue
    pattern = r"import React from 'react';\n\ninterface (\w+)Props \{\n  className\?: string;\n  // Add props as needed\n\}\n\nimport React(?:, \{ (.*?) \})? from \"react\";"
    
    def replacer(match):
        component_name = match.group(1)
        imports = match.group(2)
        if imports:
            return f"import React, {{ {imports} }} from 'react';\n\ninterface {component_name}Props {{\n  className?: string;\n  // Add props as needed\n}}"
        else:
            return f"import React from 'react';\n\ninterface {component_name}Props {{\n  className?: string;\n  // Add props as needed\n}}"
    
    fixed_content = re.sub(pattern, replacer, content)
    
    if fixed_content != content:
        with open(file_path, 'w') as f:
            f.write(fixed_content)
        print(f"✅ Fixed imports in: {file_path.name}")
        return True
    return False

# Fix all Contact components
contact_dir = Path("packages/shared-components/src/Contact")
fixed_count = 0

for file_path in contact_dir.glob("*.tsx"):
    if fix_duplicate_imports(file_path):
        fixed_count += 1

print(f"\n✨ Fixed {fixed_count} files")