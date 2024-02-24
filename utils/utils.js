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
exports.fetchGitHubIssues = void 0;
const axios_1 = __importDefault(require("axios"));
// Function to fetch issues from a GitHub repository
const fetchGitHubIssues = (username, repo, token) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://api.github.com/repos/${username}/${repo}/issues`;
    try {
        const response = yield axios_1.default.get(url, {
            headers: { Authorization: `token ${token}` },
        });
        return response.data; // Assuming the response data is directly the array of issues
    }
    catch (error) {
        console.error("Error fetching GitHub issues:", error);
        throw error; // Rethrow the error to handle it in the calling function
    }
});
exports.fetchGitHubIssues = fetchGitHubIssues;
// Any other utility functions that might be shared across your scripts can go here as well
