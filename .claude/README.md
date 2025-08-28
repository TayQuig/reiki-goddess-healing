# Claude Code Hooks Configuration

This directory contains automation hooks and scripts for Claude Code to help maintain documentation and git workflow consistency.

## 🎯 What These Hooks Do

### Git Protocol Enforcement (NEW!)

- **Git Enforce Hook**: Automatically prompts commits when thresholds are reached (5+ files, 3+ test files)
- **Pre-Write Check**: Warns before editing critical files with uncommitted changes
- **Smart Commit Messages**: Generates conventional commit messages based on file changes
- **Branch Protection**: Suggests feature branches for large changesets

### Automated Documentation Updates

- **Smart TodoWrite Hook**: When todos are marked complete, Claude automatically updates documentation
- **Smart Stop Hook**: Detects when docs need updating and prompts Claude to update them
- **Auto-Update Detection**: Monitors file changes and documentation age

### Automated Reminders

- **Test File Creation**: Prompts to update testing-strategy.md when test files are created
- **Git Status Check**: Shows uncommitted changes with commit guidance
- **Session End**: Generates a session summary automatically
- **Git Commit Helper**: Provides conventional commit format when you mention commits

## 📁 Structure

```
.claude/
├── settings.json          # Hook configurations (committed to git)
├── settings.local.json    # Personal overrides (gitignored)
├── session-logs.txt       # Session summaries (gitignored)
├── hooks/
│   ├── git-enforce.py            # Enforces git commits at thresholds
│   ├── pre-write-check.py        # Checks before critical file edits
│   ├── stop-auto-document.py     # Smart hook that prompts Claude to update docs
│   ├── todo-complete-auto.py     # Prompts Claude when todos are completed
│   ├── documentation-check.sh    # Manual check of doc freshness
│   ├── git-status-check.sh       # Shows git status with guidance
│   ├── session-summary.sh        # Generates session summary
│   ├── todo-complete-reminder.sh # Quick todo checklist (legacy)
│   └── auto-update-docs.sh       # Alternative auto-update script
└── README.md             # This file
```

## 🚀 How to Use

### Git Protocol Enforcement

The hooks now enforce proper git workflows automatically:

1. **Commit Thresholds**: `git-enforce.py` triggers when:
   - 5+ files changed (general threshold)
   - 3+ test files modified (testing threshold)
   - 2+ documentation files updated (docs threshold)
   - Claude will be prompted to commit with a suggested message

2. **Critical File Protection**: `pre-write-check.py` warns when:
   - Editing package.json, tsconfig.json, or other critical configs
   - You have 10+ uncommitted changes
   - Gives you a chance to commit before proceeding

3. **Smart Commit Messages**: Automatically generates:
   - Correct type (feat, fix, test, docs, etc.) based on files
   - Appropriate scope based on changed paths
   - Descriptive message with file counts
   - Includes Co-Authored-By for Claude

### Automatic Documentation Updates

The enhanced hooks can now prompt Claude to automatically update documentation:

1. **When you complete todos**: The `todo-complete-auto.py` hook detects completed tasks and prompts Claude to update the relevant documentation files
2. **After significant work**: The `stop-auto-document.py` hook monitors:
   - Number of uncommitted changes
   - Test files modified
   - Documentation age
   - When thresholds are met, it prompts Claude to update docs

3. **How it works**: These hooks use exit code 2 or JSON output with `"decision": "block"` to send instructions back to Claude, who then performs the updates automatically

### For New Sessions

1. The hooks are automatically loaded when you start Claude Code
2. They run automatically based on your actions:
   - After updating todos (prompts doc updates)
   - After Claude finishes responding (checks if docs need updating)
   - When ending a session (saves summary)

### Manual Commands

You can run the scripts manually anytime:

```bash
# Check documentation freshness
.claude/hooks/documentation-check.sh

# Check git status with guidance
.claude/hooks/git-status-check.sh

# Generate session summary
.claude/hooks/session-summary.sh

# Get todo completion reminder
.claude/hooks/todo-complete-reminder.sh
```

## 🔧 Customization

### Personal Overrides

Create `.claude/settings.local.json` for personal settings that won't be committed:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "YourCustomPattern",
        "hooks": [
          {
            "type": "command",
            "command": "your-custom-command"
          }
        ]
      }
    ]
  }
}
```

### Modifying Scripts

All scripts are in `.claude/hooks/` and can be edited to suit your workflow.

## 📋 Current Hooks

### PostToolUse Hooks

- **TodoWrite**: Shows documentation update reminders
- **Write/MultiEdit on test files**: Reminds to update testing-strategy.md

### Stop Hook

- Runs git status check
- Shows documentation freshness

### SessionEnd Hook

- Generates session summary
- Saves to session-logs.txt

### UserPromptSubmit Hook

- Shows git commit format when you mention commits

## 🎨 Color Coding in Scripts

- 🟢 **Green**: Up-to-date, success
- 🟡 **Yellow**: Warnings, needs attention
- 🔴 **Red**: Errors, outdated
- 🔵 **Blue**: Information headers
- 🔷 **Cyan**: Commands, branch names

## 🔒 Security Notes

- All scripts run with your user permissions
- Scripts are project-specific using `$CLAUDE_PROJECT_DIR`
- Review any hook changes before accepting them
- Local settings override committed settings

## 💡 Best Practices

1. **Keep docs updated**: Update documentation files when freshness warnings appear
2. **Commit regularly**: Use the git status check to stay on top of changes
3. **Use session summaries**: Copy them to context_recovery.md for handoffs
4. **Monitor context usage**: Hooks will remind you, but stay aware

## 🐛 Troubleshooting

If hooks aren't working:

1. Check hooks are enabled: Run `/hooks` in Claude Code
2. Verify scripts are executable: `chmod +x .claude/hooks/*.sh`
3. Check for syntax errors in settings.json
4. Use `claude --debug` to see hook execution details

## 📚 Related Documentation

- Main project instructions: `CLAUDE.md`
- Context management: `context_recovery.md`
- Task tracking: `todo_list.md`
- Testing metrics: `testing-strategy.md`
