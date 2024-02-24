import { Client } from "asana";
import { fetchGitHubIssues, GitHubIssue } from "../utils/utils";

const { ASANA_ACCESS_TOKEN, ASANA_PROJECT_ID, ASANA_WORKSPACE_ID } =
  process.env;

if (!ASANA_ACCESS_TOKEN || !ASANA_PROJECT_ID || !ASANA_WORKSPACE_ID) {
  throw new Error("Required Asana environment variables are not set.");
}

const createAsanaTask = async (issue: GitHubIssue): Promise<void> => {
  const client = Client.create().useAccessToken(ASANA_ACCESS_TOKEN);
  try {
    const result = await client.tasks.create({
      name: issue.title,
      notes: `${issue.body}\n\n${issue.html_url}`,
      projects: [ASANA_PROJECT_ID],
      workspace: ASANA_WORKSPACE_ID,
    });
    console.log(
      `Task created for issue: ${issue.title} with id: ${result.gid}`
    );
  } catch (error) {
    console.error("Error creating Asana task:", error);
  }
};

export const syncToAsana = async (
  repoAddress: string,
  githubToken: string
): Promise<void> => {
  const [username, repo] = repoAddress.split("/");
  const issues = await fetchGitHubIssues(username, repo, githubToken);

  for (const issue of issues) {
    await createAsanaTask(issue);
  }
};
