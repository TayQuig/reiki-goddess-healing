import { promises as fs } from "fs";
import path from "path";

/**
 * Utility functions for working with temporary files in the .tmp directory
 */

const TMP_DIR = path.join(process.cwd(), ".tmp");

/**
 * Ensures the .tmp directory exists
 */
export async function ensureTmpDir(): Promise<void> {
  try {
    await fs.mkdir(TMP_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create .tmp directory:", error);
    throw error;
  }
}

/**
 * Writes data to a temporary file
 * @param filename - Name of the file (will be created in .tmp/)
 * @param data - Data to write (will be JSON stringified if object)
 * @returns Path to the created file
 */
export async function writeTempFile(
  filename: string,
  data: any
): Promise<string> {
  await ensureTmpDir();
  const filepath = path.join(TMP_DIR, filename);

  const content =
    typeof data === "string" ? data : JSON.stringify(data, null, 2);

  await fs.writeFile(filepath, content, "utf8");
  return filepath;
}

/**
 * Reads data from a temporary file
 * @param filename - Name of the file in .tmp/
 * @param parseJson - Whether to parse the content as JSON
 * @returns File content
 */
export async function readTempFile(
  filename: string,
  parseJson = false
): Promise<any> {
  const filepath = path.join(TMP_DIR, filename);
  const content = await fs.readFile(filepath, "utf8");

  return parseJson ? JSON.parse(content) : content;
}

/**
 * Lists all files in the .tmp directory
 * @param pattern - Optional pattern to filter files (e.g., 'test-results-*.json')
 * @returns Array of filenames
 */
export async function listTempFiles(pattern?: string): Promise<string[]> {
  try {
    const files = await fs.readdir(TMP_DIR);

    if (!pattern) return files;

    // Simple pattern matching (supports * wildcard)
    const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
    return files.filter((file) => regex.test(file));
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return []; // Directory doesn't exist yet
    }
    throw error;
  }
}

/**
 * Cleans up old temporary files
 * @param olderThanMs - Remove files older than this many milliseconds
 */
export async function cleanupTempFiles(
  olderThanMs: number = 24 * 60 * 60 * 1000
): Promise<void> {
  const files = await listTempFiles();
  const now = Date.now();

  for (const file of files) {
    const filepath = path.join(TMP_DIR, file);
    const stats = await fs.stat(filepath);

    if (now - stats.mtime.getTime() > olderThanMs) {
      await fs.unlink(filepath);
    }
  }
}

/**
 * Creates a timestamped filename
 * @param prefix - Filename prefix
 * @param extension - File extension (default: json)
 * @returns Timestamped filename
 */
export function createTimestampedFilename(
  prefix: string,
  extension = "json"
): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${prefix}-${timestamp}.${extension}`;
}

/**
 * Aggregates test results from multiple files
 * @param pattern - Pattern to match test result files
 * @returns Aggregated test results
 */
export async function aggregateTestResults(
  pattern = "test-results-*.json"
): Promise<{
  totalTests: number;
  totalPassed: number;
  totalFailed: number;
  packages: Record<string, any>;
}> {
  const files = await listTempFiles(pattern);
  const results = {
    totalTests: 0,
    totalPassed: 0,
    totalFailed: 0,
    packages: {} as Record<string, any>,
  };

  for (const file of files) {
    const data = await readTempFile(file, true);

    if (data.numTotalTests) {
      results.totalTests += data.numTotalTests;
      results.totalPassed += data.numPassedTests || 0;
      results.totalFailed += data.numFailedTests || 0;
    }

    // Extract package name from test suite if available
    if (data.testResults) {
      data.testResults.forEach((suite: any) => {
        const packageName =
          suite.name.match(/packages\/([^/]+)/)?.[1] || "unknown";
        if (!results.packages[packageName]) {
          results.packages[packageName] = {
            tests: 0,
            passed: 0,
            failed: 0,
          };
        }
        results.packages[packageName].tests +=
          suite.numPassingTests + suite.numFailingTests;
        results.packages[packageName].passed += suite.numPassingTests;
        results.packages[packageName].failed += suite.numFailingTests;
      });
    }
  }

  return results;
}
