#!/usr/bin/env python3
"""
Stop hook that prompts Claude to update documentation automatically
"""
import json
import sys
import subprocess
from datetime import datetime
from pathlib import Path

# Get project directory
PROJECT_DIR = Path("/Users/taylorquigley/Documents/Directories/reiki-goddess-healing")

def get_git_stats():
    """Get git statistics for the session"""
    try:
        # Count uncommitted changes
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=PROJECT_DIR,
            capture_output=True,
            text=True
        )
        changes = len(result.stdout.strip().split('\n')) if result.stdout.strip() else 0
        
        # Count test files modified
        test_files = [line for line in result.stdout.strip().split('\n') 
                     if '.test.' in line]
        
        # Get recent commits (last 4 hours)
        result = subprocess.run(
            ["git", "log", "--since=4 hours ago", "--oneline"],
            cwd=PROJECT_DIR,
            capture_output=True,
            text=True
        )
        recent_commits = len(result.stdout.strip().split('\n')) if result.stdout.strip() else 0
        
        return {
            "uncommitted_changes": changes,
            "test_files_modified": len(test_files),
            "recent_commits": recent_commits,
            "modified_test_files": [line.split()[-1] for line in test_files if line]
        }
    except:
        return None

def check_documentation_freshness():
    """Check how recently documentation was updated"""
    docs_status = {}
    doc_files = {
        "context_recovery.md": "Context Recovery",
        "todo_list.md": "Todo List", 
        "testing-strategy.md": "Testing Strategy"
    }
    
    for filename, name in doc_files.items():
        filepath = PROJECT_DIR / filename
        if filepath.exists():
            mtime = filepath.stat().st_mtime
            age_minutes = (datetime.now().timestamp() - mtime) / 60
            docs_status[name] = {
                "age_minutes": int(age_minutes),
                "needs_update": age_minutes > 30
            }
    
    return docs_status

def main():
    # Load input from stdin
    try:
        input_data = json.load(sys.stdin)
    except:
        input_data = {}
    
    # Don't create infinite loops
    if input_data.get("stop_hook_active", False):
        sys.exit(0)
    
    # Get current statistics
    git_stats = get_git_stats()
    docs_status = check_documentation_freshness()
    
    # Check if documentation needs updating
    needs_doc_update = False
    update_reasons = []
    
    if git_stats:
        if git_stats["test_files_modified"] > 0:
            needs_doc_update = True
            update_reasons.append(f"{git_stats['test_files_modified']} test files modified")
        
        if git_stats["uncommitted_changes"] > 5:
            needs_doc_update = True
            update_reasons.append(f"{git_stats['uncommitted_changes']} uncommitted changes")
    
    # Check if docs are stale
    for doc_name, status in docs_status.items():
        if status["needs_update"] and status["age_minutes"] > 60:
            needs_doc_update = True
            update_reasons.append(f"{doc_name} is {status['age_minutes']} minutes old")
    
    # If documentation needs updating, prompt Claude to do it
    if needs_doc_update:
        update_message = f"""Documentation Update Required

The following documentation needs to be updated based on the current session:

Session Statistics:
- Uncommitted changes: {git_stats['uncommitted_changes'] if git_stats else 'unknown'}
- Test files modified: {git_stats['test_files_modified'] if git_stats else 'unknown'}
- Recent commits: {git_stats['recent_commits'] if git_stats else 'unknown'}

Reasons for update: {', '.join(update_reasons)}

Please update:
1. todo_list.md - Add session accomplishments for {datetime.now().strftime('%Y-%m-%d')}
2. testing-strategy.md - Update coverage if tests were added
3. context_recovery.md - Update if major milestones were reached

After updating, remind the user to commit changes if appropriate."""
        
        # Use JSON output to continue and prompt Claude
        output = {
            "decision": "block",
            "reason": update_message
        }
        print(json.dumps(output))
        sys.exit(0)
    
    # Otherwise, just show a status summary
    print("✅ Documentation appears up-to-date", file=sys.stderr)
    sys.exit(0)

if __name__ == "__main__":
    main()