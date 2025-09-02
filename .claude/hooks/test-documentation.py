#!/usr/bin/env python3
"""
Test Documentation Hook

This hook is triggered after running tests to document failures.
Instead of fixing tests, it documents all failures in component-specific
markdown files for later review and bug fixing.
"""

import json
import sys
import os
import re
from datetime import datetime
from pathlib import Path

def parse_test_output(output):
    """Parse test output to extract failure information."""
    failures = []
    
    # Pattern to match test failures in vitest output
    failure_pattern = r'✖\s+(.+?)\s*\n\s*→\s*(.+?):(\d+):(\d+)'
    assertion_pattern = r'AssertionError: (.+?)(?:\n|$)'
    expect_pattern = r'Expected: (.+?)\nReceived: (.+?)(?:\n|$)'
    
    # Find all test failures
    for match in re.finditer(failure_pattern, output, re.MULTILINE):
        test_name = match.group(1).strip()
        file_path = match.group(2)
        line = match.group(3)
        
        # Extract component name from file path
        component_match = re.search(r'packages/shared-components/src/(.+?)/(.+?)\.test\.tsx?', file_path)
        if component_match:
            component_name = component_match.group(1)
        else:
            component_name = "Unknown"
        
        # Look for assertion details
        assertion_msg = ""
        assertion_match = re.search(assertion_pattern, output[match.end():match.end()+500])
        if assertion_match:
            assertion_msg = assertion_match.group(1)
        
        # Look for expected/received values
        expect_match = re.search(expect_pattern, output[match.end():match.end()+500])
        expected = ""
        received = ""
        if expect_match:
            expected = expect_match.group(1)
            received = expect_match.group(2)
        
        failures.append({
            'component': component_name,
            'test_name': test_name,
            'file': file_path,
            'line': line,
            'assertion': assertion_msg,
            'expected': expected,
            'received': received,
            'timestamp': datetime.now().isoformat()
        })
    
    return failures

def get_component_doc_path(component_name):
    """Get the path for a component's test documentation."""
    project_dir = os.getenv('CLAUDE_PROJECT_DIR', os.getcwd())
    return Path(project_dir) / 'testing' / 'components' / f'{component_name}.md'

def update_component_doc(component_name, failures):
    """Update or create component-specific test documentation."""
    doc_path = get_component_doc_path(component_name)
    doc_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Read existing content if file exists
    existing_content = ""
    if doc_path.exists():
        with open(doc_path, 'r') as f:
            existing_content = f.read()
    
    # Create new entry
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    new_entry = f"\n## Test Run: {timestamp}\n\n"
    
    for failure in failures:
        new_entry += f"### ❌ {failure['test_name']}\n\n"
        new_entry += f"**File**: `{failure['file']}:{failure['line']}`\n\n"
        
        if failure['assertion']:
            new_entry += f"**Assertion Error**: {failure['assertion']}\n\n"
        
        if failure['expected'] and failure['received']:
            new_entry += f"**Expected**:\n```\n{failure['expected']}\n```\n\n"
            new_entry += f"**Received**:\n```\n{failure['received']}\n```\n\n"
        
        new_entry += f"**Status**: 🐛 Bug - Needs Investigation\n\n"
        new_entry += "**Notes**: _Add investigation notes here_\n\n"
        new_entry += "---\n\n"
    
    # If file doesn't exist, create header
    if not existing_content:
        content = f"# {component_name} Component - Test Documentation\n\n"
        content += f"This file documents test failures for the {component_name} component.\n"
        content += "Each failure is preserved for investigation and bug fixing.\n\n"
        content += "**DO NOT REWRITE TESTS TO PASS** - Document bugs instead!\n"
        content += new_entry
    else:
        content = existing_content + new_entry
    
    # Write updated content
    with open(doc_path, 'w') as f:
        f.write(content)
    
    return doc_path

def create_testing_summary():
    """Create or update the testing summary file."""
    project_dir = os.getenv('CLAUDE_PROJECT_DIR', os.getcwd())
    summary_path = Path(project_dir) / 'testing' / 'TESTING_SUMMARY.md'
    components_dir = Path(project_dir) / 'testing' / 'components'
    
    # Collect all component test docs
    component_stats = {}
    total_bugs = 0
    
    if components_dir.exists():
        for doc_file in components_dir.glob('*.md'):
            component_name = doc_file.stem
            with open(doc_file, 'r') as f:
                content = f.read()
                # Count bug occurrences
                bug_count = content.count('🐛 Bug')
                component_stats[component_name] = bug_count
                total_bugs += bug_count
    
    # Create summary content
    content = "# Testing Summary\n\n"
    content += f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
    content += f"**Total Documented Bugs**: {total_bugs}\n\n"
    
    content += "## Component Bug Count\n\n"
    content += "| Component | Bug Count | Status |\n"
    content += "|-----------|-----------|--------|\n"
    
    for component, count in sorted(component_stats.items()):
        status = "🟢 Clean" if count == 0 else "🔴 Has Bugs"
        content += f"| {component} | {count} | {status} |\n"
    
    content += "\n## Next Steps\n\n"
    content += "1. Review each component's test documentation\n"
    content += "2. Investigate root causes of failures\n"
    content += "3. Create bug fix plan\n"
    content += "4. Fix bugs in order of priority\n"
    content += "5. Re-run tests to verify fixes\n\n"
    
    content += "## Important Reminders\n\n"
    content += "- **DO NOT** rewrite tests to make them pass\n"
    content += "- **DO** document why tests are failing\n"
    content += "- **DO** investigate the actual bugs in the code\n"
    content += "- **DO** fix the bugs, not the tests\n"
    
    # Write summary
    with open(summary_path, 'w') as f:
        f.write(content)
    
    return summary_path

def main():
    # Read input from stdin
    try:
        input_data = json.load(sys.stdin)
    except:
        # If not JSON, might be raw test output
        input_data = {'output': sys.stdin.read()}
    
    # Extract test output
    test_output = input_data.get('output', '')
    
    # Parse failures
    failures = parse_test_output(test_output)
    
    if not failures:
        # No failures, nothing to document
        sys.exit(0)
    
    # Group failures by component
    component_failures = {}
    for failure in failures:
        component = failure['component']
        if component not in component_failures:
            component_failures[component] = []
        component_failures[component].append(failure)
    
    # Update documentation for each component
    updated_docs = []
    for component, failures in component_failures.items():
        doc_path = update_component_doc(component, failures)
        updated_docs.append(str(doc_path))
    
    # Create/update testing summary
    summary_path = create_testing_summary()
    
    # Output message for Claude
    output = {
        "type": "user_prompt_submit",
        "message": f"📋 Test failures have been documented!\n\n" +
                   f"Updated component docs:\n" + 
                   "\n".join(f"- {doc}" for doc in updated_docs) +
                   f"\n\nTesting summary updated: {summary_path}\n\n" +
                   f"Please review the testing documentation to understand the bugs before proceeding."
    }
    
    print(json.dumps(output))

if __name__ == "__main__":
    main()