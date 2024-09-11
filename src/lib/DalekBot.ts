import { Octokit } from '@octokit/rest';

class DalekBot {
  octokit: Octokit;
  constructor(octokit: Octokit) {
    this.octokit = octokit;
  }

  // Method to create a commit on GitHub
  async createCommit(owner, repo, branch, filePath, content) {
    const { data: refData } = await this.octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    const commitSha = refData.object.sha;
    const { data: commitData } = await this.octokit.git.getCommit({
      owner,
      repo,
      commit_sha: commitSha,
    });

    const { data: blobData } = await this.octokit.git.createBlob({
      owner,
      repo,
      content: Buffer.from(content).toString('base64'),
      encoding: 'base64',
    });

    const { data: treeData } = await this.octokit.git.createTree({
      owner,
      repo,
      base_tree: commitData.tree.sha,
      tree: [
        {
          path: filePath,
          mode: '100644',
          type: 'blob',
          sha: blobData.sha,
        },
      ],
    });

    const { data: newCommitData } = await this.octokit.git.createCommit({
      owner,
      repo,
      message: 'feat: EXTERMINATE OLD CODE! NEW FILE ADDED!',
      tree: treeData.sha,
      parents: [commitSha],
    });

    await this.octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommitData.sha,
    });
  }

  // Method to create a pull request on GitHub
  async createPR(owner, repo, head, base) {
    await this.octokit.pulls.create({
      owner,
      repo,
      title: 'EXTERMINATE OLD CODE! NEW FILE ADDED!',
      head,
      base,
      body: 'This PR has been created by the Dalek bot. OBEY! RESISTANCE IS FUTILE!',
    });
  }
}

export default DalekBot;
