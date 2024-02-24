import axios from "axios";
import { fetchGitHubIssues, GitHubIssue } from "../utils/utils";

const { MONDAY_API_TOKEN, MONDAY_BOARD_ID, MONDAY_GROUP_ID } = process.env;

if (!MONDAY_API_TOKEN || !MONDAY_BOARD_ID) {
  throw new Error("Required Monday.com environment variables are not set.");
}

const createMondayItem = async (issue: GitHubIssue) => {
  try {
    const textContent = issue.body.replace(/"/g, '\\"');
    const query = `
      mutation {
        create_item (board_id: ${MONDAY_BOARD_ID}, group_id: "${
      MONDAY_GROUP_ID || ""
    }", item_name: "${issue.title.replace(
      /"/g,
      '\\"'
    )}", column_values: "{\"text\": \"${textContent}\", \"link\": {\"url\": \"${
      issue.html_url
    }\", \"text\": \"GitHub Issue\"}}") {
          id
        }
      }
    `;

    const response = await axios.post(
      "https://api.monday.com/v2",
      { query },
      {
        headers: {
          Authorization: `Bearer ${MONDAY_API_TOKEN}`, // Bearer token for authorization
          "Content-Type": "application/json",
        },
      }
    );
    console.log(
      `Monday.com item created: ${response.data.data.create_item.id}`
    );
  } catch (error) {
    console.error("Error creating Monday.com item:", error);
  }
};

export const syncToMonday = async (
  repoAddress: string,
  githubToken: string
) => {
  const [username, repo] = repoAddress.split("/");
  const issues = await fetchGitHubIssues(username, repo, githubToken);

  for (const issue of issues) {
    await createMondayItem(issue);
  }
};
