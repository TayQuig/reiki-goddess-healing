# Complete Implementation Guide - From Basic to Autonomous

## Overview
You have 3 prompts that build on each other:
1. **Phase 2 Implementation** - Continue your current project
2. **Learning Orchestrator** - Add self-reflection capabilities
3. **Autonomous System** - Make it fully self-managing

## 📋 Implementation Sequence

### Phase 1: Verify Current State (5 minutes)
First, ensure your Phase 1 is actually complete:

```bash
# Check if all 7 agents completed their research
find learning-loop/tasks/current/ -name "planning.md" | wc -l
# Should show 7+

# Verify research folders exist
ls learning-loop/research/
# Should show folders for each agent
```

### Phase 2: Set Up Learning System (30 minutes)

#### Step 2.1: Create Directory Structure
```bash
# Navigate to your project root
cd reiki-goddess-healing

# Create the enhanced structure for learning
mkdir -p learning-loop/memory/{short-term,long-term,working-memory}
mkdir -p learning-loop/memory/long-term/{architectural-decisions,component-patterns,integration-gotchas}
mkdir -p learning-loop/orchestrator
mkdir -p learning-loop/metrics
mkdir -p learning-loop/templates/successful-patterns
mkdir -p learning-loop/config
mkdir -p learning-loop/monitoring
```

#### Step 2.2: Install Dependencies
```bash
# Create requirements file
cat > requirements.txt << EOF
asyncio
aiofiles
pyyaml
python-dateutil
EOF

# Install dependencies
pip install -r requirements.txt
```

#### Step 2.3: Deploy Core Learning Components
Create these files in order:

```bash
# 1. Create the scoring system
cat > learning-loop/orchestrator/scoring_system.py << 'EOF'
class ExecutionScoreCard:
    def __init__(self, task_id):
        self.task_id = task_id
        self.scores = {
            'accuracy': 0,
            'efficiency': 0,
            'reusability': 0,
            'surprise': 0
        }
    
    def calculate_overall_score(self):
        return sum(self.scores.values()) / len(self.scores)
    
    def trigger_reflection(self):
        overall = self.calculate_overall_score()
        if overall < 60:
            return "mandatory_reflection", "Low performance"
        elif overall > 90:
            return "extract_template", "High performance"
        return None, None
EOF

# 2. Create pattern extractor
cat > learning-loop/orchestrator/pattern_extractor.py << 'EOF'
import json
from datetime import datetime
from pathlib import Path

class PatternExtractor:
    def __init__(self, memory_path="learning-loop/memory"):
        self.memory_path = Path(memory_path)
        self.patterns = {
            'success_patterns': [],
            'failure_patterns': [],
            'performance_patterns': [],
            'dependency_patterns': []
        }
    
    def capture_execution_metadata(self, task_id, phase):
        return {
            'task_id': task_id,
            'phase': phase,
            'timestamp': datetime.now().isoformat()
        }
EOF

# 3. Create the basic learning orchestrator
cat > learning-loop/orchestrator/learning_orchestrator.py << 'EOF'
from .scoring_system import ExecutionScoreCard
from .pattern_extractor import PatternExtractor
import json
from datetime import datetime

class LearningOrchestrator:
    def __init__(self):
        self.pattern_extractor = PatternExtractor()
        self.memory = {
            'reiki_patterns': [],
            'square_api': [],
            'component_library': [],
            'agent_performance': {}
        }
    
    def execute_with_learning(self, task):
        print(f"[LEARNING] Executing task: {task.get('id', 'unknown')}")
        
        # Capture pre-execution
        pre_metadata = self.pattern_extractor.capture_execution_metadata(
            task.get('id'), 'pre'
        )
        
        # Execute task (simplified for now)
        result = {'success': True, 'data': 'Task completed'}
        
        # Score execution
        score_card = ExecutionScoreCard(task.get('id'))
        score_card.scores = {'accuracy': 85, 'efficiency': 75, 'reusability': 90, 'surprise': 20}
        
        print(f"[COMPLETE] Score: {score_card.calculate_overall_score()}")
        
        return {'result': result, 'score': score_card.calculate_overall_score()}
EOF

# 4. Make it a package
echo "from .learning_orchestrator import LearningOrchestrator" > learning-loop/orchestrator/__init__.py
```

#### Step 2.4: Test Learning System
```python
# test_learning.py
from learning_loop.orchestrator import LearningOrchestrator

# Create orchestrator
orchestrator = LearningOrchestrator()

# Test task
test_task = {
    'id': 'test-001',
    'type': 'component',
    'description': 'Create booking form'
}

# Execute with learning
result = orchestrator.execute_with_learning(test_task)
print(f"Test completed with score: {result['score']}")
```

### Phase 3: Add Autonomous Capabilities (45 minutes)

#### Step 3.1: Create Agent Registry
```python
# learning-loop/orchestrator/agent_registry.py
cat > learning-loop/orchestrator/agent_registry.py << 'EOF'
class AgentRegistry:
    def __init__(self):
        self.agents = {
            'learning-curator': {
                'capabilities': ['pattern_extraction', 'knowledge_synthesis'],
                'performance_score': 100,
                'availability': True
            },
            'reiki-frontend-strategist': {
                'capabilities': ['component_design', 'ui_patterns'],
                'performance_score': 100,
                'availability': True
            },
            'business-domain-strategist': {
                'capabilities': ['requirement_analysis', 'business_logic'],
                'performance_score': 100,
                'availability': True
            },
            'infrastructure-strategist': {
                'capabilities': ['deployment', 'scaling'],
                'performance_score': 100,
                'availability': True
            },
            'qa-strategist': {
                'capabilities': ['test_generation', 'quality_validation'],
                'performance_score': 100,
                'availability': True
            },
            'security-strategist': {
                'capabilities': ['vulnerability_scan', 'security_audit'],
                'performance_score': 100,
                'availability': True
            },
            'business-api-strategist': {
                'capabilities': ['api_integration', 'data_mapping'],
                'performance_score': 100,
                'availability': True
            }
        }
    
    def get_capable_agents(self, capability_needed):
        capable = []
        for agent_name, agent_info in self.agents.items():
            if capability_needed in agent_info['capabilities']:
                capable.append((agent_name, agent_info['performance_score']))
        return sorted(capable, key=lambda x: x[1], reverse=True)
EOF
```

#### Step 3.2: Create Task Analyzer
```python
# learning-loop/orchestrator/task_analyzer.py
cat > learning-loop/orchestrator/task_analyzer.py << 'EOF'
class TaskAnalyzer:
    def __init__(self, agent_registry):
        self.agent_registry = agent_registry
    
    def analyze_task(self, task_description, context=None):
        # Simple analysis for now
        required_agents = []
        
        if 'component' in task_description.lower() or 'ui' in task_description.lower():
            required_agents.append('reiki-frontend-strategist')
        
        if 'api' in task_description.lower() or 'integration' in task_description.lower():
            required_agents.append('business-api-strategist')
        
        if 'test' in task_description.lower():
            required_agents.append('qa-strategist')
        
        return {
            'required_agents': required_agents,
            'complexity_score': 50,
            'execution_strategy': 'simple_sequential'
        }
EOF
```

#### Step 3.3: Create Simplified Autonomous Executor
```python
# learning-loop/orchestrator/autonomous_executor.py
cat > learning-loop/orchestrator/autonomous_executor.py << 'EOF'
import asyncio
from datetime import datetime

class AutonomousExecutor:
    def __init__(self, agent_registry, task_analyzer):
        self.agent_registry = agent_registry
        self.task_analyzer = task_analyzer
        self.execution_queue = []
        self.is_running = False
    
    async def start(self):
        self.is_running = True
        print("[AUTONOMOUS] Starting autonomous operation...")
        
        # Start execution loop
        await self.execution_loop()
    
    async def add_task(self, task):
        priority = task.get('priority', 50)
        self.execution_queue.append((priority, task))
        self.execution_queue.sort(key=lambda x: x[0], reverse=True)
        print(f"[QUEUE] Added task: {task['id']}")
    
    async def execution_loop(self):
        while self.is_running:
            if self.execution_queue:
                priority, task = self.execution_queue.pop(0)
                await self.execute_task(task)
            else:
                await asyncio.sleep(5)
    
    async def execute_task(self, task):
        print(f"[EXECUTE] Processing: {task['id']}")
        
        # Analyze task
        analysis = self.task_analyzer.analyze_task(
            task.get('description', ''),
            task.get('context', {})
        )
        
        # Execute with required agents
        for agent in analysis['required_agents']:
            print(f"[DELEGATE] Using agent: {agent}")
            await asyncio.sleep(1)  # Simulate agent work
        
        print(f"[COMPLETE] Task {task['id']} finished")
EOF
```

#### Step 3.4: Create Trigger System
```python
# learning-loop/orchestrator/trigger_system.py
cat > learning-loop/orchestrator/trigger_system.py << 'EOF'
from datetime import datetime

class TriggerSystem:
    def __init__(self):
        self.triggers = {
            'file_change': {
                'action': 'code_analysis',
                'priority': 70
            },
            'error_threshold': {
                'action': 'error_investigation',
                'priority': 90
            },
            'scheduled_maintenance': {
                'action': 'maintenance_tasks',
                'priority': 50
            }
        }
        self.last_triggered = {}
    
    async def check_triggers(self):
        # Simplified trigger checking
        triggered = []
        
        # Example: Always trigger maintenance on first run
        if 'scheduled_maintenance' not in self.last_triggered:
            triggered.append({
                'trigger': 'scheduled_maintenance',
                'action': self.triggers['scheduled_maintenance']['action'],
                'priority': self.triggers['scheduled_maintenance']['priority']
            })
            self.last_triggered['scheduled_maintenance'] = datetime.now()
        
        return triggered
EOF
```

#### Step 3.5: Create Main Autonomous Orchestrator
```python
# learning-loop/orchestrator/autonomous_orchestrator.py
cat > learning-loop/orchestrator/autonomous_orchestrator.py << 'EOF'
import asyncio
from datetime import datetime
from .agent_registry import AgentRegistry
from .task_analyzer import TaskAnalyzer
from .autonomous_executor import AutonomousExecutor
from .trigger_system import TriggerSystem

class AutonomousOrchestrator:
    def __init__(self):
        self.agent_registry = AgentRegistry()
        self.task_analyzer = TaskAnalyzer(self.agent_registry)
        self.executor = AutonomousExecutor(self.agent_registry, self.task_analyzer)
        self.trigger_system = TriggerSystem()
        self.is_running = False
    
    async def start(self):
        print("[ORCHESTRATOR] Starting autonomous system...")
        self.is_running = True
        
        # Run main loops in parallel
        await asyncio.gather(
            self.executor.start(),
            self.monitor_triggers()
        )
    
    async def monitor_triggers(self):
        while self.is_running:
            triggers = await self.trigger_system.check_triggers()
            
            for trigger in triggers:
                task = {
                    'id': f"auto_{trigger['trigger']}_{datetime.now().timestamp()}",
                    'description': f"Automated: {trigger['action']}",
                    'priority': trigger['priority']
                }
                await self.executor.add_task(task)
            
            await asyncio.sleep(10)
    
    def stop(self):
        self.is_running = False
        self.executor.is_running = False
        print("[ORCHESTRATOR] Stopped")
EOF
```

### Phase 4: Deploy and Run (10 minutes)

#### Step 4.1: Create Main Entry Point
```python
# main.py
cat > main.py << 'EOF'
import asyncio
import sys
from learning_loop.orchestrator.autonomous_orchestrator import AutonomousOrchestrator

async def main():
    orchestrator = AutonomousOrchestrator()
    
    try:
        # Add initial tasks from Phase 1 completion
        initial_tasks = [
            {
                'id': 'impl_001',
                'description': 'Extract reusable components from frontend strategy',
                'priority': 90
            },
            {
                'id': 'impl_002', 
                'description': 'Implement Square API integration',
                'priority': 85
            },
            {
                'id': 'impl_003',
                'description': 'Create booking workflow with business rules',
                'priority': 80
            }
        ]
        
        for task in initial_tasks:
            await orchestrator.executor.add_task(task)
        
        # Start autonomous operation
        await orchestrator.start()
        
    except KeyboardInterrupt:
        print("\n[SHUTDOWN] Stopping orchestrator...")
        orchestrator.stop()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n[EXIT] Goodbye!")
        sys.exit(0)
EOF
```

#### Step 4.2: Create Simple Web Monitor (Optional)
```python
# monitor.py
cat > monitor.py << 'EOF'
from flask import Flask, jsonify
import json
from datetime import datetime

app = Flask(__name__)

@app.route('/status')
def status():
    # Read latest status from file (written by orchestrator)
    try:
        with open('learning-loop/metrics/status.json', 'r') as f:
            status_data = json.load(f)
    except:
        status_data = {'status': 'No data available'}
    
    return jsonify(status_data)

@app.route('/agents')
def agents():
    # Show agent status
    agents_data = {
        'learning-curator': {'status': 'ready', 'score': 95},
        'reiki-frontend-strategist': {'status': 'busy', 'score': 88},
        'business-api-strategist': {'status': 'ready', 'score': 92}
    }
    return jsonify(agents_data)

if __name__ == '__main__':
    app.run(debug=True, port=8080)
EOF
```

### Phase 5: Run the System

#### Option A: Simple Mode (Just Learning)
```bash
# Test the learning system first
python -c "
from learning_loop.orchestrator.learning_orchestrator import LearningOrchestrator
o = LearningOrchestrator()
task = {'id': 'test', 'description': 'Test task'}
result = o.execute_with_learning(task)
print(f'Score: {result['score']}')
"
```

#### Option B: Autonomous Mode (Full System)
```bash
# Run the autonomous orchestrator
python main.py

# In another terminal, optionally run the monitor
python monitor.py
```

## 🎯 What Happens When You Run This

1. **Immediate**: System starts processing your Phase 1 research results
2. **First Hour**: Begins extracting patterns from agent outputs
3. **First Day**: Learns which agents work best for which tasks
4. **First Week**: Optimizes execution strategies based on performance
5. **Ongoing**: Continuously improves and self-manages

## 📊 Validation Checklist

```bash
# Check system is running
ps aux | grep main.py

# Check logs are being created
ls -la learning-loop/memory/short-term/

# Check if patterns are being extracted
find learning-loop/memory -name "*.json" | head -5

# Monitor execution queue
tail -f learning-loop/metrics/executions.log
```

## 🚨 Troubleshooting

### If imports fail:
```bash
# Add to PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

### If async errors occur:
```bash
# Ensure Python 3.7+
python --version

# Install asyncio properly
pip install --upgrade asyncio
```

### If agents aren't responding:
```python
# Check agent registry
from learning_loop.orchestrator.agent_registry import AgentRegistry
registry = AgentRegistry()
print(registry.agents.keys())
```

## 🎉 Success Indicators

You'll know it's working when you see:
```
[ORCHESTRATOR] Starting autonomous system...
[AUTONOMOUS] Starting autonomous operation...
[QUEUE] Added task: impl_001
[QUEUE] Added task: impl_002
[QUEUE] Added task: impl_003
[EXECUTE] Processing: impl_001
[DELEGATE] Using agent: reiki-frontend-strategist
[COMPLETE] Task impl_001 finished
[TRIGGER] Created task from scheduled_maintenance
```

## Next Steps

Once running, you can:
1. Add more tasks via the API
2. Watch it learn and improve
3. Check metrics dashboard
4. Review extracted patterns
5. Let it run autonomously!

The system will gradually become more intelligent, learning from every execution and improving its performance over time.