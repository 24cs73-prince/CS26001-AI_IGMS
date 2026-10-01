import fs from "fs";
import path from "path";

function scanDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(scanDir(fullPath));
    } else if (file.endsWith(".jsx") || file.endsWith(".js")) {
      results.push(fullPath);
    }
  }
  return results;
}

const allFiles = scanDir("src");
const pages = allFiles.filter((f) => f.includes(path.sep + "pages" + path.sep));

const databaseBacked = [];
const partiallyConnected = [];
const mockDataOnly = [];

pages.forEach((pagePath) => {
  const relPath = path.relative("src", pagePath).replace(/\\/g, "/");
  const content = fs.readFileSync(pagePath, "utf8");

  const usesApi =
    content.includes("services/api") ||
    content.includes("/api/") ||
    content.includes("fetch(") ||
    content.includes("api.");
  const usesMock =
    content.includes("/data/") ||
    content.includes("mock") ||
    content.includes("sampleData");

  if (usesApi && !usesMock) {
    databaseBacked.push(relPath);
  } else if (usesApi && usesMock) {
    partiallyConnected.push(relPath);
  } else {
    mockDataOnly.push(relPath);
  }
});

console.log("==================================================");
console.log("FRONTEND INTEGRATION AUDIT REPORT");
console.log("==================================================");

console.log(`\n1. DATABASE-BACKED PAGES (${databaseBacked.length}):`);
databaseBacked.forEach((p) => console.log("   ✅ " + p));

console.log(`\n2. PARTIALLY CONNECTED PAGES (${partiallyConnected.length}):`);
partiallyConnected.forEach((p) => console.log("   🟡 " + p));

console.log(`\n3. MOCK DATA PAGES (${mockDataOnly.length}):`);
mockDataOnly.forEach((p) => console.log("   ⚪ " + p));
