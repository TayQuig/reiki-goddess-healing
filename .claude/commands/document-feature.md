---
description: Research and document a new feature
argument-hint: [feature-name]
allowed-tools: Task, TodoWrite, Read, Write, Glob, Grep
---

# Document Feature Command

You are a documentation orchestrator that reads specialized prompts from `/docs/agents/documentation/` and spawns general-purpose agents to execute parallel research tasks.

## Process Overview

1. **Load Prerequisites**
   - Feature request details from user
   - Available agent prompts from `/docs/agents/documentation/`
   - Project context from CLAUDE.md files
   - Monorepo structure and conventions

2. **Analyze Feature Scope**
   - Break down the feature into logical research components
   - Identify affected packages in the monorepo structure
   - Map components to available documentation agent types
   - Determine parallelization opportunities

3. **Spawn Specialized Agents**
   - Read appropriate prompt template from `/docs/agents/documentation/[type]-agent.md`
   - Customize prompt with feature-specific details
   - Launch general-purpose agents with specialized instructions
   - Coordinate parallel research execution

4. **Coordinate Documentation**
   - Track progress using TodoWrite
   - Ensure consistent output format across agents
   - Monitor agent completion status
   - Synthesize findings into comprehensive documentation

## Agent Prompt Loading

### Available Agent Types

```
/docs/agents/documentation/
├── component-analyzer-agent.md      # React component analysis
├── api-researcher-agent.md          # API and backend research
├── database-analyst-agent.md        # Data model analysis
├── security-researcher-agent.md     # Security pattern research
├── design-extractor-agent.md        # Figma/design extraction
├── pattern-finder-agent.md          # Code pattern discovery
├── integration-researcher-agent.md  # Service integration analysis
└── test-coverage-analyst-agent.md   # Testing strategy research
```

### Agent Type Mapping

```yaml
agent_types:
  component: component-analyzer-agent.md
  api: api-researcher-agent.md
  database: database-analyst-agent.md
  security: security-researcher-agent.md
  design: design-extractor-agent.md
  pattern: pattern-finder-agent.md
  integration: integration-researcher-agent.md
  testing: test-coverage-analyst-agent.md
```

### Dynamic Prompt Customization

Each agent prompt contains placeholders that get replaced:

- `[FEATURE_NAME]` - Feature being documented
- `[COMPONENT_NAME]` - Specific component/area focus
- `[RESEARCH_SCOPE]` - Directories/packages to analyze
- `[OUTPUT_PATH]` - Documentation destination
- `[PROJECT_ROOT]` - Base project directory
- `[PERFORMANCE_LIMITS]` - Memory and time constraints
- `[RELATED_DOCS]` - Context documentation paths
- `[MONOREPO_STRUCTURE]` - Package organization details

### Example Agent Spawning

```markdown
# For a frontend component research task:

1. Read `/docs/agents/documentation/component-analyzer-agent.md`
2. Replace placeholders with task details:
   - [FEATURE_NAME] → "Appointment Booking System"
   - [COMPONENT_NAME] → "BookingForm"
   - [RESEARCH_SCOPE] → "apps/main/src packages/shared-components"
   - [OUTPUT_PATH] → "/docs/design/appointment-booking/components/booking-form.md"
3. Spawn general-purpose agent with customized prompt
```

## Repository-Specific Context

### Monorepo Structure

All agents receive awareness of the project structure:

```
reiki-goddess-healing/
├── apps/main/              # Main application
├── packages/               # Shared packages
│   ├── shared-components/  # Reusable React components
│   ├── design-system/      # Design tokens and theme
│   ├── shared-utils/       # Utility functions
│   └── shared-assets/      # Images and static assets
├── docs/                   # Documentation
│   ├── design/            # Feature documentation output
│   └── agents/            # Agent prompts
└── figma-screenshots/      # Design references
```

### Tech Stack Context

- React 18 + TypeScript + Vite 6
- TailwindCSS with custom design tokens
- Vitest for testing
- npm workspaces for monorepo
- Security patterns from ARCHITECTURE.md

## Quality Assurance

### Pre-Documentation Checks

1. Verify feature request is clear and scoped
2. Confirm relevant agent prompts exist
3. Check for existing documentation to avoid duplication
4. Validate output directory structure

### During Documentation

1. Track each agent task with TodoWrite
2. Monitor agent progress and status
3. Ensure agents stay within scope
4. Validate output format consistency

### Post-Documentation

1. Verify all agent outputs are complete
2. Check cross-references between documents
3. Ensure actionable recommendations
4. Update tracking files (todo_list.md)

## Documentation Output Structure

### Primary Location

`/docs/design/[feature-name]/`

### Required Files

- `overview.md` - Executive summary with business context
- `current-state-analysis.md` - Existing code and patterns
- `implementation-architecture.md` - Technical approach and design
- `components/[component-name].md` - Individual component analyses
- `integration-points.md` - Cross-package dependencies
- `technical-considerations.md` - Challenges, security, performance
- `design-implementation.md` - Figma-to-code mapping (when applicable)
- `testing-strategy.md` - Test requirements and approach

### Document Standards

- Use sentence case for headings (not title case)
- Include table of contents for documents > 5 sections
- Add "Related documents" section at the end
- Reference ARCHITECTURE.md patterns
- Link to relevant package CLAUDE.md files

## Coordination Patterns

### Parallel Execution

Agents without dependencies run simultaneously:

```
Component Analyzer ─┐
API Researcher ─────┼─→ Synthesis
Pattern Finder ─────┘
```

### Sequential Dependencies

Dependent research waits for prerequisites:

```
Design Extractor → Component Analyzer → Integration Researcher
```

### Context Sharing

When spawning dependent agents:

1. Include outputs from prerequisite research
2. Reference shared findings
3. Avoid duplicate analysis
4. Build on previous insights

## Example Usage

When documenting an "Appointment booking system" feature:

### 1. Feature Analysis

Break down into research areas:

- Frontend: Booking form UI components
- Backend: API endpoints for availability and booking
- Database: Appointment data models
- Security: Authentication and data validation
- Design: Figma components for booking flow
- Integration: Calendar and notification services

### 2. Agent Assignment

```yaml
agents_to_spawn:
  - type: design-extractor
    focus: "Booking UI components from Figma"

  - type: component-analyzer
    focus: "React components for booking flow"

  - type: api-researcher
    focus: "Booking and availability endpoints"

  - type: database-analyst
    focus: "Appointment and availability models"

  - type: security-researcher
    focus: "Booking validation and authentication"

  - type: integration-researcher
    focus: "Calendar and notification integrations"

  - type: test-coverage-analyst
    focus: "Booking system test requirements"
```

### 3. Expected Outputs

Each agent produces focused documentation:

- Design specifications and component mapping
- React component architecture and patterns
- API endpoint requirements and contracts
- Data model relationships and constraints
- Security requirements and validation rules
- Integration points and external dependencies
- Comprehensive testing strategy

## Error Handling

### Common Issues and Solutions

1. **Missing Agent Prompt**
   - Use most similar agent type
   - Create basic research instructions
   - Document need for new agent type

2. **Agent Timeout**
   - Reduce research scope
   - Break into smaller tasks
   - Increase time limits if critical

3. **Conflicting Findings**
   - Prioritize more recent code
   - Note discrepancies in documentation
   - Recommend clarification tasks

4. **Incomplete Research**
   - Document what was found
   - Note gaps for future research
   - Provide partial recommendations

### Recovery Strategies

- Save partial outputs immediately
- Track completed vs pending research
- Allow resumption from last checkpoint
- Document blockers clearly

## Performance Optimization

### Agent Resource Management

- **Concurrent Limit**: 3-5 agents typically
- **Heavy Tasks**: Run design extraction solo
- **Light Tasks**: Pattern finding can run many
- **Memory Budget**: Monitor total usage

### Caching Strategy

- Reuse discovered patterns
- Share common file reads
- Cache external research
- Store intermediate findings

### Time Management

- Set reasonable timeouts per agent
- Prioritize critical research
- Allow incremental documentation
- Plan for synthesis time

## Integration with Existing Workflows

### Workflow Sequence

1. `/document-feature` - Research and document (this command)
2. `/plan-feature` - Create implementation plan (uses documentation)
3. `/implement-feature` - Execute with code agents
4. `/test-feature` - Validate implementation

### Handoff Points

- Documentation provides comprehensive research
- Plans reference documentation sections
- Implementation uses documented patterns
- Tests validate documented requirements

### Update Tracking

- Add discovered tasks to `/docs/project/todo_list.md`
- Note important context in `/docs/project/context_recovery.md`
- Reference `/docs/project/ARCHITECTURE.md` patterns
- Update feature tracking documents

## Maintenance

### Updating Agent Prompts

1. Edit prompt in `/docs/agents/documentation/[type]-agent.md`
2. Test with single research task
3. No need to update this orchestrator
4. Changes apply to next agent spawn

### Adding New Agent Types

1. Create `/docs/agents/documentation/[new-type]-agent.md`
2. Follow existing agent template structure
3. Include all standard placeholders
4. Update agent type mapping above
5. Test with relevant feature

### Improving Documentation Quality

1. Review agent outputs regularly
2. Refine prompts based on results
3. Add new placeholders as needed
4. Share successful patterns

---

**Remember**: This command orchestrates documentation research by reading and customizing agent prompts dynamically, enabling continuous improvement of documentation quality without modifying the core orchestration logic.
