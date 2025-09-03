// Script to capture test warnings
const { spawn } = require('child_process');

console.log('Running MobileHeader tests to capture warnings...\n');

const testProcess = spawn('npm', ['test', '--', 'MobileHeader.test.tsx'], {
  stdio: ['inherit', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

testProcess.stdout.on('data', (data) => {
  output += data.toString();
});

testProcess.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

testProcess.on('close', (code) => {
  // Extract warnings from stderr
  const warningLines = errorOutput.split('\n');
  const warnings = [];
  let currentWarning = null;
  
  for (let i = 0; i < warningLines.length; i++) {
    const line = warningLines[i];
    
    if (line.includes('Warning:')) {
      if (currentWarning) {
        warnings.push(currentWarning);
      }
      currentWarning = {
        testName: '',
        warning: line,
        details: []
      };
      
      // Look for test name in previous lines
      for (let j = i - 1; j >= 0 && j > i - 5; j--) {
        if (warningLines[j].includes('stderr |')) {
          currentWarning.testName = warningLines[j].split('stderr |')[1].trim();
          break;
        }
      }
    } else if (currentWarning && line.trim()) {
      currentWarning.details.push(line);
    }
  }
  
  if (currentWarning) {
    warnings.push(currentWarning);
  }
  
  console.log('\n=== WARNINGS FOUND ===\n');
  
  const uniqueTests = new Set();
  warnings.forEach((w, index) => {
    if (w.testName) {
      uniqueTests.add(w.testName);
      console.log(`Warning #${index + 1}:`);
      console.log(`Test: ${w.testName}`);
      console.log(`Warning: ${w.warning.trim()}`);
      console.log('---\n');
    }
  });
  
  console.log(`\nTotal warnings: ${warnings.length}`);
  console.log(`Unique tests with warnings: ${uniqueTests.size}`);
  console.log('\nTests with warnings:');
  Array.from(uniqueTests).forEach(test => {
    console.log(`- ${test}`);
  });
  
  // Also check for test results
  if (output.includes('Test Files') && output.includes('passed')) {
    console.log('\n=== TEST RESULTS ===');
    const lines = output.split('\n');
    lines.forEach(line => {
      if (line.includes('Test Files') || line.includes('Tests') || line.includes('Duration')) {
        console.log(line.trim());
      }
    });
  }
});