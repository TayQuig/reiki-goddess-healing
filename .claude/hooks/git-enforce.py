#!/usr/bin/env python3
"""
Git enforcement hook that ensures proper git protocols are followed
"""
import json
import sys
import subprocess
from pathlib import Path
import re

PROJECT_DIR = Path("/Users/taylorquigley/Documents/Directories/reiki-goddess-healing")

def get_git_status():
    """Get current git status"""
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=PROJECT_DIR,
            capture_output=True,
            text=True
        )
        return result.stdout.strip().split('\n') if result.stdout.strip() else []
    except:
        return []

def get_current_branch():
    """Get current git branch"""
    try:
        result = subprocess.run(
            ["git", "branch", "--show-current"],
            cwd=PROJECT_DIR,
            capture_output=True,
            text=True
        )
        return result.stdout.strip()
    except:
        return None

def check_commit_threshold():
    """Check if there are enough changes to warrant a commit"""
    status = get_git_status()
    
    # Count different types of changes
    modified_files = [f for f in status if f.startswith(' M') or f.startswith('M ')]
    new_files = [f for f in status if f.startswith('??')]
    deleted_files = [f for f in status if f.startswith(' D') or f.startswith('D ')]
    
    # Threshold rules
    total_changes = len(modified_files) + len(new_files) + len(deleted_files)
    
    # Check for test files
    test_files = [f for f in status if '.test.' in f]
    
    # Check for documentation files
    doc_files = [f for f in status if f.endswith('.md')]
    
    return {
        "total_changes": total_changes,
        "modified": len(modified_files),
        "new": len(new_files),
        "deleted": len(deleted_files),
        "has_tests": len(test_files) > 0,
        "has_docs": len(doc_files) > 0,
        "should_commit": total_changes >= 5 or len(test_files) >= 3 or len(doc_files) >= 2
    }

def suggest_commit_type(changes):
    """Suggest appropriate commit type based on changes"""
    status = get_git_status()
    
    # Analyze file patterns
    if any('.test.' in f for f in status):
        return "test"
    elif any(f.endswith('.md') for f in status):
        return "docs"
    elif any('feat' in f or 'feature' in f for f in status):
        return "feat"
    elif any('fix' in f or 'bug' in f for f in status):
        return "fix"
    elif changes["new"] > changes["modified"]:
        return "feat"
    else:
        return "refactor"

def generate_commit_message(changes):
    """Generate suggested commit message"""
    commit_type = suggest_commit_type(changes)
    
    # Determine scope based on files
    status = get_git_status()
    if any('test' in f for f in status):
        scope = "testing"
    elif any('hooks' in f for f in status):
        scope = "automation"
    elif any('components' in f for f in status):
        scope = "components"
    else:
        scope = "project"
    
    # Create description based on changes
    descriptions = []
    if changes["has_tests"]:
        descriptions.append("add comprehensive test coverage")
    if changes["has_docs"]:
        descriptions.append("update documentation")
    if changes["new"] > 0:
        descriptions.append(f"add {changes['new']} new files")
    if changes["modified"] > 0:
        descriptions.append(f"update {changes['modified']} files")
    
    description = " and ".join(descriptions) if descriptions else "update project files"
    
    return f"{commit_type}({scope}): {description}"

def main():
    # Load input from stdin
    try:
        input_data = json.load(sys.stdin)
    except:
        input_data = {}
    
    # Don't enforce on already active stop hooks
    if input_data.get("stop_hook_active", False):
        sys.exit(0)
    
    # Get hook event name
    hook_event = input_data.get("hook_event_name", "")
    
    # Check git status
    branch = get_current_branch()
    changes = check_commit_threshold()
    
    # If we have significant uncommitted changes, notify but don't block
    if changes["should_commit"]:
        commit_msg = generate_commit_message(changes)
        
        notification = f"""📝 Git Commit Reminder - Threshold Reached

You have {changes['total_changes']} uncommitted changes:
- Modified files: {changes['modified']}
- New files: {changes['new']}
- Deleted files: {changes['deleted']}
{'- Test files detected' if changes['has_tests'] else ''}
{'- Documentation updated' if changes['has_docs'] else ''}

Suggested commit command when you're ready:

```bash
git add -A
git commit -m "{commit_msg}

- Updated {changes['total_changes']} files
{'- Added comprehensive test coverage' if changes['has_tests'] else ''}
{'- Updated project documentation' if changes['has_docs'] else ''}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

Note: This is just a reminder. Work continues normally. Commit when the user explicitly requests it."""
        
        # Send notification to stderr so it appears but doesn't block
        print(notification, file=sys.stderr)
        
        # Log the suggestion for reference
        output = {
            "decision": "continue",
            "notification": "Commit threshold reached - see reminder above"
        }
        print(json.dumps(output))
    
    # Check for feature branch recommendation
    if branch == "main" and changes["total_changes"] > 10:
        print("📌 Consider creating a feature branch for large changes", file=sys.stderr)
    
    sys.exit(0)

if __name__ == "__main__":
    main()