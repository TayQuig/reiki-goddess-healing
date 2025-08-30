#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/taylorquigley/Documents/Directories/reiki-goddess-healing}"

echo -e "${BLUE}📝 Documentation Status Check${NC}"
echo "================================"

# Check when key documentation files were last modified
check_file_freshness() {
    local file=$1
    local description=$2
    
    if [ -f "$PROJECT_DIR/$file" ]; then
        # Get last modified time in minutes
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            last_modified=$(( ($(date +%s) - $(stat -f %m "$PROJECT_DIR/$file")) / 60 ))
        else
            # Linux
            last_modified=$(( ($(date +%s) - $(stat -c %Y "$PROJECT_DIR/$file")) / 60 ))
        fi
        
        if [ $last_modified -lt 30 ]; then
            echo -e "${GREEN}✅ $description${NC} (updated ${last_modified} minutes ago)"
        elif [ $last_modified -lt 120 ]; then
            echo -e "${YELLOW}⚠️  $description${NC} (updated ${last_modified} minutes ago)"
        else
            hours=$((last_modified / 60))
            echo -e "${RED}❌ $description${NC} (updated ${hours} hours ago)"
        fi
    else
        echo -e "${RED}❌ $description not found${NC}"
    fi
}

# Check each critical documentation file
check_file_freshness "context_recovery.md" "Context Recovery"
check_file_freshness "todo_list.md" "Todo List"
check_file_freshness "testing-strategy.md" "Testing Strategy"
check_file_freshness "CLAUDE.md" "Claude Instructions"

echo ""
echo -e "${YELLOW}📋 Reminders:${NC}"
echo "• Update context_recovery.md when completing major milestones"
echo "• Update todo_list.md session accomplishments after task completion"
echo "• Update testing-strategy.md when adding new tests"
echo "• Keep CLAUDE.md current with new patterns discovered"

# Check if we're approaching context limit (this is a reminder)
echo ""
echo -e "${BLUE}💡 Don't forget to monitor context usage!${NC}"
echo "At 75-80% usage: Update all docs and prepare for context refresh"