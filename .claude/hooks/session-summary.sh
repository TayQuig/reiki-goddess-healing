#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/taylorquigley/Documents/Directories/reiki-goddess-healing}"
cd "$PROJECT_DIR"

echo -e "${BLUE}📊 Session Summary Generator${NC}"
echo "============================"
echo ""
echo "Copy this summary to context_recovery.md or todo_list.md:"
echo ""
echo "---"
echo ""
echo "**Session Date:** $(date '+%Y-%m-%d')"
echo "**Time:** $(date '+%H:%M')"
echo ""

# Check git for recent changes
if [ -d .git ]; then
    echo "**Git Activity:**"
    
    # Count commits in last 4 hours
    recent_commits=$(git log --since="4 hours ago" --oneline 2>/dev/null | wc -l | tr -d ' ')
    if [ "$recent_commits" -gt 0 ]; then
        echo "- $recent_commits commit(s) in this session"
        git log --since="4 hours ago" --oneline 2>/dev/null | head -5 | sed 's/^/  - /'
    else
        echo "- No commits yet in this session"
    fi
    
    # Show files changed
    changed_files=$(git status -s 2>/dev/null | wc -l | tr -d ' ')
    if [ "$changed_files" -gt 0 ]; then
        echo "- $changed_files file(s) with uncommitted changes"
    fi
    echo ""
fi

# Check for test files created/modified today
echo "**Testing Progress:**"
test_files=$(find "$PROJECT_DIR/packages/shared-components/src" -name "*.test.tsx" -mtime -1 2>/dev/null | wc -l | tr -d ' ')
if [ "$test_files" -gt 0 ]; then
    echo "- $test_files test file(s) created/modified today"
    find "$PROJECT_DIR/packages/shared-components/src" -name "*.test.tsx" -mtime -1 -exec basename {} \; 2>/dev/null | head -5 | sed 's/^/  - /'
else
    echo "- No test files modified today"
fi
echo ""

echo "**Key Files Modified Today:**"
# Find recently modified important files
find "$PROJECT_DIR" -maxdepth 2 -name "*.md" -mtime -1 -type f 2>/dev/null | while read -r file; do
    basename "$file" | sed 's/^/- /'
done

echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Update context_recovery.md with session progress"
echo "2. Update todo_list.md session accomplishments"
echo "3. Commit changes if work is complete"
echo "4. Document any blockers or important decisions"
echo ""
echo "---"

# Reminder about context usage
echo ""
echo -e "${GREEN}💡 Remember:${NC} Check context usage and refresh at 75-80%"