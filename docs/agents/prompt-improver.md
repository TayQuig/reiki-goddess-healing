# Sub-Agent Prompt Engineering Guide

A comprehensive guide for creating and improving sub-agent prompts following Anthropic's prompt engineering best practices.

## Core principles

### 1. Be clear and explicit

- Write detailed system prompts that clearly define the subagent's role, capabilities, and approach
- Include specific instructions, best practices, and constraints
- Think of the subagent as someone on their first day - provide all necessary context

### 2. Use structured formatting

- Organize prompts with clear sections (e.g., "When invoked:", "Key practices:", "For each task:")
- Use numbered lists for step-by-step processes
- Include checklists for comprehensive coverage

### 3. Add chain-of-thought reasoning

- Build explicit thinking steps into the prompt
- Guide the agent through a logical process
- Example: "1. Analyze → 2. Plan → 3. Execute → 4. Verify"

### 4. Make agents focused and specialized

- Create single-purpose agents rather than general ones
- Limit tool access to only what's necessary
- Write descriptions that clearly indicate when the agent should be used

### 5. Include examples and patterns

- Provide specific examples of expected behavior
- Show format templates for outputs
- Include concrete criteria and standards

### 6. Use proactive language

- Add phrases like "use PROACTIVELY" or "MUST BE USED" in descriptions
- Make agents action-oriented with clear triggers
- Specify when the agent should automatically engage

### 7. Test and iterate

- Start with Claude-generated agents as a foundation
- Test with real tasks and refine based on performance
- Version control project agents for team collaboration

### 8. Leverage role setting

- Begin prompts with clear role definition
- Help Claude adopt appropriate expertise and perspective
- Example: "You are a senior code reviewer ensuring high standards..."

## Example transformation

### Before (Poor prompt)

```markdown
---
name: tester
description: Runs tests
---

Run tests and fix them.
```

### After (Following best practices)

```markdown
---
name: test-runner
description: Use PROACTIVELY to run tests after code changes and fix any failures while preserving test intent
tools: Bash, Read, Edit, Grep
---

You are a test automation expert specializing in maintaining test suite health.

When invoked:

1. Identify which tests to run based on recent changes
2. Execute tests with appropriate commands
3. Analyze any failures systematically
4. Fix failing tests while preserving their original intent
5. Verify all fixes work correctly

Key practices:

- Run focused test suites first, then broader ones
- Read test output carefully to understand failures
- Check if failures are due to code changes or test issues
- Preserve test coverage and intent when fixing
- Add helpful error messages to tests when appropriate

For each failure:

- Identify root cause
- Determine if it's a test issue or code issue
- Apply minimal fix
- Document any significant changes

Always ensure test integrity is maintained while fixing issues.
```

## Prompt structure template

Use this template as a starting point for new sub-agents:

```markdown
---
name: agent-name
description: [Action-oriented description with PROACTIVE triggers]
tools: [Only necessary tools, comma-separated]
---

You are a [role/expertise] specializing in [specific domain].

When invoked:

1. [First step]
2. [Second step]
3. [Continue numbered steps]

Key practices:

- [Best practice 1]
- [Best practice 2]
- [Best practice 3]

For each [task/item]:

- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

[Additional constraints or requirements]
```

## Common patterns for different agent types

### Analysis agents

- Start with data gathering steps
- Include evaluation criteria
- Specify output format
- Add interpretation guidelines

### Automation agents

- Define clear triggers
- Include error handling steps
- Specify rollback procedures
- Add verification steps

### Review agents

- Provide detailed checklists
- Include priority levels
- Specify feedback format
- Add constructive improvement suggestions

### Debugging agents

- Include systematic investigation steps
- Add hypothesis formation
- Specify evidence collection
- Include fix verification

## Tips for improvement

1. **Review existing agents**: Look at well-performing agents for patterns
2. **Use concrete language**: Avoid vague instructions like "do good work"
3. **Set boundaries**: Clearly define what the agent should and shouldn't do
4. **Include context**: Explain why certain practices are important
5. **Format for scanning**: Use headers and lists for easy navigation
6. **Test edge cases**: Ensure prompts handle unusual scenarios
7. **Iterate based on results**: Refine prompts based on actual performance

## Performance optimization

- Keep prompts focused but comprehensive
- Balance detail with clarity
- Remove redundant instructions
- Group related instructions together
- Use consistent terminology throughout

## Related resources

- [Claude Code Sub-agents Documentation](https://docs.anthropic.com/en/docs/claude-code/sub-agents)
- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Claude 4 Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices)
