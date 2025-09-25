# Plans Directory

## Overview

This directory contains implementation plans for features in the Reiki Goddess Healing application. Each feature plan includes detailed task breakdowns, dependencies, and acceptance criteria.

## Directory Structure

```
/plans/
├── README.md                     # This file
├── CLAUDE.md                     # AI assistant instructions
├── template/                     # Template for new feature plans
│   ├── implementation-plan.md    # Detailed implementation strategy
│   ├── task-breakdown.yaml       # Task list with metadata
│   └── dependencies.json         # Task dependency graph
└── [feature-name]/              # Feature-specific plans
    ├── implementation-plan.md   # Detailed implementation strategy
    ├── task-breakdown.yaml      # Task list with metadata
    ├── dependencies.json        # Task dependency graph
    ├── acceptance-criteria.md   # Success metrics
    └── context/                 # Related documentation
        └── design-docs.md       # Links to design documents
```

## Creating a New Feature Plan

1. Copy the `template/` directory to a new directory named after your feature
2. Update all template files with feature-specific information
3. Define tasks in `task-breakdown.yaml`
4. Map dependencies in `dependencies.json`
5. Document acceptance criteria clearly

## Task Types

- **frontend**: React components, UI implementation
- **backend**: API endpoints, service logic
- **integration**: Service-to-service communication
- **testing**: Test implementation (unit, integration, E2E)
- **database**: Schema changes, migrations
- **security**: Security implementation, validation
- **performance**: Optimization tasks

## Agent Mapping

Each task type maps to a specialized implementation agent:

- `frontend` → `/docs/agents/implementation/frontend-agent.md`
- `backend` → `/docs/agents/implementation/backend-agent.md`
- `integration` → `/docs/agents/implementation/integration-agent.md`
- `testing` → `/docs/agents/implementation/testing-agent.md`
- `database` → `/docs/agents/implementation/database-agent.md`
- `security` → `/docs/agents/implementation/security-agent.md`
- `performance` → `/docs/agents/implementation/performance-agent.md`

## Best Practices

1. **Task Granularity**: Keep tasks small and focused (2-8 hours)
2. **Clear Dependencies**: Explicitly define task dependencies
3. **Acceptance Criteria**: Write testable, specific criteria
4. **Context Links**: Reference design docs, APIs, and requirements
5. **Priority Levels**: Use high/medium/low consistently

## Integration with `/implement-feature` Command

The `/implement-feature` command reads plans from this directory to:

1. Parse task breakdowns
2. Resolve dependencies
3. Dispatch tasks to appropriate agents
4. Track progress
5. Validate outputs

## Example Usage

```bash
# Implement a feature using its plan
/implement-feature booking-system

# The command will:
# 1. Read /plans/booking-system/
# 2. Execute tasks based on dependencies
# 3. Report progress via TodoWrite
```
