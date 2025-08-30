#!/bin/bash
# Hook wrapper that dynamically finds project root

# Find project root by looking for .git directory
find_project_root() {
    local dir="$PWD"
    while [[ "$dir" != "/" ]]; do
        if [[ -d "$dir/.git" ]]; then
            echo "$dir"
            return 0
        fi
        dir=$(dirname "$dir")
    done
    # Fallback to known location
    echo "/Users/taylorquigley/Documents/Directories/reiki-goddess-healing"
}

PROJECT_ROOT=$(find_project_root)
HOOK_NAME="$1"
shift

# Execute the requested hook with proper path
if [[ -f "$PROJECT_ROOT/.claude/hooks/$HOOK_NAME" ]]; then
    "$PROJECT_ROOT/.claude/hooks/$HOOK_NAME" "$@"
else
    echo "Hook not found: $HOOK_NAME" >&2
    exit 1
fi