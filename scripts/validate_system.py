#!/usr/bin/env python3
"""
System Validation Script
Verifies all components of the autonomous development pipeline are working
"""
import os
import sys
import json
from pathlib import Path

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'learning-loop', 'orchestrator'))

def validate_structure():
    """Check if all required directories exist"""
    print("\n📁 Validating Directory Structure...")
    required_dirs = [
        'learning-loop/memory/short-term',
        'learning-loop/memory/long-term',
        'learning-loop/memory/working-memory',
        'learning-loop/orchestrator',
        'learning-loop/metrics',
        'learning-loop/config',
        'learning-loop/monitoring'
    ]
    
    all_exist = True
    for dir_path in required_dirs:
        if os.path.exists(dir_path):
            print(f"  ✅ {dir_path}")
        else:
            print(f"  ❌ {dir_path} - Missing")
            all_exist = False
    
    return all_exist

def validate_components():
    """Check if all Python components are importable"""
    print("\n🐍 Validating Python Components...")
    
    components = [
        ('Learning Orchestrator', 'learning_orchestrator', 'LearningOrchestrator'),
        ('Agent Registry', 'agent_registry', 'AgentRegistry'),
        ('Task Analyzer', 'task_analyzer', 'TaskAnalyzer'),
        ('Autonomous Executor', 'autonomous_executor', 'AutonomousExecutor'),
        ('Trigger System', 'trigger_system', 'TriggerSystem'),
        ('Autonomous Orchestrator', 'autonomous_orchestrator', 'AutonomousOrchestrator')
    ]
    
    all_imported = True
    for name, module, class_name in components:
        try:
            mod = __import__(module)
            cls = getattr(mod, class_name)
            print(f"  ✅ {name} ({class_name})")
        except Exception as e:
            print(f"  ❌ {name} - {str(e)}")
            all_imported = False
    
    return all_imported

def validate_agents():
    """Check agent registry configuration"""
    print("\n🤖 Validating Agent Configuration...")
    
    try:
        from agent_registry import AgentRegistry
        registry = AgentRegistry()
        
        expected_agents = [
            'learning-curator',
            'reiki-frontend-strategist',
            'business-domain-strategist',
            'infrastructure-strategist',
            'qa-strategist',
            'security-strategist',
            'business-api-strategist'
        ]
        
        all_present = True
        for agent in expected_agents:
            if agent in registry.agents:
                score = registry.agents[agent]['performance_score']
                print(f"  ✅ {agent} (score: {score})")
            else:
                print(f"  ❌ {agent} - Not configured")
                all_present = False
        
        return all_present
    except Exception as e:
        print(f"  ❌ Could not validate agents: {e}")
        return False

def validate_execution():
    """Test basic execution flow"""
    print("\n⚡ Testing Execution Flow...")
    
    try:
        from learning_orchestrator import LearningOrchestrator
        orchestrator = LearningOrchestrator()
        
        test_task = {
            'id': 'validation-test',
            'description': 'System validation task'
        }
        
        result = orchestrator.execute_with_learning(test_task)
        
        if result and 'score' in result:
            print(f"  ✅ Learning execution successful (score: {result['score']})")
            return True
        else:
            print(f"  ❌ Learning execution failed")
            return False
    except Exception as e:
        print(f"  ❌ Execution test failed: {e}")
        return False

def main():
    print("=" * 60)
    print("AUTONOMOUS DEVELOPMENT PIPELINE VALIDATION")
    print("=" * 60)
    
    results = {
        'structure': validate_structure(),
        'components': validate_components(),
        'agents': validate_agents(),
        'execution': validate_execution()
    }
    
    print("\n" + "=" * 60)
    print("VALIDATION SUMMARY")
    print("=" * 60)
    
    all_passed = all(results.values())
    
    for test, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"  {test.capitalize()}: {status}")
    
    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 ALL VALIDATIONS PASSED!")
        print("Your autonomous development pipeline is ready!")
        print("\nNext steps:")
        print("  1. Run 'python3 main.py' to start autonomous operation")
        print("  2. Run 'python3 monitor.py' to start the web monitor")
        print("  3. Add tasks via the API or let triggers create them")
    else:
        print("⚠️  SOME VALIDATIONS FAILED")
        print("Please check the errors above and fix them.")
    print("=" * 60)
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())