#!/usr/bin/env python3
import asyncio
import sys
import os

# Add orchestrator to path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'learning-loop', 'orchestrator'))

from autonomous_orchestrator import AutonomousOrchestrator

async def main():
    orchestrator = AutonomousOrchestrator()
    
    try:
        print("[MAIN] Initializing autonomous system...")
        print("[MAIN] Performing initial codebase scan...")
        
        # Initial scan for existing work
        orchestrator.executor.duplication_checker.scan_existing_work()
        
        print("[MAIN] Adding initial tasks to queue...")
        
        # Add initial tasks based on existing Phase 1 research
        # These reference the actual work already done in learning-loop/tasks/
        initial_tasks = [
            {
                'id': 'impl_infrastructure_001',
                'description': 'Deploy Vercel hosting from infrastructure strategy (011)',
                'priority': 90
            },
            {
                'id': 'impl_testing_002', 
                'description': 'Implement testing strategy from plan (014)',
                'priority': 85
            },
            {
                'id': 'impl_patterns_003',
                'description': 'Apply extracted patterns from completed tasks (001, 002)',
                'priority': 80
            }
        ]
        
        for task in initial_tasks:
            await orchestrator.executor.add_task(task)
        
        print("[MAIN] Starting autonomous operation...")
        print("[MAIN] Press Ctrl+C to stop\n")
        
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