#!/usr/bin/env python3
"""
System Status Checker
Quick script to verify if the autonomous system is running
"""
import subprocess
import os
from datetime import datetime
from pathlib import Path

def check_process():
    """Check if main.py is running"""
    try:
        result = subprocess.run(['pgrep', '-f', 'python3.*main.py'], 
                              capture_output=True, text=True)
        if result.stdout.strip():
            pids = result.stdout.strip().split('\n')
            return True, pids
        return False, []
    except:
        return False, []

def check_recent_activity():
    """Check for recent file modifications in learning-loop"""
    recent_files = []
    learning_loop = Path('learning-loop')
    
    if learning_loop.exists():
        # Check for files modified in last hour
        import time
        current_time = time.time()
        
        for file_path in learning_loop.rglob('*'):
            if file_path.is_file():
                try:
                    mtime = file_path.stat().st_mtime
                    if current_time - mtime < 3600:  # Within last hour
                        recent_files.append({
                            'path': str(file_path.relative_to(learning_loop)),
                            'minutes_ago': int((current_time - mtime) / 60)
                        })
                except:
                    pass
    
    return sorted(recent_files, key=lambda x: x['minutes_ago'])[:5]

def check_task_files():
    """Count task files"""
    tasks_dir = Path('learning-loop/tasks')
    if not tasks_dir.exists():
        return 0, 0
    
    current_tasks = len(list((tasks_dir / 'current').rglob('*.md'))) if (tasks_dir / 'current').exists() else 0
    completed_tasks = len(list((tasks_dir / 'completed').rglob('*.md'))) if (tasks_dir / 'completed').exists() else 0
    
    return current_tasks, completed_tasks

def main():
    print("=" * 60)
    print("AUTONOMOUS SYSTEM STATUS CHECK")
    print("=" * 60)
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Check process
    is_running, pids = check_process()
    if is_running:
        print("✅ SYSTEM IS RUNNING")
        print(f"   Process IDs: {', '.join(pids)}")
    else:
        print("❌ SYSTEM IS NOT RUNNING")
        print("   Run 'python3 main.py' to start")
    print()
    
    # Check tasks
    current, completed = check_task_files()
    print("📊 TASK STATUS:")
    print(f"   Current tasks: {current}")
    print(f"   Completed tasks: {completed}")
    print()
    
    # Check recent activity
    recent = check_recent_activity()
    if recent:
        print("🕒 RECENT ACTIVITY (last hour):")
        for file_info in recent:
            print(f"   {file_info['minutes_ago']:3d} min ago: {file_info['path']}")
    else:
        print("🕒 No recent file activity in learning-loop")
    print()
    
    # Quick actions
    print("🎯 QUICK ACTIONS:")
    if is_running:
        print("   • View live output: tail -f learning-loop/metrics/executions.log")
        print("   • Stop system: pkill -f 'python3.*main.py'")
        print("   • Monitor web UI: python3 monitor.py")
    else:
        print("   • Start system: python3 main.py")
        print("   • Test system: python3 test_autonomous.py")
        print("   • Validate setup: python3 validate_system.py")
    
    print("=" * 60)

if __name__ == "__main__":
    main()