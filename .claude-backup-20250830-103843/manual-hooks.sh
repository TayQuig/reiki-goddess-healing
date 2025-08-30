#!/bin/bash

# Manual hook runner for when automatic hooks fail
# Usage: ./.claude/manual-hooks.sh [command]

HOOKS_DIR="$(dirname "$0")/hooks"

case "$1" in
  "doc-check")
    $HOOKS_DIR/documentation-check.sh
    ;;
  "git-check")
    $HOOKS_DIR/git-status-check.sh
    ;;
  "git-enforce")
    python3 $HOOKS_DIR/git-enforce.py
    ;;
  "session")
    $HOOKS_DIR/session-summary.sh
    ;;
  *)
    echo "Available commands:"
    echo "  doc-check   - Check documentation freshness"
    echo "  git-check   - Check git status"
    echo "  git-enforce - Enforce git commits"
    echo "  session     - Generate session summary"
    ;;
esac