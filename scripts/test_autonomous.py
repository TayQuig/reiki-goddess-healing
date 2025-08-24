#!/usr/bin/env python3
import asyncio
import sys
import os

# Add orchestrator to path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'learning-loop', 'orchestrator'))

from autonomous_orchestrator import AutonomousOrchestrator

async def test_autonomous():
    print("=" * 60)
    print("AUTONOMOUS SYSTEM TEST")
    print("=" * 60)
    
    orchestrator = AutonomousOrchestrator()
    
    # Add test tasks
    test_tasks = [
        {
            'id': 'test_001',
            'description': 'Create UI component for booking form',
            'priority': 90
        },
        {
            'id': 'test_002', 
            'description': 'Setup API integration with Square',
            'priority': 85
        },
        {
            'id': 'test_003',
            'description': 'Generate tests for booking workflow',
            'priority': 80
        }
    ]
    
    print("\n[TEST] Adding tasks to queue...")
    for task in test_tasks:
        await orchestrator.executor.add_task(task)
    
    print("\n[TEST] Starting execution for 15 seconds...")
    
    # Run for a short time
    orchestrator.is_running = True
    orchestrator.executor.is_running = True  # Set executor running flag
    
    # Start execution and monitoring tasks
    exec_task = asyncio.create_task(orchestrator.executor.execution_loop())
    trigger_task = asyncio.create_task(orchestrator.monitor_triggers())
    
    # Wait for 15 seconds
    await asyncio.sleep(15)
    
    # Stop the system
    print("\n[TEST] Stopping system...")
    orchestrator.stop()
    
    # Cancel tasks
    exec_task.cancel()
    trigger_task.cancel()
    
    try:
        await exec_task
        await trigger_task
    except asyncio.CancelledError:
        pass
    
    print("\n[TEST] Test complete!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test_autonomous())