"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncToAsana = void 0;
const asana_1 = require("asana");
const utils_1 = require("../utils/utils");
const { ASANA_ACCESS_TOKEN, ASANA_PROJECT_ID, ASANA_WORKSPACE_ID } = process.env;
if (!ASANA_ACCESS_TOKEN || !ASANA_PROJECT_ID || !ASANA_WORKSPACE_ID) {
    throw new Error("Required Asana environment variables are not set.");
}
const createAsanaTask = (issue) => __awaiter(void 0, void 0, void 0, function* () {
    const client = asana_1.Client.create().useAccessToken(ASANA_ACCESS_TOKEN);
    try {
        const result = yield client.tasks.create({
            name: issue.title,
            notes: `${issue.body}\n\n${issue.html_url}`,
            projects: [ASANA_PROJECT_ID],
            workspace: ASANA_WORKSPACE_ID,
        });
        console.log(`Task created for issue: ${issue.title} with id: ${result.gid}`);
    }
    catch (error) {
        console.error("Error creating Asana task:", error);
    }
});
const syncToAsana = (repoAddress, githubToken) => __awaiter(void 0, void 0, void 0, function* () {
    const [username, repo] = repoAddress.split("/");
    const issues = yield (0, utils_1.fetchGitHubIssues)(username, repo, githubToken);
    for (const issue of issues) {
        yield createAsanaTask(issue);
    }
});
exports.syncToAsana = syncToAsana;
