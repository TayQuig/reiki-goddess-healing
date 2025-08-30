#!/bin/bash

# This script generates instructions for Claude to update documentation
# It outputs to stdout so Claude can see and act on it

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/taylorquigley/Documents/Directories/reiki-goddess-healing}"
cd "$PROJECT_DIR"

# Get current date and time
DATE=$(date '+%Y-%m-%d')
TIME=$(date '+%H:%M')

# Count recent git activity
if [ -d .git ]; then
    recent_commits=$(git log --since="4 hours ago" --oneline 2>/dev/null | wc -l | tr -d ' ')
    changed_files=$(git status -s 2>/dev/null | wc -l | tr -d ' ')
    
    # Get list of modified test files
    test_files=$(git status --porcelain 2>/dev/null | grep -E '\.test\.(tsx?|jsx?)$' | wc -l | tr -d ' ')
fi

# Output instructions for Claude to execute
cat << EOF
Please update the project documentation with the following session information:

1. In todo_list.md, add to "Session Accomplishments ($DATE)":
   - Session time: $TIME
   - Files modified: $changed_files
   - Test files created/updated: $test_files
   - Any completed todo items from the current session

2. In context_recovery.md, update the "Last Major Updates" section if any significant milestones were reached.

3. In testing-strategy.md, update the coverage percentages if tests were added.

Remember to follow the existing format in each file.
EOF

# Exit with code 2 to send this to Claude
exit 2