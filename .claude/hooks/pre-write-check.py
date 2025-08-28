#!/usr/bin/env python3
"""
PreToolUse hook that enforces git safety before major file operations
"""
import json
import sys
import subprocess
from pathlib import Path

PROJECT_DIR = Path("/Users/taylorquigley/Documents/Directories/reiki-goddess-healing")

def get_uncommitted_count():
    """Count uncommitted changes"""
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=PROJECT_DIR,
            capture_output=True,
            text=True
        )
        return len(result.stdout.strip().split('\n')) if result.stdout.strip() else 0
    except:
        return 0

def is_critical_file(filepath):
    """Check if file is critical and needs commit before editing"""
    critical_patterns = [
        'package.json',
        'tsconfig.json',
        '.gitignore',
        'vite.config',
        'vitest.config',
        '.eslintrc',
        'CLAUDE.md',
        'context_recovery.md'
    ]
    
    return any(pattern in filepath for pattern in critical_patterns)

def main():
    # Load input
    try:
        input_data = json.load(sys.stdin)
    except:
        sys.exit(0)
    
    tool_name = input_data.get("tool_name", "")
    tool_input = input_data.get("tool_input", {})
    
    # Only check for Write/Edit operations
    if tool_name not in ["Write", "Edit", "MultiEdit"]:
        sys.exit(0)
    
    # Get the file being modified
    file_path = tool_input.get("file_path", "")
    
    # Check if it's a critical file
    if is_critical_file(file_path):
        uncommitted = get_uncommitted_count()
        
        # If there are many uncommitted changes and we're editing critical files
        if uncommitted > 10:
            output = {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "ask",
                    "permissionDecisionReason": f"⚠️ Editing critical file '{file_path}' with {uncommitted} uncommitted changes. Consider committing first for safety."
                }
            }
            print(json.dumps(output))
            sys.exit(0)
    
    # Allow the operation
    sys.exit(0)

if __name__ == "__main__":
    main()