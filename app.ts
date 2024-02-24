import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { syncToAsana } from "./sync-scripts/syncGithubToAsana";
import { syncToJira } from "./sync-scripts/syncGithubToJira";
import { syncToMonday } from "./sync-scripts/syncGithubToMonday";
import { syncToTrello } from "./sync-scripts/syncGithubToTrello";

const { GITHUB_TOKEN } = process.env;

if (!GITHUB_TOKEN) {
  console.error('The GITHUB_TOKEN environment variable is not set.');
  process.exit(1);
}

const argv = yargs(hideBin(process.argv))
  .options({
    tool: { type: "string", demandOption: true },
    repo: { type: "string", demandOption: true },
  })
  .parseSync();

const { tool, repo } = argv;

const syncFunctions: Record<string, (repo: string, githubToken: string) => Promise<void>> = {
  asana: syncToAsana,
  jira: syncToJira,
  monday: syncToMonday,
  trello: syncToTrello,
};

if (syncFunctions[tool]) {
  syncFunctions[tool](repo, GITHUB_TOKEN).catch(console.error);
} else {
  console.error(`The specified tool '${tool}' is not supported.`);
}
