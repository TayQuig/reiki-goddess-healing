#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/taylorquigley/Documents/Directories/reiki-goddess-healing}"
cd "$PROJECT_DIR"

echo -e "${BLUE}🔍 Git Status Check${NC}"
echo "==================="

# Check current branch
current_branch=$(git branch --show-current 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${CYAN}Branch:${NC} $current_branch"
    
    # Check for uncommitted changes
    if [[ -n $(git status -s) ]]; then
        echo -e "${YELLOW}⚠️  Uncommitted changes detected:${NC}"
        echo ""
        
        # Show status with colors
        git status -s | while IFS= read -r line; do
            status="${line:0:2}"
            file="${line:3}"
            case "$status" in
                "M "*)  echo -e "${GREEN}  M${NC} $file (modified, staged)" ;;
                " M"*)  echo -e "${RED}  M${NC} $file (modified, not staged)" ;;
                "A "*)  echo -e "${GREEN}  A${NC} $file (added)" ;;
                "??"*)  echo -e "${YELLOW}  ?${NC} $file (untracked)" ;;
                "D "*)  echo -e "${RED}  D${NC} $file (deleted)" ;;
                *)      echo "  $line" ;;
            esac
        done
        
        echo ""
        echo -e "${YELLOW}📝 Next Steps:${NC}"
        echo "1. Review changes: git diff"
        echo "2. Stage files: git add <files>"
        echo "3. Commit with conventional format:"
        echo ""
        echo -e "${CYAN}git commit -m \"type(scope): description"
        echo ""
        echo "- Detail 1"
        echo "- Detail 2"
        echo ""
        echo "🤖 Generated with [Claude Code](https://claude.ai/code)"
        echo ""
        echo -e "Co-Authored-By: Claude <noreply@anthropic.com>\"${NC}"
        echo ""
        echo "Types: feat, fix, docs, test, refactor, style, chore"
    else
        echo -e "${GREEN}✅ Working directory clean${NC}"
        
        # Check if ahead of remote
        if git rev-parse --abbrev-ref --symbolic-full-name @{u} >/dev/null 2>&1; then
            ahead=$(git rev-list --count @{u}..HEAD 2>/dev/null)
            behind=$(git rev-list --count HEAD..@{u} 2>/dev/null)
            
            if [ "$ahead" -gt 0 ]; then
                echo -e "${YELLOW}⚠️  Branch is $ahead commit(s) ahead of remote${NC}"
                echo "   Consider: git push"
            fi
            
            if [ "$behind" -gt 0 ]; then
                echo -e "${YELLOW}⚠️  Branch is $behind commit(s) behind remote${NC}"
                echo "   Consider: git pull"
            fi
        fi
    fi
    
    # Show recent commits
    echo ""
    echo -e "${BLUE}📜 Recent commits:${NC}"
    git log --oneline -5 --color=always | sed 's/^/  /'
    
else
    echo -e "${RED}❌ Not a git repository${NC}"
fi