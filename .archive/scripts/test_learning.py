#!/usr/bin/env python3
import sys
import os

# Add the orchestrator directory to path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'learning-loop', 'orchestrator'))

from learning_orchestrator import LearningOrchestrator

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