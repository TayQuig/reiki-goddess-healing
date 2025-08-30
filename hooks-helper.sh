#!/bin/bash

# Manual hook helper for common tasks
# Since Claude Code hooks don't work, use this instead

case "$1" in
  "doc-check")
    echo "📝 Documentation Status Check"
    echo "================================"
    
    # Check freshness of documentation files
    for file in context_recovery.md todo_list.md testing-strategy.md CLAUDE.md; do
      if [ -f "$file" ]; then
        AGE=$((($(date +%s) - $(stat -f %m "$file")) / 60))
        if [ $AGE -lt 60 ]; then
          echo "✅ $file (updated $AGE minutes ago)"
        elif [ $AGE -lt 1440 ]; then
          echo "⚠️  $file (updated $((AGE / 60)) hours ago)"
        else
          echo "❌ $file (updated $((AGE / 1440)) days ago)"
        fi
      fi
    done
    ;;
    
  "git-check")
    echo "🔍 Git Status Check"
    echo "==================="
    echo "Branch: $(git branch --show-current)"
    
    MODIFIED=$(git status --porcelain | wc -l | tr -d ' ')
    if [ $MODIFIED -gt 0 ]; then
      echo "⚠️  $MODIFIED uncommitted changes:"
      git status --short
    else
      echo "✅ Working tree clean"
    fi
    
    echo ""
    echo "📜 Recent commits:"
    git log --oneline -5
    ;;
    
  "session")
    echo "📊 Session Summary"
    echo "=================="
    echo "Current branch: $(git branch --show-current)"
    echo "Files modified: $(git diff --name-only | wc -l | tr -d ' ')"
    echo ""
    echo "Recent commits:"
    git log --oneline -5
    echo ""
    echo "Documentation status:"
    $0 doc-check
    ;;
    
  *)
    echo "Available commands:"
    echo "  ./hooks-helper.sh doc-check  - Check documentation freshness"
    echo "  ./hooks-helper.sh git-check  - Check git status"
    echo "  ./hooks-helper.sh session    - Generate session summary"
    ;;
esac