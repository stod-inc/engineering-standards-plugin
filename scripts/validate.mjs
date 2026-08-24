import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const pluginRoot = join(root, "plugins", "stod-engineering-standards");
const expectedVersion = "1.0.2";

const readJson = (path) => JSON.parse(readFileSync(join(root, path), "utf8"));
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const codexMarketplace = readJson(".agents/plugins/marketplace.json");
const claudeMarketplace = readJson(".claude-plugin/marketplace.json");
const codexPlugin = readJson("plugins/stod-engineering-standards/.codex-plugin/plugin.json");
const claudePlugin = readJson("plugins/stod-engineering-standards/.claude-plugin/plugin.json");
const mcp = readJson("plugins/stod-engineering-standards/.mcp.json");

assert(codexMarketplace.name === "stod-standards", "Codex marketplace name must be stod-standards");
assert(claudeMarketplace.name === "stod-standards", "Claude marketplace name must be stod-standards");
assert(codexMarketplace.plugins?.[0]?.name === "stod-engineering-standards", "Codex marketplace plugin is missing");
assert(claudeMarketplace.plugins?.[0]?.name === "stod-engineering-standards", "Claude marketplace plugin is missing");
assert(codexMarketplace.plugins?.[0]?.source?.path === "./plugins/stod-engineering-standards", "Codex marketplace source must stay local to this repository");
assert(claudeMarketplace.plugins?.[0]?.source === "./plugins/stod-engineering-standards", "Claude marketplace source must stay local to this repository");
assert(codexPlugin.version === expectedVersion, "Codex Plugin version is out of sync");
assert(claudePlugin.version === expectedVersion, "Claude Plugin version is out of sync");
assert(claudeMarketplace.plugins?.[0]?.version === expectedVersion, "Claude marketplace version is out of sync");
assert(codexPlugin.repository === "https://github.com/stod-inc/engineering-standards-plugin", "Codex repository metadata is incorrect");
assert(claudePlugin.repository === "https://github.com/stod-inc/engineering-standards-plugin", "Claude repository metadata is incorrect");
assert(mcp.mcpServers?.["stod-standards"]?.type === "http", "MCP transport must be HTTP");
assert(mcp.mcpServers?.["stod-standards"]?.url === "https://standards-mcp.matchstod.com/mcp", "MCP endpoint is incorrect");

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

const publicFiles = walk(root)
  .map((path) => relative(root, path))
  .filter((path) => path !== ".git" && !path.startsWith(".git/"))
  .sort();

const expectedFiles = [
  ".agents/plugins/marketplace.json",
  ".claude-plugin/marketplace.json",
  ".github/CODEOWNERS",
  ".github/workflows/validate.yml",
  "LICENSE",
  "README.md",
  "SECURITY.md",
  "SETUP_PROMPT.md",
  "plugins/stod-engineering-standards/.claude-plugin/plugin.json",
  "plugins/stod-engineering-standards/.codex-plugin/plugin.json",
  "plugins/stod-engineering-standards/.mcp.json",
  "plugins/stod-engineering-standards/skills/stod-engineering-standards/SKILL.md",
  "plugins/stod-engineering-standards/skills/stod-engineering-standards/agents/openai.yaml",
  "plugins/stod-engineering-standards/skills/stod-engineering-standards/references/integrations.md",
  "scripts/validate.mjs"
].sort();

assert(JSON.stringify(publicFiles) === JSON.stringify(expectedFiles), `Unexpected public files: ${publicFiles.filter((path) => !expectedFiles.includes(path)).join(", ") || "missing required file"}`);

const publicText = publicFiles.map((path) => readFileSync(join(root, path), "utf8")).join("\n");
const forbiddenFragments = [
  ["stod-inc", "/skills"].join(""),
  ["BEGIN ", "PRIVATE KEY"].join(""),
  ["gh", "p_"].join(""),
  ["github", "_pat_"].join(""),
  ["s", "k-"].join("")
];
for (const forbidden of forbiddenFragments) {
  assert(!publicText.includes(forbidden), `Public distribution contains forbidden text: ${forbidden}`);
}

assert(statSync(pluginRoot).isDirectory(), "Plugin root is missing");

if (failures.length > 0) {
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Validated ${publicFiles.length} public files for Plugin v${expectedVersion}`);
