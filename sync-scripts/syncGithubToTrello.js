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
exports.syncToTrello = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils/utils");
const { TRELLO_KEY, TRELLO_TOKEN, TRELLO_LIST_ID } = process.env;
if (!TRELLO_KEY || !TRELLO_TOKEN || !TRELLO_LIST_ID) {
    throw new Error("Required Trello environment variables are not set.");
}
const createTrelloCard = (issue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post("https://api.trello.com/1/cards", {
            name: issue.title,
            desc: `${issue.body}\n\n${issue.html_url}`,
            idList: TRELLO_LIST_ID,
            key: TRELLO_KEY,
            token: TRELLO_TOKEN,
        });
        console.log(`Card created for issue: ${issue.title}, card id: ${response.data.id}`);
    }
    catch (error) {
        console.error("Error creating Trello card:", error);
    }
});
const syncToTrello = (repoAddress, githubToken) => __awaiter(void 0, void 0, void 0, function* () {
    const [username, repo] = repoAddress.split("/");
    const issues = yield (0, utils_1.fetchGitHubIssues)(username, repo, githubToken);
    yield Promise.all(issues.map((issue) => createTrelloCard(issue)));
});
exports.syncToTrello = syncToTrello;
