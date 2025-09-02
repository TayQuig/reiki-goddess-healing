#!/bin/bash

# Claude Code Hook Wrapper
# This script handles JSON input/output for Claude Code hooks

# Read JSON input from stdin
INPUT=$(cat)

# Extract hook event name and tool name from input
HOOK_EVENT=$(echo "$INPUT" | python3 -c "import sys, json; print(json.load(sys.stdin).get('hook_event_name', ''))")
TOOL_NAME=$(echo "$INPUT" | python3 -c "import sys, json; print(json.load(sys.stdin).get('tool_name', ''))")

# Get the directory where this script is located
HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"

# Route to appropriate hook based on event and tool
case "$1" in
  "PostToolUse")
    case "$2" in
      "Write"|"Edit"|"MultiEdit")
        # Pass input to git enforcement hook
        echo "$INPUT" | python3 "$HOOK_DIR/hooks/git-enforce.py"
        ;;
      "TodoWrite")
        # Pass input to todo completion hook
        echo "$INPUT" | python3 "$HOOK_DIR/hooks/todo-complete-auto.py"
        ;;
      "Bash")
        # Check if this is a test run command
        COMMAND=$(echo "$INPUT" | python3 -c "import sys, json; print(json.load(sys.stdin).get('params', {}).get('command', ''))")
        if [[ "$COMMAND" == *"npm test"* ]] || [[ "$COMMAND" == *"npm run test"* ]] || [[ "$COMMAND" == *"vitest"* ]]; then
          # Pass test output to documentation hook
          echo "$INPUT" | python3 "$HOOK_DIR/hooks/test-documentation.py"
        fi
        ;;
      *)
        # Default handler for other tools
        exit 0
        ;;
    esac
    ;;
  "PreToolUse")
    case "$2" in
      "Write"|"Edit"|"MultiEdit")
        # Pass input to pre-write check
        echo "$INPUT" | python3 "$HOOK_DIR/hooks/pre-write-check.py"
        ;;
      *)
        exit 0
        ;;
    esac
    ;;
  "Stop")
    # Pass input to documentation freshness check
    echo "$INPUT" | python3 "$HOOK_DIR/hooks/stop-auto-document.py"
    ;;
  "SessionEnd")
    # Generate session summary
    echo "$INPUT" | bash "$HOOK_DIR/hooks/session-summary.sh"
    ;;
  "UserPromptSubmit")
    # Check if user is asking about test status or context refresh
    PROMPT=$(echo "$INPUT" | python3 -c "import sys, json; print(json.load(sys.stdin).get('params', {}).get('prompt', ''))")
    if [[ "$PROMPT" == *"test"* ]] && ([[ "$PROMPT" == *"status"* ]] || [[ "$PROMPT" == *"summary"* ]] || [[ "$PROMPT" == *"context"* ]]); then
      # Generate test summary
      echo "$INPUT" | python3 "$HOOK_DIR/hooks/test-summary-generator.py"
    fi
    # Always validate user prompts
    echo "$INPUT" | python3 "$HOOK_DIR/hooks/prompt-validator.py"
    ;;
  *)
    # Unknown event, exit successfully
    exit 0
    ;;
esac