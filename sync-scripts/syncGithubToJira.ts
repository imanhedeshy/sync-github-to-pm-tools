import axios from "axios";
import { fetchGitHubIssues, GitHubIssue } from "../utils/utils";

const { JIRA_HOST, JIRA_USER_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEY } =
  process.env;

if (!JIRA_HOST || !JIRA_USER_EMAIL || !JIRA_API_TOKEN || !JIRA_PROJECT_KEY) {
  throw new Error("Required Jira environment variables are not set.");
}

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
            name: "Task", // Configure this according to your Jira setup
          },
        },
      },
      {
        auth: {
          username: JIRA_USER_EMAIL,
          password: JIRA_API_TOKEN,
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

export const syncToJira = async (repoAddress: string, githubToken: string) => {
  const [username, repo] = repoAddress.split("/");

  const issues = await fetchGitHubIssues(username, repo, githubToken);

  for (const issue of issues) {
    await createJiraIssue(issue);
  }
};
