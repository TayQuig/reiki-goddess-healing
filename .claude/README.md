# Claude Code Hooks Configuration

This directory contains automation hooks for Claude Code to help maintain documentation and git workflow consistency.

## 🚨 Current Status (2025-09-02)

**Hooks have been restored and should be functional.** The system now includes:

- Git commit enforcement at thresholds
- Documentation freshness checking
- Todo completion triggers
- Session summaries
- Prompt validation

## 🎯 What These Hooks Do

### 1. Git Protocol Enforcement
- **Trigger**: After Write/Edit/MultiEdit operations
- **Function**: Monitors file changes and suggests commits at thresholds:
  - 5+ general files modified
  - 3+ test files modified
  - 2+ documentation files updated
- **Output**: Exit code 2 with suggested commit message when threshold reached

### 2. Documentation Updates
- **Trigger**: When todos are completed or Claude stops responding
- **Function**: Checks documentation freshness and prompts updates if needed
- **Files monitored**: context_recovery.md, todo_list.md, testing-strategy.md, CLAUDE.md

### 3. Critical File Protection
- **Trigger**: Before Write/Edit operations
- **Function**: Warns before editing critical configuration files with uncommitted changes
- **Protected files**: package.json, tsconfig.json, vite.config.ts, etc.

### 4. Session Management
- **Trigger**: On session end
- **Function**: Generates session summary with git status and recent changes

### 5. Prompt Security
- **Trigger**: On user prompt submission
- **Function**: Validates prompts for sensitive information and adds helpful context

## 📁 Structure

```
.claude/
├── settings.json          # Hook configurations
├── hook.sh               # Main hook wrapper script
└── hooks/
    ├── git-enforce.py           # Git commit enforcement
    ├── pre-write-check.py       # Critical file protection
    ├── stop-auto-document.py    # Documentation freshness check
    ├── todo-complete-auto.py    # Todo completion handler
    ├── prompt-validator.py      # Prompt security validation
    └── session-summary.sh       # Session summary generator
```

## 🔧 Troubleshooting

### If hooks aren't working:

1. **Check configuration**: Run `/hooks` in Claude Code to see registered hooks
2. **Verify permissions**: Ensure scripts are executable:
   ```bash
   chmod +x .claude/hook.sh
   chmod +x .claude/hooks/*.py
   chmod +x .claude/hooks/*.sh
   ```
3. **Test manually**: Run hook commands directly to verify they work:
   ```bash
   echo '{"hook_event_name":"Stop"}' | .claude/hook.sh Stop
   ```
4. **Check Claude debug output**: Use `claude --debug` to see hook execution

### Manual Fallback

If hooks fail to trigger automatically, use the manual helper:
```bash
./hooks-helper.sh doc-check    # Check documentation freshness
./hooks-helper.sh test-check   # Check test coverage
./hooks-helper.sh git-check    # Check git status
./hooks-helper.sh session      # Generate session summary
```

## 🔒 Security Notes

- Hooks run with your user permissions
- Always review hook changes before accepting
- Scripts use `$CLAUDE_PROJECT_DIR` for project-specific paths
- Prompt validator blocks potential secrets

## 📋 Hook Behavior Reference

### Exit Codes
- **0**: Success, continue normally
- **2**: Block operation, show message to Claude
- **Other**: Error, show to user, continue

### JSON Output Format
Hooks can return JSON for more control:
```json
{
  "decision": "block",
  "reason": "Explanation for Claude",
  "hookSpecificOutput": {
    "additionalContext": "Extra information"
  }
}
```

## 💡 Tips

1. Hooks are loaded at Claude Code startup - restart to pick up changes
2. Use `/hooks` command to review current configuration
3. Check `.claude-session.log` for hook activity
4. Documentation reminders appear when files are >24 hours old
5. Git suggestions include conventional commit format

---

_Last Updated: 2025-09-02_
_For official documentation, see: https://docs.anthropic.com/en/docs/claude-code/hooks_