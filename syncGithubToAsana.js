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
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const asana_1 = require("asana");
dotenv_1.default.config();
const { GITHUB_TOKEN, GITHUB_USERNAME, GITHUB_REPO, ASANA_ACCESS_TOKEN, ASANA_PROJECT_ID, ASANA_WORKSPACE_ID, } = process.env;
const fetchGitHubIssues = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/issues`, {
            headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching GitHub issues:", error);
        return [];
    }
});
const createAsanaTask = (issue) => __awaiter(void 0, void 0, void 0, function* () {
    const client = asana_1.Client.create().useAccessToken(ASANA_ACCESS_TOKEN); // Assert non-null with "!"
    try {
        yield client.tasks.create({
            name: issue.title,
            notes: `${issue.body}\n\n${issue.html_url}`,
            projects: [ASANA_PROJECT_ID], // Assert non-null with "!"
            workspace: ASANA_WORKSPACE_ID, // Include workspace ID
        });
        console.log(`Task created for issue: ${issue.title}`);
    }
    catch (error) {
        console.error("Error creating Asana task:", error);
    }
});
const syncIssuesToAsana = () => __awaiter(void 0, void 0, void 0, function* () {
    const issues = yield fetchGitHubIssues();
    for (const issue of issues) {
        yield createAsanaTask(issue);
    }
});
syncIssuesToAsana();
