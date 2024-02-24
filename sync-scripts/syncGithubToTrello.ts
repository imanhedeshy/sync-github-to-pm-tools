import axios from "axios";
import { fetchGitHubIssues, GitHubIssue } from "../utils/utils";

const { TRELLO_KEY, TRELLO_TOKEN, TRELLO_LIST_ID } = process.env;

if (!TRELLO_KEY || !TRELLO_TOKEN || !TRELLO_LIST_ID) {
  throw new Error("Required Trello environment variables are not set.");
}

const createTrelloCard = async (issue: GitHubIssue): Promise<void> => {
  try {
    const response = await axios.post("https://api.trello.com/1/cards", {
      name: issue.title,
      desc: `${issue.body}\n\n${issue.html_url}`,
      idList: TRELLO_LIST_ID,
      key: TRELLO_KEY,
      token: TRELLO_TOKEN,
    });
    console.log(
      `Card created for issue: ${issue.title}, card id: ${response.data.id}`
    );
  } catch (error) {
    console.error("Error creating Trello card:", error);
  }
};

export const syncToTrello = async (
  repoAddress: string,
  githubToken: string
): Promise<void> => {
  const [username, repo] = repoAddress.split("/");
  const issues = await fetchGitHubIssues(username, repo, githubToken);

  await Promise.all(issues.map((issue) => createTrelloCard(issue)));
};
