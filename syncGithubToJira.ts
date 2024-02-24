// Import necessary modules
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define the GitHubIssue type
interface GitHubIssue {
  title: string;
  body: string;
  html_url: string;
}

// Declare and assert environment variables
const JIRA_HOST = process.env.JIRA_HOST!;
const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL!;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN!;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY!;

// Function to create a Jira issue
const createJiraIssue = async (issue: GitHubIssue) => {
  try {
    const response = await axios.post(
      `${JIRA_HOST}/rest/api/3/issue`,
      {
        fields: {
          project: {
            key: JIRA_PROJECT_KEY,
          },
          summary: issue.title,
          description: `${issue.body}\n\nGitHub Issue: ${issue.html_url}`,
          issuetype: {
            name: "Task", // Adjust as per your Jira issue type
          },
        },
      },
      {
        auth: {
          username: JIRA_USER_EMAIL, // Already asserted non-null above
          password: JIRA_API_TOKEN, // Already asserted non-null above
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Jira issue created: ${response.data.key}`);
  } catch (error) {
    console.error("Error creating Jira issue:", error);
  }
};

// Example usage (ensure you replace this with actual logic to fetch GitHub issues)
const exampleGitHubIssue: GitHubIssue = {
  title: "Example Issue Title",
  body: "This is a detailed description of the issue.",
  html_url: "https://github.com/user/repo/issues/1",
};

createJiraIssue(exampleGitHubIssue);
