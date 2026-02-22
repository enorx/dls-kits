/**
 * GitHub API Service for DLS KITS
 * Handles all GitHub API operations including commits, file uploads, and data fetching
 */

import type { DataStore } from '@/types';

// GitHub configuration from environment
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER || '';
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || '';
const GITHUB_BRANCH = import.meta.env.VITE_GITHUB_BRANCH || 'main';

// API Base URL
const API_BASE = 'https://api.github.com';

// Headers for GitHub API requests
const getHeaders = () => ({
  'Accept': 'application/vnd.github.v3+json',
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Content-Type': 'application/json',
});

// Error types
export class GitHubAPIError extends Error {
  status?: number;
  response?: any;
  
  constructor(message: string, status?: number, response?: any) {
    super(message);
    this.name = 'GitHubAPIError';
    this.status = status;
    this.response = response;
  }
}

export class GitHubConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GitHubConfigError';
  }
}

// Validate configuration
export function validateConfig(): void {
  if (!GITHUB_TOKEN) {
    throw new GitHubConfigError('GitHub token not configured. Set VITE_GITHUB_TOKEN in environment.');
  }
  if (!GITHUB_OWNER) {
    throw new GitHubConfigError('GitHub owner not configured. Set VITE_GITHUB_OWNER in environment.');
  }
  if (!GITHUB_REPO) {
    throw new GitHubConfigError('GitHub repo not configured. Set VITE_GITHUB_REPO in environment.');
  }
}

// Get file content from repository
export async function getFileContent(path: string): Promise<{ content: string; sha: string } | null> {
  validateConfig();
  
  try {
    const response = await fetch(
      `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
      { headers: getHeaders() }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new GitHubAPIError(
        error.message || 'Failed to fetch file',
        response.status,
        error
      );
    }

    const data = await response.json();
    return {
      content: atob(data.content.replace(/\s/g, '')),
      sha: data.sha,
    };
  } catch (error) {
    if (error instanceof GitHubAPIError || error instanceof GitHubConfigError) {
      throw error;
    }
    throw new GitHubAPIError('Network error while fetching file');
  }
}

// Create or update file in repository
export async function commitFile(
  path: string,
  content: string,
  message: string,
  existingSha?: string
): Promise<{ sha: string; commitSha: string }> {
  validateConfig();

  const body: any = {
    message,
    content: btoa(content),
    branch: GITHUB_BRANCH,
  };

  if (existingSha) {
    body.sha = existingSha;
  }

  const response = await fetch(
    `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new GitHubAPIError(
      error.message || 'Failed to commit file',
      response.status,
      error
    );
  }

  const data = await response.json();
  return {
    sha: data.content.sha,
    commitSha: data.commit.sha,
  };
}

// Delete file from repository
export async function deleteFile(
  path: string,
  sha: string,
  message: string
): Promise<void> {
  validateConfig();

  const response = await fetch(
    `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({
        message,
        sha,
        branch: GITHUB_BRANCH,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new GitHubAPIError(
      error.message || 'Failed to delete file',
      response.status,
      error
    );
  }
}

// Get the latest commit SHA for the branch
export async function getLatestCommitSha(): Promise<string> {
  validateConfig();

  const response = await fetch(
    `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/${GITHUB_BRANCH}`,
    { headers: getHeaders() }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new GitHubAPIError(
      error.message || 'Failed to get latest commit',
      response.status,
      error
    );
  }

  const data = await response.json();
  return data.object.sha;
}

// Get tree SHA from commit
export async function getTreeSha(commitSha: string): Promise<string> {
  validateConfig();

  const response = await fetch(
    `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits/${commitSha}`,
    { headers: getHeaders() }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new GitHubAPIError(
      error.message || 'Failed to get tree',
      response.status,
      error
    );
  }

  const data = await response.json();
  return data.tree.sha;
}

// Create a new tree with multiple files
export async function createTree(
  baseTreeSha: string,
  files: { path: string; content: string; mode?: string }[]
): Promise<string> {
  validateConfig();

  const tree = files.map(file => ({
    path: file.path,
    mode: file.mode || '100644',
    type: 'blob',
    content: file.content,
  }));

  const response = await fetch(
    `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new GitHubAPIError(
      error.message || 'Failed to create tree',
      response.status,
      error
    );
  }

  const data = await response.json();
  return data.sha;
}

// Create a commit
export async function createCommit(
  message: string,
  treeSha: string,
  parentSha: string
): Promise<string> {
  validateConfig();

  const response = await fetch(
    `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        message,
        tree: treeSha,
        parents: [parentSha],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new GitHubAPIError(
      error.message || 'Failed to create commit',
      response.status,
      error
    );
  }

  const data = await response.json();
  return data.sha;
}

// Update branch reference
export async function updateBranch(commitSha: string): Promise<void> {
  validateConfig();

  const response = await fetch(
    `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/${GITHUB_BRANCH}`,
    {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        sha: commitSha,
        force: false,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new GitHubAPIError(
      error.message || 'Failed to update branch',
      response.status,
      error
    );
  }
}

// Upload image as base64 to repository
export async function uploadImage(
  fileName: string,
  base64Content: string,
  message: string
): Promise<{ path: string; sha: string; url: string }> {
  validateConfig();

  const path = `assets/images/${fileName}`;
  
  // Check if file already exists
  const existing = await getFileContent(path);
  
  const result = await commitFile(
    path,
    base64Content,
    message,
    existing?.sha
  );

  return {
    path,
    sha: result.sha,
    url: `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`,
  };
}

// Fetch data.json from repository
export async function fetchDataFromGitHub(): Promise<DataStore> {
  validateConfig();

  const fileData = await getFileContent('data/data.json');
  
  if (!fileData) {
    throw new GitHubAPIError('data/data.json not found in repository');
  }

  try {
    const data = JSON.parse(fileData.content) as DataStore;
    return data;
  } catch (error) {
    throw new GitHubAPIError('Invalid JSON in data/data.json');
  }
}

// Commit data.json to repository
export async function commitDataToGitHub(
  data: DataStore,
  message: string
): Promise<{ sha: string; commitSha: string }> {
  validateConfig();

  const content = JSON.stringify(data, null, 2);
  
  // Get existing file SHA if it exists
  const existing = await getFileContent('data/data.json');
  
  return await commitFile(
    'data/data.json',
    content,
    message,
    existing?.sha
  );
}

// Get repository info
export async function getRepositoryInfo(): Promise<{
  name: string;
  fullName: string;
  defaultBranch: string;
  htmlUrl: string;
}> {
  validateConfig();

  const response = await fetch(
    `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}`,
    { headers: getHeaders() }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new GitHubAPIError(
      error.message || 'Failed to get repository info',
      response.status,
      error
    );
  }

  const data = await response.json();
  return {
    name: data.name,
    fullName: data.full_name,
    defaultBranch: data.default_branch,
    htmlUrl: data.html_url,
  };
}

// Check if token has write access
export async function checkWriteAccess(): Promise<boolean> {
  try {
    validateConfig();
    
    const response = await fetch(
      `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}`,
      { headers: getHeaders() }
    );

    if (!response.ok) return false;

    const data = await response.json();
    return data.permissions?.push === true || data.permissions?.admin === true;
  } catch {
    return false;
  }
}

// Export config for use in other modules
export const githubConfig = {
  token: GITHUB_TOKEN,
  owner: GITHUB_OWNER,
  repo: GITHUB_REPO,
  branch: GITHUB_BRANCH,
  isConfigured: !!(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO),
};
