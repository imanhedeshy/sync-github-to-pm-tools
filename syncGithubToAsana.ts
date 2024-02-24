import dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import { Client } from "asana";

dotenv.config();

const {
  GITHUB_TOKEN,
  GITHUB_USERNAME,
  GITHUB_REPO,
  ASANA_ACCESS_TOKEN,
  ASANA_PROJECT_ID,
  ASANA_WORKSPACE_ID,
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
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub issues:", error);
    return [];
  }
};

const createAsanaTask = async (issue: GitHubIssue): Promise<void> => {
  const client = Client.create().useAccessToken(ASANA_ACCESS_TOKEN!); // Assert non-null with "!"
  try {
    await client.tasks.create({
      name: issue.title,
      notes: `${issue.body}\n\n${issue.html_url}`,
      projects: [ASANA_PROJECT_ID!], // Assert non-null with "!"
      workspace: ASANA_WORKSPACE_ID!, // Include workspace ID
    });
    console.log(`Task created for issue: ${issue.title}`);
  } catch (error) {
    console.error("Error creating Asana task:", error);
  }
};

const syncIssuesToAsana = async (): Promise<void> => {
  const issues = await fetchGitHubIssues();
  for (const issue of issues) {
    await createAsanaTask(issue);
  }
};

syncIssuesToAsana();
