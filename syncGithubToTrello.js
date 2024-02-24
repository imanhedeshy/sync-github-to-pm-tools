"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const {
  GITHUB_TOKEN,
  GITHUB_USERNAME,
  GITHUB_REPO,
  TRELLO_KEY,
  TRELLO_TOKEN,
  TRELLO_LIST_ID,
} = process.env;
const fetchGitHubIssues = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const response = yield axios_1.default.get(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/issues`,
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching GitHub issues:", error);
      return [];
    }
  });
const createTrelloCard = (issue) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      yield axios_1.default.post("https://api.trello.com/1/cards", {
        name: issue.title,
        desc: `${issue.body}\n\n${issue.html_url}`,
        idList: TRELLO_LIST_ID,
        key: TRELLO_KEY,
        token: TRELLO_TOKEN,
      });
      console.log(`Card created for issue: ${issue.title}`);
    } catch (error) {
      console.error("Error creating Trello card:", error);
    }
  });
const syncIssuesToTrello = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const issues = yield fetchGitHubIssues();
    issues.forEach((issue) => createTrelloCard(issue));
  });
syncIssuesToTrello();
