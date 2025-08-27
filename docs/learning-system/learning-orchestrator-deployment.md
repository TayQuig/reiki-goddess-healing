# Learning Orchestrator Enhancement - Deployment Prompt

## Objective

Enhance the orchestrator/executor in The Reiki Goddess Healing project with advanced self-reflection and learning capabilities to improve execution quality over time.

## Prerequisites

- Completed Phase 1 deployment (7/7 agents)
- Access to `learning-loop/` directory structure
- Existing orchestrator implementation

## Implementation Tasks

### Task 1: Create Learning Memory Structure

```bash
# Create enhanced directory structure for learning storage
mkdir -p learning-loop/memory/{short-term,long-term,working-memory}
mkdir -p learning-loop/memory/long-term/{architectural-decisions,component-patterns,integration-gotchas}
mkdir -p learning-loop/metrics
mkdir -p learning-loop/templates/successful-patterns
```

### Task 2: Implement Execution Score Card System

Create `learning-loop/orchestrator/scoring_system.py`:

```python
class ExecutionScoreCard:
    """
    Quantifiable metrics for each task execution
    """
    def __init__(self, task_id):
        self.task_id = task_id
        self.scores = {
            'accuracy': 0,      # Did task achieve intended outcome? (0-100)
            'efficiency': 0,    # Time/resources vs baseline (0-100)
            'reusability': 0,   # How much can be templated? (0-100)
            'surprise': 0       # Unexpected valuable findings (0-100)
        }
        self.metadata = {
            'timestamp': None,
            'agent': None,
            'task_type': None,
            'execution_time': None
        }

    def calculate_overall_score(self):
        return sum(self.scores.values()) / len(self.scores)

    def trigger_reflection(self):
        """Auto-trigger based on thresholds"""
        overall = self.calculate_overall_score()
        if overall < 60:
            return "mandatory_reflection", "Low performance - root cause analysis required"
        elif overall > 90:
            return "extract_template", "High performance - extract as best practice"
        elif self.scores['surprise'] > 70:
            return "update_architecture", "High surprise factor - review assumptions"
        return None, None
```

### Task 3: Create Pattern Recognition System

Create `learning-loop/orchestrator/pattern_extractor.py`:

```python
import json
from datetime import datetime
from pathlib import Path

class PatternExtractor:
    """
    Automated pattern recognition from execution history
    """
    def __init__(self, memory_path="learning-loop/memory"):
        self.memory_path = Path(memory_path)
        self.patterns = {
            'success_patterns': [],
            'failure_patterns': [],
            'performance_patterns': [],
            'dependency_patterns': []
        }

    def capture_execution_metadata(self, task_id, phase):
        """
        Capture metadata at different execution phases
        """
        metadata = {
            'task_id': task_id,
            'phase': phase,  # 'pre', 'during', 'post'
            'timestamp': datetime.now().isoformat(),
            'data': {}
        }

        if phase == 'pre':
            metadata['data'] = {
                'initial_state': self.capture_state(),
                'assumptions': self.list_assumptions(),
                'dependencies': self.check_dependencies()
            }
        elif phase == 'during':
            metadata['data'] = {
                'decision_points': [],
                'alternatives_considered': [],
                'time_elapsed': 0
            }
        elif phase == 'post':
            metadata['data'] = {
                'outcomes': [],
                'deviations': [],
                'discoveries': []
            }

        return metadata

    def extract_patterns(self, execution_history):
        """
        Identify recurring patterns from execution history
        """
        # Analyze for success patterns
        successful_tasks = [t for t in execution_history if t.score > 80]
        self.patterns['success_patterns'] = self.find_commonalities(successful_tasks)

        # Analyze for failure patterns
        failed_tasks = [t for t in execution_history if t.score < 60]
        self.patterns['failure_patterns'] = self.find_commonalities(failed_tasks)

        return self.patterns
```

### Task 4: Implement Learning Query Interface

Create `learning-loop/orchestrator/learning_query.py`:

```python
class LearningQueryInterface:
    """
    Smart retrieval system for past learnings
    """
    def __init__(self, memory_path="learning-loop/memory"):
        self.memory_path = memory_path
        self.index = self.build_index()

    def query(self, query_string):
        """
        Natural language query interface
        Examples:
        - "What failed last time we tried booking component?"
        - "Show me all Reiki-specific UI patterns that worked"
        - "Common Square API integration issues"
        """
        # Parse query intent
        intent = self.parse_query_intent(query_string)

        # Search relevant memories
        results = self.search_memories(intent)

        # Format response with actionable insights
        return self.format_insights(results)

    def get_similar_executions(self, current_task):
        """
        Find similar past executions for current task
        """
        return self.query(f"similar tasks to {current_task.type} with {current_task.component}")
```

### Task 5: Create Main Learning Orchestrator

Create `learning-loop/orchestrator/learning_orchestrator.py`:

```python
from scoring_system import ExecutionScoreCard
from pattern_extractor import PatternExtractor
from learning_query import LearningQueryInterface
import json
from datetime import datetime

class LearningOrchestrator:
    """
    Enhanced orchestrator with self-reflection capabilities
    """
    def __init__(self):
        self.pattern_extractor = PatternExtractor()
        self.query_interface = LearningQueryInterface()
        self.memory = {
            'reiki_patterns': [],      # Domain-specific learnings
            'square_api': [],          # Payment integration learnings
            'component_library': [],   # Reusable UI components
            'agent_performance': {}    # Which agents are most effective
        }
        self.current_sprint = None

    def execute_with_learning(self, task):
        """
        Main execution loop with learning integration
        """
        # 1. Pre-execution learning check
        print(f"[LEARNING] Checking past executions for: {task.id}")
        similar_tasks = self.query_interface.get_similar_executions(task)
        if similar_tasks:
            self.apply_past_learnings(task, similar_tasks)

        # 2. Capture pre-execution state
        pre_metadata = self.pattern_extractor.capture_execution_metadata(task.id, 'pre')
        self.save_metadata(pre_metadata)

        # 3. Execute with monitoring
        print(f"[EXECUTING] Task: {task.id}")
        start_time = datetime.now()
        result = self.execute_task(task, monitor=True)
        execution_time = (datetime.now() - start_time).seconds

        # 4. Score the execution
        score_card = ExecutionScoreCard(task.id)
        score_card.scores = self.calculate_scores(result, execution_time)

        # 5. Post-execution reflection
        post_metadata = self.pattern_extractor.capture_execution_metadata(task.id, 'post')
        post_metadata['data']['outcomes'] = result
        self.save_metadata(post_metadata)

        # 6. Extract learnings
        learnings = self.extract_learnings(result, score_card)
        self.update_memory(learnings)

        # 7. Check if reflection needed
        action, reason = score_card.trigger_reflection()
        if action:
            self.perform_reflection(action, reason, task, result)

        # 8. Generate improvement suggestions
        improvements = self.suggest_next_improvements(learnings)

        return {
            'result': result,
            'score': score_card.calculate_overall_score(),
            'learnings': learnings,
            'improvements': improvements
        }

    def perform_reflection(self, action, reason, task, result):
        """
        Execute reflection based on trigger
        """
        print(f"[REFLECTION] {action}: {reason}")

        if action == "mandatory_reflection":
            # Perform root cause analysis
            self.root_cause_analysis(task, result)
        elif action == "extract_template":
            # Save as reusable template
            self.create_template(task, result)
        elif action == "update_architecture":
            # Review architectural assumptions
            self.update_assumptions(task, result)

    def weekly_learning_synthesis(self):
        """
        Aggregate learnings and update orchestrator rules
        """
        print("[SYNTHESIS] Running weekly learning synthesis...")

        # 1. Aggregate all reflection points
        weekly_learnings = self.aggregate_weekly_learnings()

        # 2. Identify top patterns
        top_patterns = self.identify_top_patterns(weekly_learnings)

        # 3. Update orchestrator rules
        self.update_rules(top_patterns)

        # 4. Archive obsolete patterns
        self.archive_obsolete_patterns()

        return {
            'patterns_identified': len(top_patterns),
            'rules_updated': True,
            'timestamp': datetime.now().isoformat()
        }
```

### Task 6: Create Monitoring Dashboard

Create `learning-loop/metrics/dashboard.py`:

```python
class LearningDashboard:
    """
    Track key metrics for the Reiki Goddess project
    """
    def __init__(self):
        self.metrics = {
            'component_reuse_rate': 0,     # How often Reiki UI components reused
            'api_integration_time': [],    # Time to integrate Square/booking APIs
            'agent_effectiveness': {},      # Which agents produce best outputs
            'pattern_stability': 0,        # How often best practices need updating
            'overall_improvement': 0       # Trend of execution scores over time
        }

    def update_metrics(self, execution_result):
        """Update metrics after each execution"""
        # Update relevant metrics based on execution
        pass

    def generate_report(self):
        """Generate weekly improvement report"""
        return {
            'metrics': self.metrics,
            'trends': self.calculate_trends(),
            'recommendations': self.generate_recommendations()
        }
```

## Deployment Steps

### Step 1: Initial Setup

```bash
# Navigate to project root
cd reiki-goddess-healing

# Create the enhanced orchestrator module
mkdir -p learning-loop/orchestrator

# Copy the Python files created above into learning-loop/orchestrator/
# Create __init__.py to make it a package
echo "from .learning_orchestrator import LearningOrchestrator" > learning-loop/orchestrator/__init__.py
```

### Step 2: Integration with Existing System

```python
# In your main execution file, replace existing orchestrator with:
from learning_loop.orchestrator import LearningOrchestrator

# Initialize enhanced orchestrator
orchestrator = LearningOrchestrator()

# Execute tasks with learning
for task in current_tasks:
    result = orchestrator.execute_with_learning(task)
    print(f"Task {task.id} completed with score: {result['score']}")
    print(f"Key learnings: {result['learnings']}")
    print(f"Suggested improvements: {result['improvements']}")
```

### Step 3: Configure Automated Triggers

```yaml
# Create learning-loop/config/triggers.yaml
reflection_triggers:
  checkpoints:
    - pre_task: true
    - mid_task: true
    - post_task: true
    - sprint_review: true

  thresholds:
    low_performance: 60
    high_performance: 90
    high_surprise: 70

  synthesis_schedule:
    weekly: "sunday_23:00"
    monthly: "last_friday"
```

### Step 4: Initialize Learning Memory

```python
# Run this once to initialize the learning system
from learning_loop.orchestrator import LearningOrchestrator

orchestrator = LearningOrchestrator()

# Seed with initial patterns from Phase 1
initial_patterns = {
    'reiki_patterns': [
        'Use soft color palette for healing context',
        'Booking flow must be maximum 3 steps',
        'Include practitioner bio prominently'
    ],
    'square_api': [
        'Always validate webhook signatures',
        'Cache payment methods for returning clients',
        'Handle timezone conversions for appointments'
    ]
}

orchestrator.memory.update(initial_patterns)
orchestrator.save_memory()
print("Learning system initialized with seed patterns")
```

## Validation Commands

```bash
# Verify learning system is operational
python -c "from learning_loop.orchestrator import LearningOrchestrator; o = LearningOrchestrator(); print('✓ Learning system ready')"

# Check memory structure created
find learning-loop/memory -type d | head -10

# Run test execution with learning
python -c "
from learning_loop.orchestrator import LearningOrchestrator
o = LearningOrchestrator()
test_task = {'id': 'test-001', 'type': 'component', 'component': 'booking-form'}
result = o.execute_with_learning(test_task)
print(f'Test execution score: {result['score']}')
"
```

## Success Criteria

- [ ] Orchestrator captures metadata for all executions
- [ ] Scoring system provides quantifiable feedback
- [ ] Pattern extraction identifies at least 3 recurring patterns
- [ ] Query interface returns relevant past learnings
- [ ] Weekly synthesis generates actionable improvements
- [ ] Component reuse rate increases by 20% within first month
- [ ] Average execution scores trend upward week-over-week

## Next Actions

1. Deploy the enhanced orchestrator
2. Run 5-10 test tasks to seed the learning system
3. Review first weekly synthesis report
4. Adjust thresholds based on initial results
5. Share learnings with team for validation

## Anti-Pattern Monitoring

The system will automatically flag:

- Same error occurring 3+ times → Forces architecture review
- Execution time increasing → Checks for memory/complexity bloat
- Low reuse rate → Identifies over-specialization
- High surprise factor repeatedly → Indicates incomplete domain understanding

## Support & Troubleshooting

If scoring consistently below 60:

- Review assumptions in `learning-loop/memory/working-memory/current-assumptions.md`
- Check agent performance metrics in dashboard
- Run root cause analysis: `orchestrator.root_cause_analysis(task_id)`

For questions about patterns:

- Query: `orchestrator.query_interface.query("show all failure patterns")`
- Review: `learning-loop/memory/long-term/architectural-decisions/`
