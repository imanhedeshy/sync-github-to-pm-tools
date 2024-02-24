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
exports.syncToMonday = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils/utils");
const { MONDAY_API_TOKEN, MONDAY_BOARD_ID, MONDAY_GROUP_ID } = process.env;
if (!MONDAY_API_TOKEN || !MONDAY_BOARD_ID) {
    throw new Error("Required Monday.com environment variables are not set.");
}
const createMondayItem = (issue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const textContent = issue.body.replace(/"/g, '\\"');
        const query = `
      mutation {
        create_item (board_id: ${MONDAY_BOARD_ID}, group_id: "${MONDAY_GROUP_ID || ""}", item_name: "${issue.title.replace(/"/g, '\\"')}", column_values: "{\"text\": \"${textContent}\", \"link\": {\"url\": \"${issue.html_url}\", \"text\": \"GitHub Issue\"}}") {
          id
        }
      }
    `;
        const response = yield axios_1.default.post("https://api.monday.com/v2", { query }, {
            headers: {
                Authorization: `Bearer ${MONDAY_API_TOKEN}`, // Bearer token for authorization
                "Content-Type": "application/json",
            },
        });
        console.log(`Monday.com item created: ${response.data.data.create_item.id}`);
    }
    catch (error) {
        console.error("Error creating Monday.com item:", error);
    }
});
const syncToMonday = (repoAddress, githubToken) => __awaiter(void 0, void 0, void 0, function* () {
    const [username, repo] = repoAddress.split("/");
    const issues = yield (0, utils_1.fetchGitHubIssues)(username, repo, githubToken);
    for (const issue of issues) {
        yield createMondayItem(issue);
    }
});
exports.syncToMonday = syncToMonday;
