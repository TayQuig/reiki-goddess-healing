#!/usr/bin/env python3
"""
Claude Code UserPromptSubmit Hook
Validates user prompts and adds context
"""

import json
import sys
import re
import datetime

def main():
    try:
        # Read input from stdin
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
        sys.exit(1)
    
    prompt = input_data.get("prompt", "")
    
    # Check for sensitive patterns
    sensitive_patterns = [
        (r"(?i)\b(password|secret|api[_\s]?key|token)\s*[:=]", "Prompt contains potential secrets"),
        (r"(?i)\bprivate[_\s]?key\b", "Prompt references private keys"),
        (r"(?i)\b(ssh|gpg)[_\s]?key\b", "Prompt references security keys"),
    ]
    
    for pattern, message in sensitive_patterns:
        if re.search(pattern, prompt):
            # Block the prompt with security warning
            output = {
                "decision": "block",
                "reason": f"Security policy: {message}. Please rephrase without sensitive information."
            }
            print(json.dumps(output))
            sys.exit(0)
    
    # Add helpful context based on prompt content
    additional_context = []
    
    # Check if asking about testing
    if re.search(r"(?i)\b(test|testing|coverage)\b", prompt):
        additional_context.append("Current test coverage: ~80% components, 0% integration (see testing-strategy.md)")
    
    # Check if asking about documentation
    if re.search(r"(?i)\b(doc|documentation|readme)\b", prompt):
        additional_context.append("Key docs: CLAUDE.md (instructions), context_recovery.md (session state), todo_list.md (tasks)")
    
    # Check if asking about hooks
    if re.search(r"(?i)\bhooks?\b", prompt):
        additional_context.append("Hooks location: .claude/hooks/. Run '/hooks' to see current configuration.")
    
    # Add timestamp for context
    additional_context.append(f"Timestamp: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    if additional_context:
        # Add context using JSON output
        output = {
            "hookSpecificOutput": {
                "hookEventName": "UserPromptSubmit",
                "additionalContext": "\n".join(additional_context)
            }
        }
        print(json.dumps(output))
    
    sys.exit(0)

if __name__ == "__main__":
    main()