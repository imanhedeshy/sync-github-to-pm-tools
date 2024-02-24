import axios, { AxiosResponse } from "axios";

// Define the structure of a GitHub issue based on what you expect to receive from the GitHub API
export interface GitHubIssue {
  title: string;
  body: string;
  html_url: string;
  // ... add any other relevant fields ...
}

// Function to fetch issues from a GitHub repository
export const fetchGitHubIssues = async (
  username: string,
  repo: string,
  token: string
): Promise<GitHubIssue[]> => {
  const url = `https://api.github.com/repos/${username}/${repo}/issues`;
  try {
    const response: AxiosResponse<GitHubIssue[]> = await axios.get(url, {
      headers: { Authorization: `token ${token}` },
    });
    return response.data; // Assuming the response data is directly the array of issues
  } catch (error) {
    console.error("Error fetching GitHub issues:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

// Any other utility functions that might be shared across your scripts can go here as well
