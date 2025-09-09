#!/usr/bin/env python3
"""
Run the autonomous orchestrator with the critical Anima design extraction priorities.
This script ensures the orchestrator executes the priority override directive.
"""
import asyncio
import sys
import os
from datetime import datetime

# Add orchestrator to path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'learning-loop', 'orchestrator'))

from autonomous_orchestrator import AutonomousOrchestrator

async def main():
    orchestrator = AutonomousOrchestrator()
    
    try:
        print("[EXTRACTION] Initializing autonomous system for Anima design extraction...")
        print("[EXTRACTION] Loading priority override directive...")
        print("-" * 60)
        print("CRITICAL: Anima folders are the ONLY approved designs")
        print("Priority: Extract components from Anima folders to monorepo")
        print("-" * 60)
        
        # Scan existing work first
        orchestrator.executor.duplication_checker.scan_existing_work()
        
        print("\n[EXTRACTION] Adding critical extraction tasks to queue...")
        
        # Critical tasks based on priority override and orchestrator update
        extraction_tasks = [
            {
                'id': f'anima_extract_001_{datetime.now().timestamp()}',
                'description': 'CRITICAL: Identify true header component from Anima pages (About/Home) - Contact HeaderSection is misnamed',
                'priority': 100,
                'agent': 'reiki-frontend-strategist'
            },
            {
                'id': f'anima_extract_002_{datetime.now().timestamp()}',
                'description': 'Extract universal Header/Footer from Contact sections for all pages',
                'priority': 95,
                'agent': 'reiki-frontend-strategist'
            },
            {
                'id': f'anima_extract_003_{datetime.now().timestamp()}',
                'description': 'Migrate all Anima assets to packages/shared-assets preserving structure',
                'priority': 90,
                'agent': 'infrastructure-strategist'
            },
            {
                'id': f'anima_extract_004_{datetime.now().timestamp()}',
                'description': 'Extract Contact page modular sections (excluding misnamed HeaderSection)',
                'priority': 85,
                'agent': 'reiki-frontend-strategist'
            },
            {
                'id': f'anima_extract_005_{datetime.now().timestamp()}',
                'description': 'Break down About page monolithic component into modular sections following Contact pattern',
                'priority': 80,
                'agent': 'reiki-frontend-strategist'
            },
            {
                'id': f'anima_extract_006_{datetime.now().timestamp()}',
                'description': 'Extract Home page components wrapped in shared Header/Footer',
                'priority': 75,
                'agent': 'reiki-frontend-strategist'
            },
            {
                'id': f'anima_extract_007_{datetime.now().timestamp()}',
                'description': 'Clarify Blog requirements and extract if different from About',
                'priority': 70,
                'agent': 'business-domain-strategist'
            },
            {
                'id': f'anima_extract_008_{datetime.now().timestamp()}',
                'description': 'Document header component discovery and mapping for future reference',
                'priority': 65,
                'agent': 'learning-curator'
            },
            {
                'id': f'anima_extract_009_{datetime.now().timestamp()}',
                'description': 'Validate all extracted components match Anima designs 100%',
                'priority': 60,
                'agent': 'qa-strategist'
            }
        ]
        
        for task in extraction_tasks:
            await orchestrator.executor.add_task(task)
            print(f"  ✓ Added: {task['description'][:60]}...")
        
        print(f"\n[EXTRACTION] {len(extraction_tasks)} critical tasks added to queue")
        print("\n[EXTRACTION] Key Requirements:")
        print("  • 85% of infrastructure stays (build tools, testing, utilities)")
        print("  • Only replace visual components (15%)")
        print("  • Contact HeaderSection is misnamed (it's a form field)")
        print("  • Find true header in About or Home pages")
        print("  • All pages use shared Header/Footer wrapper")
        print("  • Follow Contact's modular pattern (ADR-001)")
        
        print("\n[EXTRACTION] Starting autonomous execution...")
        print("[EXTRACTION] Press Ctrl+C to stop\n")
        
        # Start autonomous operation
        await orchestrator.start()
        
    except KeyboardInterrupt:
        print("\n[SHUTDOWN] Stopping orchestrator...")
        orchestrator.stop()
        print("[SHUTDOWN] Extraction tasks queued for next run")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n[EXIT] Orchestrator stopped. Tasks saved for next execution.")
        sys.exit(0)