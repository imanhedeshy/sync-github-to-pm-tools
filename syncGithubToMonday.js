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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { MONDAY_API_TOKEN, MONDAY_BOARD_ID, MONDAY_GROUP_ID } = process.env;
const createMondayItem = (issue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
      mutation {
        create_item (board_id: ${MONDAY_BOARD_ID}, group_id: "${MONDAY_GROUP_ID}", item_name: "${issue.title.replace(/"/g, '\\"')}", column_values: "{\"text\": \"${issue.body.replace(/"/g, '\\"')}\", \"link\": {\"url\": \"${issue.html_url}\", \"text\": \"GitHub Issue\"}}") {
          id
        }
      }
    `;
        const response = yield axios_1.default.post("https://api.monday.com/v2", { query }, {
            headers: {
                Authorization: MONDAY_API_TOKEN,
                "Content-Type": "application/json",
            },
        });
        console.log(`Monday.com item created: ${response.data.data.create_item.id}`);
    }
    catch (error) {
        console.error("Error creating Monday.com item:", error);
    }
});
// Example GitHub issue (Replace this with actual GitHub issue fetching logic)
const exampleGitHubIssue = {
    title: "Example Issue Title",
    body: "This is a detailed description of the issue.",
    html_url: "https://github.com/user/repo/issues/1",
};
createMondayItem(exampleGitHubIssue);
