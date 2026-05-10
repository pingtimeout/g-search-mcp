#!/usr/bin/env node

/**
 * MCP server for Google search using Playwright headless browser
 * Provides functionality to search on Google with multiple keywords
 */

import { homedir } from "node:os";
import { join } from "node:path";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
import { logger } from "./utils/logger.js";

// Parse command line arguments, check for debug flag
export const isDebugMode = process.argv.includes("--debug");

function parseArg(name: string): string | undefined {
  const idx = process.argv.indexOf(name);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

const defaultStateDir = join(homedir(), ".local", "share", "g-search-mcp");
export const stateDir = parseArg("--state-dir") ?? defaultStateDir;

function printHelp(): void {
  const help = [
    "Usage: g-search-mcp [options]",
    "",
    "MCP server for Google search using Playwright headless browser",
    "",
    "Options:",
    "  -h, --help          Show this help message",
    "  --debug             Enable debug mode (shows Chrome browser window)",
    "  --log               Enable verbose logging to stderr",
    "  --state-dir <path>  Directory for browser state persistence (default: ~/.local/share/g-search-mcp)",
    "",
  ];
  process.stdout.write(help.join("\n"));
  process.exit(0);
}

// Handle --help / -h before starting the server
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  printHelp();
}

/**
 * Start the server
 */
async function main() {
  logger.info("[Setup] Initializing Google Search MCP server...");

  if (isDebugMode) {
    logger.debug("[Setup] Debug mode enabled, Chrome browser window will be visible");
  }

  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("[Setup] Server started");
}

main().catch((error) => {
  logger.error(`[Error] Server error: ${error}`);
  process.exit(1);
});
