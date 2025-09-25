#!/usr/bin/env node

/**
 * Example script demonstrating temporary file usage for test aggregation
 */

import { 
  writeTempFile, 
  readTempFile, 
  aggregateTestResults,
  createTimestampedFilename,
  listTempFiles,
  cleanupTempFiles
} from '../packages/shared-utils/dist/index.js';
import { execSync } from 'child_process';

async function runExample() {
  console.log('🔧 Temporary File Usage Example\n');

  // Example 1: Store test results
  console.log('1️⃣ Running tests and storing results...');
  try {
    const testOutput = execSync('npm test -- --reporter=json', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    const filename = createTimestampedFilename('test-results');
    const filepath = await writeTempFile(filename, testOutput);
    console.log(`   ✅ Test results saved to: ${filepath}`);
  } catch (error) {
    console.log('   ⚠️  Tests failed, but that\'s okay for this demo');
  }

  // Example 2: Cache API response
  console.log('\n2️⃣ Caching mock API response...');
  const mockApiData = {
    endpoint: '/api/services',
    timestamp: new Date().toISOString(),
    data: [
      { id: 1, name: 'Reiki Healing', price: 120 },
      { id: 2, name: 'Sound Therapy', price: 90 },
      { id: 3, name: 'Crystal Healing', price: 80 }
    ]
  };
  
  await writeTempFile('api-cache-services.json', mockApiData);
  console.log('   ✅ API response cached');

  // Example 3: Track migration progress
  console.log('\n3️⃣ Tracking migration progress...');
  const migrationLog = `
Migration Phase 4B Progress
Started: ${new Date().toISOString()}
Files processed:
- ContactPage.tsx ✅
- FigmaContactForm.tsx ✅
- ContactInfoCard.tsx ✅
Next: ServicesPage.tsx
  `.trim();
  
  await writeTempFile('migration-phase4b.log', migrationLog);
  console.log('   ✅ Migration progress logged');

  // Example 4: List temp files
  console.log('\n4️⃣ Listing temporary files...');
  const files = await listTempFiles();
  console.log(`   Found ${files.length} temp files:`);
  files.forEach(file => console.log(`   - ${file}`));

  // Example 5: Read cached data
  console.log('\n5️⃣ Reading cached API data...');
  const cachedData = await readTempFile('api-cache-services.json', true);
  console.log(`   Services found: ${cachedData.data.length}`);
  cachedData.data.forEach(service => {
    console.log(`   - ${service.name}: $${service.price}`);
  });

  // Example 6: Aggregate test results (if any exist)
  console.log('\n6️⃣ Aggregating test results...');
  try {
    const aggregated = await aggregateTestResults();
    console.log(`   Total tests: ${aggregated.totalTests}`);
    console.log(`   Passed: ${aggregated.totalPassed}`);
    console.log(`   Failed: ${aggregated.totalFailed}`);
  } catch (error) {
    console.log('   ℹ️  No test results to aggregate yet');
  }

  // Example 7: Cleanup old files (older than 1 hour for demo)
  console.log('\n7️⃣ Cleaning up old temp files...');
  await cleanupTempFiles(60 * 60 * 1000); // 1 hour
  console.log('   ✅ Cleanup complete');

  console.log('\n✨ Example complete! Check .tmp/ directory for files.');
}

// Run the example
runExample().catch(console.error);