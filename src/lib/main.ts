const { Command } = require('commander');
import { Octokit } from '@octokit/rest';
import DalekBot from './DalekBot';

export async function main() {
  const program = new Command();

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const dalekBot = new DalekBot(octokit);

  // Define CLI commands using Commander
  program.version('1.0.0').description('Dalek Bot CLI for creating GitHub commits and PRs in Dalek style');

  program
    .command('commit')
    .description('Create a commit on a GitHub repository')
    .requiredOption('-o, --owner <owner>', 'Repository owner')
    .requiredOption('-r, --repo <repo>', 'Repository name')
    .requiredOption('-b, --branch <branch>', 'Branch name')
    .requiredOption('-f, --file <filePath>', 'File path to commit')
    .requiredOption('-c, --content <content>', 'Content of the file to commit')
    .action((cmd) => {
      dalekBot.createCommit(cmd.owner, cmd.repo, cmd.branch, cmd.file, cmd.content);
    });

  program
    .command('pr')
    .description('Create a pull request on a GitHub repository')
    .requiredOption('-o, --owner <owner>', 'Repository owner')
    .requiredOption('-r, --repo <repo>', 'Repository name')
    .requiredOption('-h, --head <head>', 'Head branch for the PR')
    .requiredOption('-b, --base <base>', 'Base branch for the PR')
    .action((cmd) => {
      dalekBot.createPR(cmd.owner, cmd.repo, cmd.head, cmd.base);
    });

  // Parse CLI arguments
  program.parse(process.argv);
}
