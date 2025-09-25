# Example: Using the Document Feature Command

## Sample Feature Request

"Document the requirements for adding a contact form with email integration using Resend"

## How the Orchestrator Would Process This

### 1. Feature Analysis

The orchestrator breaks this down into:

- **Component**: Contact form UI component
- **API**: Form submission endpoint
- **Integration**: Resend email service
- **Security**: Form validation and spam protection
- **Testing**: Form interaction tests

### 2. Agent Selection and Customization

#### Component Analyzer Agent

```markdown
# Reading: /docs/agents/documentation/component-analyzer-agent.md

# Replacing placeholders:

- [FEATURE_NAME] → "Contact Form with Email Integration"
- [COMPONENT_NAME] → "ContactForm"
- [RESEARCH_SCOPE] → "apps/main/src/components packages/shared-components"
- [OUTPUT_PATH] → "/docs/design/contact-form-email/components/contact-form.md"
```

#### API Researcher Agent

```markdown
# Reading: /docs/agents/documentation/api-researcher-agent.md

# Replacing placeholders:

- [FEATURE_NAME] → "Contact Form with Email Integration"
- [RESEARCH_SCOPE] → "apps/main/src/api apps/main/api"
- [OUTPUT_PATH] → "/docs/design/contact-form-email/api-endpoints.md"
```

#### Integration Researcher Agent

```markdown
# Reading: /docs/agents/documentation/integration-researcher-agent.md

# Replacing placeholders:

- [FEATURE_NAME] → "Contact Form with Email Integration"
- [RESEARCH_SCOPE] → "apps/main packages"
- [OUTPUT_PATH] → "/docs/design/contact-form-email/resend-integration.md"
```

### 3. Parallel Execution

The orchestrator would spawn these agents simultaneously:

```
Component Analyzer ─┐
API Researcher ─────┼─→ Documentation Synthesis
Integration Research┘
```

### 4. Expected Output Structure

```
/docs/design/contact-form-email/
├── overview.md
├── current-state-analysis.md
├── components/
│   └── contact-form.md
├── api-endpoints.md
├── resend-integration.md
├── security-considerations.md
└── testing-strategy.md
```

## Key Benefits of This Approach

1. **Modularity**: Each agent can be updated independently
2. **Reusability**: The same agents work for any feature
3. **Parallelization**: Multiple agents research simultaneously
4. **Consistency**: All documentation follows the same format
5. **Maintainability**: Easy to add new agent types or update existing ones

## How to Test

1. Use the document-feature command with a sample request
2. Observe how it loads agent prompts dynamically
3. Check that placeholders are replaced correctly
4. Verify parallel agent execution
5. Review the synthesized documentation output
