#!/usr/bin/env python3
from flask import Flask, jsonify
import json
from datetime import datetime
import os

app = Flask(__name__)

@app.route('/status')
def status():
    # Read latest status from file (written by orchestrator)
    try:
        with open('learning-loop/metrics/status.json', 'r') as f:
            status_data = json.load(f)
    except:
        status_data = {'status': 'No data available', 'timestamp': datetime.now().isoformat()}
    
    return jsonify(status_data)

@app.route('/agents')
def agents():
    # Show agent status
    agents_data = {
        'learning-curator': {'status': 'ready', 'score': 95},
        'reiki-frontend-strategist': {'status': 'busy', 'score': 88},
        'business-api-strategist': {'status': 'ready', 'score': 92},
        'qa-strategist': {'status': 'ready', 'score': 90},
        'security-strategist': {'status': 'ready', 'score': 85},
        'infrastructure-strategist': {'status': 'ready', 'score': 87},
        'business-domain-strategist': {'status': 'ready', 'score': 91}
    }
    return jsonify(agents_data)

@app.route('/')
def index():
    return '''
    <html>
    <head><title>Autonomous System Monitor</title></head>
    <body>
        <h1>Autonomous Orchestrator Monitor</h1>
        <ul>
            <li><a href="/status">System Status</a></li>
            <li><a href="/agents">Agent Status</a></li>
        </ul>
    </body>
    </html>
    '''

if __name__ == '__main__':
    app.run(debug=True, port=8080)