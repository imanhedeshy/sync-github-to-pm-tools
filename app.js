"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const syncGithubToAsana_1 = require("./sync-scripts/syncGithubToAsana");
const syncGithubToJira_1 = require("./sync-scripts/syncGithubToJira");
const syncGithubToMonday_1 = require("./sync-scripts/syncGithubToMonday");
const syncGithubToTrello_1 = require("./sync-scripts/syncGithubToTrello");
const { GITHUB_TOKEN } = process.env;
if (!GITHUB_TOKEN) {
    console.error('The GITHUB_TOKEN environment variable is not set.');
    process.exit(1);
}
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .options({
    tool: { type: "string", demandOption: true },
    repo: { type: "string", demandOption: true },
})
    .parseSync();
const { tool, repo } = argv;
const syncFunctions = {
    asana: syncGithubToAsana_1.syncToAsana,
    jira: syncGithubToJira_1.syncToJira,
    monday: syncGithubToMonday_1.syncToMonday,
    trello: syncGithubToTrello_1.syncToTrello,
};
if (syncFunctions[tool]) {
    syncFunctions[tool](repo, GITHUB_TOKEN).catch(console.error);
}
else {
    console.error(`The specified tool '${tool}' is not supported.`);
}
