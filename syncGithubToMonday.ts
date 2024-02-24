import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const { MONDAY_API_TOKEN, MONDAY_BOARD_ID, MONDAY_GROUP_ID } = process.env;

interface GitHubIssue {
  title: string;
  body: string;
  html_url: string;
}

const createMondayItem = async (issue: GitHubIssue) => {
  try {
    const query = `
      mutation {
        create_item (board_id: ${MONDAY_BOARD_ID}, group_id: "${MONDAY_GROUP_ID}", item_name: "${issue.title.replace(
      /"/g,
      '\\"'
    )}", column_values: "{\"text\": \"${issue.body.replace(
      /"/g,
      '\\"'
    )}\", \"link\": {\"url\": \"${
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
          Authorization: MONDAY_API_TOKEN!,
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

// Example GitHub issue (Replace this with actual GitHub issue fetching logic)
const exampleGitHubIssue: GitHubIssue = {
  title: "Example Issue Title",
  body: "This is a detailed description of the issue.",
  html_url: "https://github.com/user/repo/issues/1",
};

createMondayItem(exampleGitHubIssue);
