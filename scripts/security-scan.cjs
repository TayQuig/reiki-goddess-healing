#!/usr/bin/env node

/**
 * Security Scanner for Pre-commit Hook
 * Checks for common security issues in staged files
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Patterns to detect potential security issues
const SECURITY_PATTERNS = {
  // API Keys and Secrets
  apiKey: /(?:api[_-]?key|apikey)[\s]*[:=][\s]*['"][^'"]{20,}['"]/gi,
  awsKey: /(?:AKIA|A3T|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g,
  privateKey: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/gi,

  // Credentials
  password: /(?:password|passwd|pwd)[\s]*[:=][\s]*['"][^'"]+['"]/gi,
  token: /(?:token|bearer)[\s]*[:=][\s]*['"][^'"]{20,}['"]/gi,

  // Connection Strings
  connectionString: /(?:mongodb|postgres|mysql|redis):\/\/[^@\s]+@[^\s]+/gi,

  // Email patterns (for SendGrid API key context)
  sendgridKey: /SG\.[a-zA-Z0-9]{22}\.[a-zA-Z0-9]{43}/g,

  // Other sensitive data
  creditCard: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,

  // Local file paths that shouldn't be committed (avoid false positives on relative imports)
  localPath:
    /(?:^|[^\.])(?:\/Users\/[^\/]+\/|\/home\/[^\/]+\/|C:\\Users\\[^\\]+\\)[^\s'"]+/gi,
};

// File extensions to scan
const SCAN_EXTENSIONS = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".env",
  ".yml",
  ".yaml",
];

// Files/patterns to ignore
const IGNORE_PATTERNS = [
  "node_modules",
  "dist",
  "build",
  ".git",
  "package-lock.json",
  "yarn.lock",
  ".env.example",
];

function shouldScanFile(filePath) {
  // Check if file should be ignored
  if (IGNORE_PATTERNS.some((pattern) => filePath.includes(pattern))) {
    return false;
  }

  // Check if file extension is in scan list
  const ext = path.extname(filePath);
  return SCAN_EXTENSIONS.includes(ext);
}

function scanFileContent(filePath, content) {
  const issues = [];

  for (const [name, pattern] of Object.entries(SECURITY_PATTERNS)) {
    const matches = content.match(pattern);
    if (matches) {
      // Special handling for local paths - only flag if not in comments
      if (name === "localPath") {
        const lines = content.split("\n");
        matches.forEach((match) => {
          const lineWithMatch = lines.find((line) => line.includes(match));
          if (
            lineWithMatch &&
            !lineWithMatch.trim().startsWith("//") &&
            !lineWithMatch.trim().startsWith("*")
          ) {
            issues.push({
              type: name,
              file: filePath,
              match: match.substring(0, 50) + "...",
            });
          }
        });
      } else {
        matches.forEach((match) => {
          issues.push({
            type: name,
            file: filePath,
            match: match.substring(0, 50) + "...",
          });
        });
      }
    }
  }

  return issues;
}

function getStagedFiles() {
  try {
    const result = execSync("git diff --cached --name-only", {
      encoding: "utf-8",
    });
    return result.split("\n").filter((file) => file.trim() !== "");
  } catch (error) {
    console.error("Error getting staged files:", error);
    return [];
  }
}

function main() {
  console.log("🔍 Running security scan on staged files...\n");

  const stagedFiles = getStagedFiles();
  let totalIssues = [];

  stagedFiles.forEach((file) => {
    if (shouldScanFile(file) && fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, "utf-8");
        const issues = scanFileContent(file, content);
        totalIssues = totalIssues.concat(issues);
      } catch (error) {
        console.warn(`⚠️  Could not scan ${file}: ${error.message}`);
      }
    }
  });

  if (totalIssues.length > 0) {
    console.log("❌ SECURITY ISSUES DETECTED:\n");
    totalIssues.forEach((issue) => {
      console.log(`  File: ${issue.file}`);
      console.log(`  Type: ${issue.type}`);
      console.log(`  Match: ${issue.match}`);
      console.log("  ---");
    });
    console.log(
      "\n⚠️  Please review and remove sensitive data before committing."
    );
    console.log(
      "💡 Tip: Use environment variables for sensitive configuration.\n"
    );
    process.exit(1);
  } else {
    console.log("✅ No security issues detected in staged files.\n");
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { scanFileContent, SECURITY_PATTERNS };
