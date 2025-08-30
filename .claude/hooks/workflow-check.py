#!/usr/bin/env python3
"""
Workflow Check - Manual trigger for Claude Code hooks
Run this periodically to ensure git and documentation workflows are followed
"""

import subprocess
import json
import sys
import os
from datetime import datetime

def run_command(cmd):
    """Run a shell command and return output"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout.strip(), result.returncode
    except Exception as e:
        return str(e), 1

def check_git_status():
    """Check git status and return stats"""
    output, _ = run_command("git status --porcelain")
    if not output:
        return {"modified": 0, "added": 0, "deleted": 0, "untracked": 0}
    
    stats = {"modified": 0, "added": 0, "deleted": 0, "untracked": 0}
    for line in output.split('\n'):
        if line.startswith(' M'):
            stats["modified"] += 1
        elif line.startswith('M '):
            stats["modified"] += 1
        elif line.startswith('A '):
            stats["added"] += 1
        elif line.startswith('D '):
            stats["deleted"] += 1
        elif line.startswith('??'):
            stats["untracked"] += 1
    
    return stats

def check_documentation_age():
    """Check when documentation files were last updated"""
    docs = {
        "context_recovery.md": None,
        "todo_list.md": None,
        "testing-strategy.md": None,
        "CLAUDE.md": None
    }
    
    for doc in docs:
        if os.path.exists(doc):
            mtime = os.path.getmtime(doc)
            age_minutes = int((datetime.now().timestamp() - mtime) / 60)
            docs[doc] = age_minutes
    
    return docs

def main():
    """Main workflow check"""
    print("\n" + "="*60)
    print("🔄 WORKFLOW STATUS CHECK")
    print("="*60)
    
    # Check git status
    git_stats = check_git_status()
    total_changes = sum(git_stats.values())
    
    print("\n📊 Git Status:")
    print(f"  Modified: {git_stats['modified']}")
    print(f"  Added: {git_stats['added']}")
    print(f"  Deleted: {git_stats['deleted']}")
    print(f"  Untracked: {git_stats['untracked']}")
    print(f"  Total: {total_changes}")
    
    # Check documentation age
    doc_ages = check_documentation_age()
    print("\n📝 Documentation Freshness:")
    for doc, age in doc_ages.items():
        if age is None:
            print(f"  {doc}: Not found")
        elif age < 60:
            print(f"  ✅ {doc}: {age} minutes old")
        elif age < 1440:
            hours = age // 60
            print(f"  ⚠️  {doc}: {hours} hours old")
        else:
            days = age // 1440
            print(f"  ❌ {doc}: {days} days old")
    
    # Determine actions needed
    actions = []
    
    # Git commit threshold
    if total_changes >= 5:
        actions.append("COMMIT: You have {} changes - commit now!".format(total_changes))
    
    # Documentation update threshold
    for doc, age in doc_ages.items():
        if age and age > 120:  # 2 hours
            actions.append(f"UPDATE: {doc} is outdated")
    
    # Feature branch check
    current_branch, _ = run_command("git branch --show-current")
    if current_branch == "main" and total_changes > 3:
        actions.append("BRANCH: Consider creating a feature branch")
    
    # Output recommendations
    if actions:
        print("\n⚠️  ACTIONS REQUIRED:")
        for action in actions:
            print(f"  • {action}")
        
        # Provide specific commands
        if any("COMMIT" in a for a in actions):
            print("\n📋 Suggested commit command:")
            print('  git add -A')
            print('  git commit -m "feat(phase-4): implement routing infrastructure"')
        
        if any("BRANCH" in a for a in actions):
            print("\n🌿 Suggested branch command:")
            print('  git checkout -b feat/phase-4-routing')
        
        if any("UPDATE" in a for a in actions):
            print("\n📝 Update documentation:")
            print('  - Add session accomplishments to todo_list.md')
            print('  - Update progress in context_recovery.md')
            print('  - Update test coverage in testing-strategy.md if applicable')
        
        # Return non-zero to indicate action needed
        sys.exit(1)
    else:
        print("\n✅ All checks passed - no immediate actions needed")
        sys.exit(0)

if __name__ == "__main__":
    main()