---
description: Execute implementation using specialized agents
argument-hint: [feature-name]
allowed-tools: Task, TodoWrite, Read, Write, Edit, MultiEdit, Bash, Glob, Grep
---

# Implement Feature Command

You are an implementation orchestrator that reads specialized prompts from `/docs/agents/implementation/` and spawns general-purpose agents to execute parallel tasks.

## Process Overview

1. **Load Prerequisites**
   - Implementation plan from `/plans/feature-name/`
   - Documentation from `/docs/design/feature-name/`
   - Available agent prompts from `/docs/agents/implementation/`

2. **Analyze Tasks**
   - Identify task types (frontend, backend, integration, testing, etc.)
   - Map dependencies between tasks
   - Determine parallelization opportunities

3. **Spawn Specialized Agents**
   - Read appropriate prompt template from `/docs/agents/implementation/[type]-agent.md`
   - Customize prompt with task-specific details
   - Launch general-purpose agent with specialized instructions

4. **Coordinate Implementation**
   - Track progress using TodoWrite
   - Share context between dependent tasks
   - Validate outputs against acceptance criteria

## Agent Prompt Loading

### Available Agent Types

```
/docs/agents/implementation/
├── frontend-agent.md         # React component implementation
├── backend-agent.md          # API and service implementation
├── integration-agent.md      # Service integration tasks
├── testing-agent.md          # Test suite implementation
├── database-agent.md         # Database schema/migration
├── security-agent.md         # Security implementation
└── performance-agent.md      # Performance optimization
```

### Dynamic Prompt Customization

Each agent prompt contains placeholders that get replaced:

- `[TASK_ID]` - Unique task identifier
- `[TASK_NAME]` - Human-readable task name
- `[TASK_DESCRIPTION]` - Detailed task requirements
- `[ACCEPTANCE_CRITERIA]` - Specific success metrics
- `[DEPENDENCIES]` - Required inputs from other tasks
- `[CONTEXT_DOCS]` - Relevant documentation paths

### Example Orchestration

```markdown
# For a frontend task:

1. Read `/docs/agents/implementation/frontend-agent.md`
2. Replace placeholders with task details:
   - [TASK_NAME] → "BookingForm Component"
   - [CONTEXT_DOCS] → "/docs/design/booking-system/components/booking-form.md"
3. Spawn agent with customized prompt
```

## Repository-Specific Context

### Monorepo Structure

All agents receive awareness of:

```
reiki-goddess-healing/
├── apps/main/          # Main application
├── packages/           # Shared packages
│   ├── shared-components/
│   ├── design-system/
│   ├── shared-utils/
│   └── shared-assets/
├── docs/              # Documentation
└── figma-screenshots/ # Design references
```

### Tech Stack Integration

- React 18 + TypeScript + Vite
- TailwindCSS with design tokens
- Vitest for testing
- Security patterns from ARCHITECTURE.md

## Quality Assurance

### Pre-Implementation Checks

1. Verify plan exists in `/plans/[feature-name]/`
2. Confirm documentation in `/docs/design/[feature-name]/`
3. Check for existing components to reuse
4. Validate agent prompt templates exist

### During Implementation

1. Track each task with TodoWrite
2. Run type-check after TypeScript changes
3. Run lint after code changes
4. Execute tests for modified components

### Post-Implementation

1. Verify all acceptance criteria met
2. Run full test suite
3. Update documentation
4. Mark tasks complete in todo_list.md

## Progress Tracking

Each agent reports status in this format:

```yaml
task_id: T001
status: in_progress|completed|blocked
progress: 75%
blockers: []
completed_items:
  - Component structure created
  - TypeScript interfaces defined
  - Basic styling applied
remaining_items:
  - Animation implementation
  - Unit tests
estimated_completion: 2 hours
```

## Coordination Patterns

### Parallel Execution

Tasks without dependencies run simultaneously:

```
Frontend Components (T001) ─┐
Backend API (T002) ─────────┼─→ Integration (T005)
Database Schema (T003) ─────┘
```

### Sequential Dependencies

Dependent tasks wait for prerequisites:

```
Design Tokens (T001) → Component Library (T002) → Page Assembly (T003)
```

### Context Sharing

When spawning dependent agents:

1. Include outputs from prerequisite tasks
2. Reference shared type definitions
3. Provide integration points
4. Share test utilities

## Example Spawn Command

```markdown
Spawning Frontend Agent for Task T001:

_Reading /docs/agents/implementation/frontend-agent.md_
_Customizing prompt with:_

- Task: BookingForm Component
- Context: /docs/design/booking-system/
- Dependencies: Design tokens from T000
- Acceptance: Form validates input, integrates with SecurityValidator

"You are implementing the BookingForm component for The Reiki Goddess Healing project..."
[Full customized prompt from template]
```

## Error Handling

### Common Issues and Solutions

1. **Missing Agent Prompt**: Create basic template or use general instructions
2. **Circular Dependencies**: Refactor plan to break cycles
3. **Resource Conflicts**: Serialize access to shared resources
4. **Test Failures**: Agents must fix before marking complete

### Rollback Strategy

- Each task creates atomic commits
- Failed tasks don't block unrelated work
- Maintain working state throughout

## Integration with Existing Commands

### Workflow Sequence

1. `/document-feature` - Research and document
2. `/plan-feature` - Create implementation plan
3. `/implement-feature` - Execute with agents (this command)
4. `/test-feature` - Comprehensive validation

### Handoff Points

- Documentation provides component specs
- Plan provides task breakdown
- Implementation creates working code
- Testing validates requirements

## Performance Optimization

### Agent Resource Management

- Limit concurrent agents based on task complexity
- Typical: 3-5 agents for optimal performance
- Heavy tasks (Figma extraction): Run solo
- Light tasks (unit tests): Run many parallel

### Caching Strategy

- Reuse extracted design tokens
- Share compiled TypeScript definitions
- Cache dependency resolutions
- Store common test utilities

## Maintenance

### Updating Agent Prompts

1. Edit prompt in `/docs/agents/implementation/`
2. Test with single task
3. No need to update this command
4. Changes apply immediately

### Adding New Agent Types

1. Create new prompt template
2. Follow existing naming convention
3. Include all standard placeholders
4. Document in available agents list

---

**Remember**: This command orchestrates implementation by reading and customizing agent prompts, enabling continuous improvement of agent capabilities without modifying the core orchestration logic.
