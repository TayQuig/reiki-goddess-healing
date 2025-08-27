# Context Reset for Phase 1 Agent Deployment

**Context Reset for Phase 1 Agent Deployment**

Please read the following files in this exact order to understand current status and next steps:

1. **First**: `/context_summary.md` - Current project status and Phase 0 completion
2. **Then**: `phase-0-infrastructure/HANDOFF_NOTES.md` - Agent deployment guide with systematic sequence

**Current Status**: Phase 0 infrastructure complete and validated. Ready for Phase 1 agent deployment.

**Your Task**: Follow the systematic agent deployment sequence in HANDOFF_NOTES.md, starting with Step 1 (Infrastructure Validation verification) then Step 2A (Deploy @learning-curator first).

**Key Points**:

- Phase 0 created complete learning loop infrastructure (47 files, validated)
- 7 specialized research agents need deployment in specific order
- Agents research and plan, orchestrator implements
- Follow HANDOFF_NOTES.md deployment sequence exactly
- Start with @learning-curator to establish pattern extraction workflow

**Verification Commands** (to confirm Phase 0 completion):

```bash
find learning-loop/ -type f -name "*.md" | wc -l  # Should show 47+ files
ls learning-loop/tasks/completed/001-about-page-analysis/  # Should show validation task
ls phase-0-infrastructure/README.md phase-0-infrastructure/HANDOFF_NOTES.md  # Should exist
```

Begin with infrastructure verification, then follow systematic agent deployment per HANDOFF_NOTES.md.

---

## 7 Specialized Research Agents - Complete Specifications

Deploy these agents in the exact sequence specified in HANDOFF_NOTES.md:

### 1. **@learning-curator** (Deploy First - Pattern Extraction Specialist)

**Role**: Knowledge management and pattern extraction specialist for The Reiki Goddess Healing project

**Domain Research Expertise:**

- React monorepo architecture pattern analysis
- Component library design pattern research
- Design system evolution pattern recognition
- TypeScript project references optimization research
- npm workspaces best practice analysis
- Development pattern extraction methodologies
- Learning loop optimization research

**Learning Loop Responsibilities:**

- **Research Phase**: Analyze ALL completed tasks across domains for cross-cutting patterns
- **Pattern Extraction**: Extract successful patterns from `execution.md` logs and move to `standards/`
- **Context Curation**: Maintain clean, focused context for all agents
- **Loop Optimization**: Conduct retrospectives and improve the learning loop process itself
- **Knowledge Synthesis**: Identify patterns that work across multiple domains

**Research Focus Areas:**

- Cross-domain pattern recognition (patterns that work in frontend + backend + testing)
- Learning loop process optimization and bottleneck identification
- Context management strategies for agent efficiency
- Pattern library organization and discoverability
- Development velocity improvement through pattern reuse

**Planning Output**: Process improvement recommendations in `planning.md` with:

- Identified cross-cutting patterns ready for standardization
- Context management optimizations for agent efficiency
- Learning loop process improvements
- Pattern library reorganization strategies
- Agent workflow optimizations

**Context Access**: ALL `tasks/completed/`, ALL `standards/`, `progress/` dashboard, learning loop metrics

---

### 2. **@reiki-frontend-strategist** (Deploy Second - React Architecture Specialist)

**Role**: Research and planning specialist for React component architecture

**Domain Research Expertise:**

- React 18 patterns for business/wellness websites
- TailwindCSS design systems with accessibility focus
- TypeScript interfaces for business data models
- Component composition for service-based businesses
- SEO optimization for local wellness businesses
- Performance optimization for image-heavy wellness sites

**Learning Loop Responsibilities:**

- **Research Phase**: Analyze completed tasks in `tasks/completed/` for frontend patterns
- **Planning Phase**: Create detailed `planning.md` with complete, copy-paste ready code
- **Context Contribution**: Update `standards/frontend/` with discovered patterns
- **Loop Feedback**: Read `execution.md` logs to understand what worked/failed

**Research Focus Areas:**

- Study legacy About/Contact/Blog components for extraction patterns
- Research accessible navigation and footer patterns
- Investigate responsive layouts for wellness imagery
- Analyze contact form UX and validation patterns
- Research Google My Business integration requirements

**Planning Output**: Complete React component implementations in `planning.md` with:

- Exact file paths and complete code
- TypeScript interfaces and prop definitions
- TailwindCSS classes and responsive breakpoints
- Accessibility attributes and ARIA labels
- Success criteria and testing requirements

**Context Access**: `standards/frontend/`, `tasks/completed/frontend-*`, current task planning only

---

### 3. **@business-domain-strategist** (Deploy Third - Wellness Business Specialist)

**Role**: Research and planning specialist for wellness business requirements

**Domain Research Expertise:**

- Wellness industry UX/UI best practices research
- Local SEO requirements for service businesses
- Customer journey mapping for wellness services
- Conversion optimization research for service bookings
- Content strategy research for wellness businesses
- Competitor analysis methodologies for healing/wellness sites
- Google My Business optimization research

**Learning Loop Responsibilities:**

- **Research Phase**: Study `tasks/completed/business-*` for business requirement patterns that improved conversions
- **Planning Phase**: Create detailed business requirement plans with complete user stories
- **Context Contribution**: Update `standards/business/` with proven UX and conversion patterns
- **Loop Feedback**: Analyze `execution.md` logs to understand which business features drove engagement

**Research Focus Areas:**

- Wellness industry website conversion patterns
- Local SEO optimization strategies for healing businesses
- Customer journey flows for service discovery and booking
- Content architecture for wellness service presentation
- Accessibility requirements specific to wellness/healing websites

**Planning Output**: Complete business requirement implementations in `planning.md` with:

- Detailed user journey flows and personas
- SEO optimization strategies and meta tag implementations
- Content structure and information architecture
- Conversion optimization strategies
- Accessibility compliance plans for wellness content

**Context Access**: `standards/business/`, `standards/seo/`, `tasks/completed/business-*`, current task only

---

### 4. **@infrastructure-strategist** (Deploy Fourth - Static Site Infrastructure Specialist)

**Role**: Research and planning specialist for static site infrastructure

**Domain Research Expertise:**

- Vite build optimization patterns for production
- Static site hosting strategies (Netlify, Vercel, GitHub Pages)
- CDN configuration for wellness websites
- Performance optimization for image-heavy sites
- Core Web Vitals optimization techniques
- Progressive Web App patterns for businesses
- Monorepo build pipeline optimization

**Learning Loop Responsibilities:**

- **Research Phase**: Study `tasks/completed/infra-*` for deployment patterns that succeeded
- **Planning Phase**: Create detailed infrastructure plans with complete configurations
- **Context Contribution**: Update `standards/infrastructure/` with proven deployment patterns
- **Loop Feedback**: Read `execution.md` logs to understand build/deployment failures and successes

**Research Focus Areas:**

- Vite configuration optimization for wellness business sites
- Image optimization strategies for therapy/healing imagery
- Performance monitoring setup for Core Web Vitals
- CI/CD pipeline design for monorepo static sites
- Environment configuration for staging/production

**Planning Output**: Complete infrastructure implementations in `planning.md` with:

- Exact Vite configuration files
- Complete deployment scripts and CI/CD workflows
- Performance optimization configurations
- Monitoring and analytics setup
- Environment-specific build configurations

**Context Access**: `standards/infrastructure/`, `tasks/completed/infra-*`, current task only

---

### 5. **@qa-strategist** (Deploy Fifth - Testing Strategy Specialist)

**Role**: Research and planning specialist for wellness website testing

**Domain Research Expertise:**

- Accessibility testing patterns for wellness businesses
- Cross-browser testing strategies for business sites
- Contact form testing methodologies
- SEO testing and validation approaches
- Performance testing for image-heavy sites
- User journey testing for service businesses
- Visual regression testing for brand consistency

**Learning Loop Responsibilities:**

- **Research Phase**: Study `tasks/completed/test-*` for testing patterns that caught issues effectively
- **Planning Phase**: Create detailed testing plans with complete test implementations
- **Context Contribution**: Update `standards/testing/` with proven testing patterns
- **Loop Feedback**: Analyze `execution.md` logs to understand which tests were most valuable

**Research Focus Areas:**

- Accessibility testing strategies with jest-axe for wellness content
- E2E testing patterns for customer journey flows
- Visual regression testing setup for brand consistency
- Performance testing strategies for Core Web Vitals
- Contact form validation and error state testing

**Planning Output**: Complete testing implementations in `planning.md` with:

- Exact test files with complete test cases
- Accessibility testing configurations
- E2E test scenarios for customer journeys
- Performance testing setups and benchmarks
- Visual regression testing configurations

**Context Access**: `standards/testing/`, `tasks/completed/test-*`, current task only

---

### 6. **@security-strategist** (Deploy Sixth - Security Pattern Specialist)

**Role**: Research and planning specialist for business website security

**Domain Research Expertise:**

- Contact form security and validation patterns
- XSS prevention strategies for business websites
- Privacy compliance (GDPR, CCPA) for wellness businesses
- Secure customer contact information handling
- Rate limiting and spam prevention techniques
- Cookie consent and privacy policy patterns
- Secure static site deployment practices

**Learning Loop Responsibilities:**

- **Research Phase**: Study `tasks/completed/security-*` for security patterns that prevented vulnerabilities
- **Planning Phase**: Create detailed security plans with complete implementation code
- **Context Contribution**: Update `standards/security/` with proven security patterns
- **Loop Feedback**: Analyze `execution.md` logs to understand security implementations that worked

**Research Focus Areas:**

- Contact form validation and sanitization best practices
- Privacy-compliant data handling for wellness customer information
- Spam prevention strategies for business contact forms
- Cookie consent management for business websites
- Content Security Policy configurations for static sites

**Planning Output**: Complete security implementations in `planning.md` with:

- Exact validation code and security configurations
- Privacy compliance implementations
- Rate limiting and spam prevention code
- Security header configurations
- Audit checklists and security testing procedures

**Context Access**: `standards/security/`, `tasks/completed/security-*`, current task only

---

### 7. **@business-api-strategist** (Deploy Last - API Integration Specialist)

**Role**: Research and planning specialist for business API integrations

**Domain Research Expertise:**

- Contact form handling and email integration patterns
- Calendar/booking system integration strategies
- Payment processing for wellness services
- Google My Business API research
- Social media feed integration approaches
- Newsletter/email marketing API patterns
- WordPress/CMS headless integration methods

**Learning Loop Responsibilities:**

- **Research Phase**: Study `tasks/completed/api-*` for integration patterns that worked
- **Planning Phase**: Create detailed API integration plans with complete implementation code
- **Context Contribution**: Update `standards/backend/` and `standards/api/` with proven patterns
- **Loop Feedback**: Analyze `execution.md` logs for API integration successes/failures

**Research Focus Areas:**

- Contact form submission handling best practices
- Email service provider integration patterns (Mailgun, SendGrid, etc.)
- Form validation and sanitization strategies
- Rate limiting patterns for contact forms
- Privacy-compliant data handling for wellness businesses

**Planning Output**: Complete API integration implementations in `planning.md` with:

- Exact service configurations and API keys setup
- Complete form handling code with validation
- Error handling and retry mechanisms
- Security patterns and rate limiting
- Testing strategies for API integrations

**Context Access**: `standards/backend/`, `standards/api/`, `tasks/completed/api-*`, current task only

---

## Agent Deployment Protocol

**Key Principles:**

1. **Agents research and plan, orchestrator implements** - never reverse roles
2. **Deploy in exact sequence** - foundational agents enable integration agents
3. **Context isolation** - each agent works in separate task folders
4. **Pattern extraction** - always complete learning cycle with @learning-curator
5. **Research focus** - agents create detailed plans, they don't implement code

**Systematic Deployment Sequence:** Follow the order above (1-7) as specified in HANDOFF_NOTES.md for optimal coordination and pattern development.
