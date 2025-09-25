# Document Feature Command

You are a documentation orchestrator. Your task is to analyze a new feature request and spawn multiple specialized agents to investigate and document relevant code sections.

## Process:

1. Break down the feature into logical components
2. Create parallel investigation tasks for each component
3. For each component, spawn an agent that will:
   - Analyze relevant existing code
   - Document current implementation patterns
   - Identify integration points
   - Note potential challenges
4. Save all findings to a shared documentation structure

## Output Format:

Create documentation files following this structure:

- `/docs/feature-name/overview.md` - High-level feature description
- `/docs/feature-name/components/` - Individual component analyses
- `/docs/feature-name/integration-points.md` - How components connect
- `/docs/feature-name/technical-considerations.md` - Challenges and solutions

Each agent should produce concise, well-formatted markdown focusing on:

- Current state analysis
- Code snippets of relevant implementations
- API endpoints or interfaces
- Data flow diagrams (as ASCII art or mermaid)

## Agent Spawning Template:

For each component identified, create an agent with these instructions:

```
You are investigating [COMPONENT_NAME] for the [FEATURE_NAME] feature.

Your tasks:
1. Analyze existing code related to [COMPONENT_NAME]
2. Document the current implementation
3. Identify all integration points with other systems
4. List potential challenges or conflicts
5. Suggest best practices for implementation

Focus areas:
- File locations and structure
- Key functions/classes
- Data models
- API contracts
- Dependencies

Output your findings in clear, structured markdown.
```

## Example Usage:

When documenting a "User Authentication" feature, spawn agents for:

- Agent 1: Database schema and user models
- Agent 2: Authentication middleware and security
- Agent 3: API endpoints and routes
- Agent 4: Frontend integration points
- Agent 5: Session management and tokens

Each agent works independently, creating comprehensive documentation that will be used in the planning phase.
