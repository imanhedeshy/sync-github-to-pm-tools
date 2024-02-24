import dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";

dotenv.config();

const {
  GITHUB_TOKEN,
  GITHUB_USERNAME,
  GITHUB_REPO,
  TRELLO_KEY,
  TRELLO_TOKEN,
  TRELLO_LIST_ID,
} = process.env;

interface GitHubIssue {
  title: string;
  body: string;
  html_url: string;
}

const fetchGitHubIssues = async (): Promise<GitHubIssue[]> => {
  try {
    const response: AxiosResponse<GitHubIssue[]> = await axios.get(
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
};

const createTrelloCard = async (issue: GitHubIssue): Promise<void> => {
  try {
    await axios.post("https://api.trello.com/1/cards", {
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
};

const syncIssuesToTrello = async (): Promise<void> => {
  const issues = await fetchGitHubIssues();
  issues.forEach((issue) => createTrelloCard(issue));
};

syncIssuesToTrello();