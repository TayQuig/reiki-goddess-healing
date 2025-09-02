#!/usr/bin/env python3
"""
TodoWrite hook that checks if documentation needs updating based on completed todos
"""
import json
import sys
from pathlib import Path
from datetime import datetime

def main():
    # Load input from stdin
    try:
        input_data = json.load(sys.stdin)
    except:
        sys.exit(0)
    
    # Get the todo data from tool_input
    tool_input = input_data.get("tool_input", {})
    todos = tool_input.get("todos", [])
    
    # Check for completed todos
    completed_todos = [todo for todo in todos if todo.get("status") == "completed"]
    in_progress_todos = [todo for todo in todos if todo.get("status") == "in_progress"]
    
    # If todos were completed, prompt for documentation update
    if len(completed_todos) > 0:
        completed_names = [todo.get("content", "Unknown task") for todo in completed_todos]
        
        message = f"""Todo items completed! Please update documentation:

Completed tasks:
{chr(10).join(f'- {task}' for task in completed_names)}

Please update:
1. todo_list.md - Add these completions to session accomplishments
2. testing-strategy.md - Update if any testing tasks were completed
3. context_recovery.md - Note if this represents a major milestone

The documentation should reflect the current date: {datetime.now().strftime('%Y-%m-%d')}"""
        
        # Use exit code 2 to send to Claude
        print(message, file=sys.stderr)
        sys.exit(2)
    
    # Otherwise just show a quick reminder
    print("✅ Todo updated. Remember to update docs if needed.", file=sys.stderr)
    sys.exit(0)

if __name__ == "__main__":
    main()