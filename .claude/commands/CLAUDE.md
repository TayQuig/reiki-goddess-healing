# Claude Commands Directory

## Overview

This directory contains project-specific slash commands for The Reiki Goddess Healing project. These commands extend Claude Code's capabilities with specialized workflows.

## Available Commands

### Feature Development Workflow

1. `/document-feature [feature-name]` - Research and document a feature
2. `/plan-feature [feature-name]` - Create implementation plan with task breakdown
3. `/implement-feature [feature-name]` - Execute implementation using specialized agents

## Command Structure

### Required Elements

- **Frontmatter**: Define metadata (description, allowed-tools, argument-hint)
- **Clear Purpose**: Each command should have a single, well-defined purpose
- **Error Handling**: Include validation for required arguments
- **Progress Tracking**: Use TodoWrite for multi-step operations

### Naming Conventions

- Use kebab-case for command names
- Verb-noun pattern (e.g., `document-feature`, `plan-feature`)
- Keep names concise but descriptive

## Creating New Commands

### Template

```markdown
---
description: Brief description of what the command does
argument-hint: [required-arg] [optional-arg]
allowed-tools: List specific tools if needed
---

# Command Title

[Command implementation details]
```

### Best Practices

1. **Validate Inputs**: Check for required arguments and paths
2. **Use Existing Infrastructure**: Leverage `/docs/agents/` prompts
3. **Maintain State**: Use `/docs/project/` for persistent data
4. **Track Progress**: Update TodoWrite throughout execution
5. **Handle Errors**: Provide clear error messages and recovery steps

## Integration Points

### Agent Prompts

- Documentation agents: `/docs/agents/documentation/`
- Implementation agents: `/docs/agents/implementation/`
- Planning agents: `/docs/agents/planning/`

### Project Structure

- Plans directory: `/plans/[feature-name]/`
- Design docs: `/docs/design/[feature-name]/`
- Progress tracking: `/docs/project/todo_list.md`

## Command Dependencies

### Workflow Order

```
/document-feature → /plan-feature → /implement-feature
```

### Shared Resources

- Design tokens from Figma
- Component library patterns
- Security requirements from ARCHITECTURE.md
- Testing patterns from testing-strategy.md

## Maintenance

### Updating Commands

1. Edit the `.md` file directly
2. Changes take effect immediately
3. Test with sample inputs
4. Update this CLAUDE.md if adding new commands

### Deprecating Commands

1. Add deprecation notice to command description
2. Point to replacement command if applicable
3. Remove after transition period

## Testing Commands

### Quick Test

```bash
# Test document-feature
/document-feature test-feature

# Test plan-feature
/plan-feature test-feature

# Test implement-feature
/implement-feature test-feature
```

### Validation Checklist

- [ ] Command appears in `/help`
- [ ] Arguments are parsed correctly
- [ ] Tools are properly scoped
- [ ] Progress is tracked
- [ ] Errors are handled gracefully

## Security Considerations

### Tool Permissions

- Only request necessary tools in `allowed-tools`
- Avoid broad permissions like `*`
- Specify exact commands for Bash tool

### File Access

- Validate all file paths
- Stay within project boundaries
- Don't expose sensitive information

## Future Enhancements

### Planned Commands

- `/test-feature` - Run comprehensive test suite
- `/deploy-feature` - Handle deployment workflow
- `/review-feature` - Code review checklist

### Infrastructure Needs

- Command composition (chaining commands)
- Conditional execution based on results
- Progress persistence across sessions
