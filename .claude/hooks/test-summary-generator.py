#!/usr/bin/env python3
"""
Test Summary Generator Hook

This hook generates a comprehensive testing summary report
for context refresh and bug fixing sessions.
"""

import json
import sys
import os
from datetime import datetime
from pathlib import Path

def generate_summary_report():
    """Generate a comprehensive testing summary report."""
    project_dir = os.getenv('CLAUDE_PROJECT_DIR', os.getcwd())
    testing_dir = Path(project_dir) / 'testing'
    components_dir = testing_dir / 'components'
    
    report = {
        'timestamp': datetime.now().isoformat(),
        'components': {},
        'total_bugs': 0,
        'priority_bugs': [],
        'recent_failures': []
    }
    
    # Analyze each component documentation
    if components_dir.exists():
        for doc_file in components_dir.glob('*.md'):
            component_name = doc_file.stem
            component_data = analyze_component_doc(doc_file)
            report['components'][component_name] = component_data
            report['total_bugs'] += component_data['bug_count']
            
            # Track recent failures (last 24 hours)
            for bug in component_data['bugs']:
                if bug.get('is_recent'):
                    report['recent_failures'].append({
                        'component': component_name,
                        'test': bug['test_name'],
                        'timestamp': bug['timestamp']
                    })
    
    # Identify priority bugs (appearing in multiple test runs)
    identify_priority_bugs(report)
    
    # Generate markdown report
    generate_markdown_report(report, testing_dir / 'CONTEXT_REFRESH_SUMMARY.md')
    
    return report

def analyze_component_doc(doc_path):
    """Analyze a component test documentation file."""
    with open(doc_path, 'r') as f:
        content = f.read()
    
    data = {
        'bug_count': 0,
        'bugs': [],
        'test_runs': 0,
        'last_updated': None
    }
    
    # Parse test runs and bugs
    import re
    
    # Find all test runs
    test_run_pattern = r'## Test Run: (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})'
    test_runs = re.findall(test_run_pattern, content)
    data['test_runs'] = len(test_runs)
    
    if test_runs:
        data['last_updated'] = test_runs[-1]
    
    # Find all bugs
    bug_pattern = r'### ❌ (.+?)\n.*?File.*?: `(.+?):(\d+)`.*?(?:Status.*?: (.+?))?(?:\n|$)'
    
    for match in re.finditer(bug_pattern, content, re.DOTALL):
        test_name = match.group(1)
        file_path = match.group(2)
        line = match.group(3)
        status = match.group(4) or "Unknown"
        
        # Check if this is a recent bug (within last 24 hours)
        is_recent = False
        if test_runs:
            last_run = datetime.strptime(test_runs[-1], '%Y-%m-%d %H:%M:%S')
            time_diff = datetime.now() - last_run
            is_recent = time_diff.total_seconds() < 86400  # 24 hours
        
        data['bugs'].append({
            'test_name': test_name,
            'file': file_path,
            'line': line,
            'status': status,
            'is_recent': is_recent,
            'timestamp': test_runs[-1] if test_runs else None
        })
    
    data['bug_count'] = len(data['bugs'])
    
    return data

def identify_priority_bugs(report):
    """Identify bugs that appear frequently across test runs."""
    bug_frequency = {}
    
    for component, data in report['components'].items():
        for bug in data['bugs']:
            bug_key = f"{component}::{bug['test_name']}"
            if bug_key not in bug_frequency:
                bug_frequency[bug_key] = 0
            bug_frequency[bug_key] += 1
    
    # Bugs appearing in multiple runs are priority
    for bug_key, frequency in bug_frequency.items():
        if frequency > 1:
            component, test_name = bug_key.split('::')
            report['priority_bugs'].append({
                'component': component,
                'test_name': test_name,
                'frequency': frequency
            })
    
    # Sort by frequency
    report['priority_bugs'].sort(key=lambda x: x['frequency'], reverse=True)

def generate_markdown_report(report, output_path):
    """Generate a markdown report for context refresh."""
    content = "# Testing Context Refresh Summary\n\n"
    content += f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
    
    # Overview
    content += "## Overview\n\n"
    content += f"- **Total Components with Bugs**: {len([c for c, d in report['components'].items() if d['bug_count'] > 0])}\n"
    content += f"- **Total Documented Bugs**: {report['total_bugs']}\n"
    content += f"- **Recent Failures (24h)**: {len(report['recent_failures'])}\n"
    content += f"- **Priority Bugs**: {len(report['priority_bugs'])}\n\n"
    
    # Priority bugs
    if report['priority_bugs']:
        content += "## 🚨 Priority Bugs (Recurring Failures)\n\n"
        content += "These tests are failing consistently across multiple runs:\n\n"
        for bug in report['priority_bugs'][:10]:  # Top 10
            content += f"- **{bug['component']}** - `{bug['test_name']}` (failed {bug['frequency']} times)\n"
        content += "\n"
    
    # Recent failures
    if report['recent_failures']:
        content += "## 🕐 Recent Failures (Last 24 Hours)\n\n"
        for failure in report['recent_failures'][:10]:  # Top 10
            content += f"- **{failure['component']}** - `{failure['test']}` ({failure['timestamp']})\n"
        content += "\n"
    
    # Component summary
    content += "## Component Status\n\n"
    content += "| Component | Bugs | Test Runs | Last Updated | Status |\n"
    content += "|-----------|------|-----------|--------------|--------|\n"
    
    for component, data in sorted(report['components'].items()):
        status = "🟢" if data['bug_count'] == 0 else "🔴"
        last_updated = data['last_updated'] or "Never"
        content += f"| {component} | {data['bug_count']} | {data['test_runs']} | {last_updated} | {status} |\n"
    
    content += "\n## Next Steps for Bug Fixing\n\n"
    content += "1. **Start with Priority Bugs** - These are consistent failures\n"
    content += "2. **Review Recent Failures** - These might be new regressions\n"
    content += "3. **Check Component Docs** - Each component has detailed failure info\n"
    content += "4. **Fix Bugs, Not Tests** - Remember: the tests are correct, the code has bugs\n\n"
    
    content += "## Quick Links\n\n"
    content += "- [Testing Summary](./TESTING_SUMMARY.md)\n"
    content += "- [Component Test Docs](./components/)\n"
    
    # Write report
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w') as f:
        f.write(content)
    
    return output_path

def main():
    # Generate the summary report
    report = generate_summary_report()
    
    # Output message for Claude
    output = {
        "type": "user_prompt_submit",
        "message": f"📊 Testing context refresh summary generated!\n\n" +
                   f"Total bugs: {report['total_bugs']}\n" +
                   f"Priority bugs: {len(report['priority_bugs'])}\n" +
                   f"Recent failures: {len(report['recent_failures'])}\n\n" +
                   f"Review the summary at: testing/CONTEXT_REFRESH_SUMMARY.md"
    }
    
    print(json.dumps(output))

if __name__ == "__main__":
    main()