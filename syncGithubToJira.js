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
// Import necessary modules
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Declare and assert environment variables
const JIRA_HOST = process.env.JIRA_HOST;
const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY;
// Function to create a Jira issue
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
                    name: "Task", // Adjust as per your Jira issue type
                },
            },
        }, {
            auth: {
                username: JIRA_USER_EMAIL, // Already asserted non-null above
                password: JIRA_API_TOKEN, // Already asserted non-null above
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
// Example usage (ensure you replace this with actual logic to fetch GitHub issues)
const exampleGitHubIssue = {
    title: "Example Issue Title",
    body: "This is a detailed description of the issue.",
    html_url: "https://github.com/user/repo/issues/1",
};
createJiraIssue(exampleGitHubIssue);
