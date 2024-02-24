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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncToJira = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils/utils");
const { JIRA_HOST, JIRA_USER_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEY } = process.env;
if (!JIRA_HOST || !JIRA_USER_EMAIL || !JIRA_API_TOKEN || !JIRA_PROJECT_KEY) {
    throw new Error("Required Jira environment variables are not set.");
}
const createJiraIssue = (issue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(`${JIRA_HOST}/rest/api/3/issue`, {
            fields: {
                project: {
                    key: JIRA_PROJECT_KEY,
                },
                summary: issue.title,
                description: `${issue.body}\n\nGitHub Issue: ${issue.html_url}`,
                issuetype: {
                    name: "Task", // Configure this according to your Jira setup
                },
            },
        }, {
            auth: {
                username: JIRA_USER_EMAIL,
                password: JIRA_API_TOKEN,
            },
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        console.log(`Jira issue created: ${response.data.key}`);
    }
    catch (error) {
        console.error("Error creating Jira issue:", error);
    }
});
const syncToJira = (repoAddress, githubToken) => __awaiter(void 0, void 0, void 0, function* () {
    const [username, repo] = repoAddress.split("/");
    const issues = yield (0, utils_1.fetchGitHubIssues)(username, repo, githubToken);
    for (const issue of issues) {
        yield createJiraIssue(issue);
    }
});
exports.syncToJira = syncToJira;
