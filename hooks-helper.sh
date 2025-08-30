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
    
  "test-check")
    echo "🧪 Testing Coverage Check"
    echo "========================="
    
    # Count test files vs component files
    COMPONENTS=$(find packages/shared-components/src -name "*.tsx" -not -name "*.test.tsx" -not -name "*.stories.tsx" 2>/dev/null | wc -l | tr -d ' ')
    TESTS=$(find packages/shared-components/src -name "*.test.tsx" 2>/dev/null | wc -l | tr -d ' ')
    
    echo "Components: $COMPONENTS"
    echo "Test files: $TESTS"
    
    if [ $COMPONENTS -gt 0 ]; then
      COVERAGE=$((TESTS * 100 / COMPONENTS))
      echo "Coverage: ~$COVERAGE% of components have tests"
      
      if [ $COVERAGE -lt 50 ]; then
        echo "❌ Low test coverage - add more tests!"
      elif [ $COVERAGE -lt 80 ]; then
        echo "⚠️  Moderate coverage - aim for 80%+"
      else
        echo "✅ Good test coverage!"
      fi
    fi
    
    # Find components without tests
    echo ""
    echo "Components missing tests:"
    for component in $(find packages/shared-components/src -name "*.tsx" -not -name "*.test.tsx" -not -name "*.stories.tsx" 2>/dev/null); do
      TEST_FILE="${component%.tsx}.test.tsx"
      if [ ! -f "$TEST_FILE" ]; then
        echo "  ⚠️  $(basename $component)"
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
      
      # Suggest commit if many changes
      if [ $MODIFIED -gt 5 ]; then
        echo ""
        echo "💡 Tip: You have $MODIFIED changes. Consider committing soon."
      fi
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
    echo ""
    echo "Testing status:"
    $0 test-check
    ;;
    
  "pre-commit")
    echo "🚀 Running pre-commit checks..."
    echo "================================"
    
    # Run all checks
    $0 doc-check
    echo ""
    $0 test-check
    echo ""
    
    # Run type checking
    echo "📘 TypeScript Check:"
    if npm run type-check 2>/dev/null; then
      echo "✅ TypeScript checks passed"
    else
      echo "❌ TypeScript errors found"
    fi
    ;;
    
  *)
    echo "Available commands:"
    echo "  ./hooks-helper.sh doc-check   - Check documentation freshness"
    echo "  ./hooks-helper.sh test-check  - Check testing coverage"
    echo "  ./hooks-helper.sh git-check   - Check git status"
    echo "  ./hooks-helper.sh session     - Generate session summary"
    echo "  ./hooks-helper.sh pre-commit  - Run all pre-commit checks"
    ;;
esac