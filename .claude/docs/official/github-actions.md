# Claude Code GitHub Actions

> Learn about integrating Claude Code into your development workflow with Claude Code GitHub Actions

Claude Code GitHub Actions brings AI-powered automation to your GitHub workflow. With a simple `@claude` mention in any PR or issue, Claude can analyze your code, create pull requests, implement features, and fix bugs - all while following your project's standards. For automatic reviews posted on every PR without a trigger, see [GitHub Code Review](/en/code-review).

Claude Code GitHub Actions is built on top of the Claude Agent SDK, which enables programmatic integration of Claude Code into your applications.

**Claude Opus 4.6 is now available.** Claude Code GitHub Actions default to Sonnet. To use Opus 4.6, configure the model parameter to use `claude-opus-4-6`.

## Why use Claude Code GitHub Actions?

* **Instant PR creation**: Describe what you need, and Claude creates a complete PR with all necessary changes
* **Automated code implementation**: Turn issues into working code with a single command
* **Follows your standards**: Claude respects your `CLAUDE.md` guidelines and existing code patterns
* **Simple setup**: Get started in minutes with our installer and API key
* **Secure by default**: Your code stays on Github's runners

## What can Claude do?

Claude Code provides a powerful GitHub Action that transforms how you work with code:

### Claude Code Action

This GitHub Action allows you to run Claude Code within your GitHub Actions workflows. You can use this to build any custom workflow on top of Claude Code.

[View repository →](https://github.com/anthropics/claude-code-action)

## Setup

### Quick setup

The easiest way to set up this action is through Claude Code in the terminal. Just open claude and run `/install-github-app`.

This command will guide you through setting up the GitHub app and required secrets.

Notes:
* You must be a repository admin to install the GitHub app and add secrets
* The GitHub app will request read & write permissions for Contents, Issues, and Pull requests
* This quickstart method is only available for direct Claude API users. If you're using AWS Bedrock or Google Vertex AI, please see the [Using with AWS Bedrock & Google Vertex AI](#using-with-aws-bedrock--google-vertex-ai) section.

### Manual setup

If the `/install-github-app` command fails or you prefer manual setup, please follow these manual setup instructions:

1. **Install the Claude GitHub app** to your repository: [https://github.com/apps/claude](https://github.com/apps/claude)

   The Claude GitHub app requires the following repository permissions:
   * **Contents**: Read & write (to modify repository files)
   * **Issues**: Read & write (to respond to issues)
   * **Pull requests**: Read & write (to create PRs and push changes)

2. **Add ANTHROPIC_API_KEY** to your repository secrets
3. **Copy the workflow file** from [examples/claude.yml](https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml) into your repository's `.github/workflows/`

After completing either the quickstart or manual setup, test the action by tagging `@claude` in an issue or PR comment.

## Upgrading from Beta

**Warning:** Claude Code GitHub Actions v1.0 introduces breaking changes that require updating your workflow files in order to upgrade to v1.0 from the beta version.

If you're currently using the beta version of Claude Code GitHub Actions, we recommend that you update your workflows to use the GA version. The new version simplifies configuration while adding powerful new features like automatic mode detection.

### Essential changes

All beta users must make these changes to their workflow files in order to upgrade:

1. **Update the action version**: Change `@beta` to `@v1`
2. **Remove mode configuration**: Delete `mode: "tag"` or `mode: "agent"` (now auto-detected)
3. **Update prompt inputs**: Replace `direct_prompt` with `prompt`
4. **Move CLI options**: Convert `max_turns`, `model`, `custom_instructions`, etc. to `claude_args`

### Breaking Changes Reference

| Old Beta Input | New v1.0 Input |
|---|---|
| `mode` | *(Removed - auto-detected)* |
| `direct_prompt` | `prompt` |
| `override_prompt` | `prompt` with GitHub variables |
| `custom_instructions` | `claude_args: --append-system-prompt` |
| `max_turns` | `claude_args: --max-turns` |
| `model` | `claude_args: --model` |
| `allowed_tools` | `claude_args: --allowedTools` |
| `disallowed_tools` | `claude_args: --disallowedTools` |
| `claude_env` | `settings` JSON format |

### Before and After Example

**Beta version:**

```yaml
- uses: anthropics/claude-code-action@beta
  with:
    mode: "tag"
    direct_prompt: "Review this PR for security issues"
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    custom_instructions: "Follow our coding standards"
    max_turns: "10"
    model: "claude-sonnet-4-6"
```

**GA version (v1.0):**

```yaml
- uses: anthropics/claude-code-action@v1
  with:
    prompt: "Review this PR for security issues"
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    claude_args: |
      --append-system-prompt "Follow our coding standards"
      --max-turns 10
      --model claude-sonnet-4-6
```

The action now automatically detects whether to run in interactive mode (responds to `@claude` mentions) or automation mode (runs immediately with a prompt) based on your configuration.

## Example use cases

Claude Code GitHub Actions can help you with a variety of tasks. The [examples directory](https://github.com/anthropics/claude-code-action/tree/main/examples) contains ready-to-use workflows for different scenarios.

### Basic workflow

```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          # Responds to @claude mentions in comments
```

### Using skills

```yaml
name: Code Review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Review this pull request for code quality, correctness, and security. Analyze the diff, then post your findings as review comments."
          claude_args: "--max-turns 5"
```

### Custom automation with prompts

```yaml
name: Daily Report
on:
  schedule:
    - cron: "0 9 * * *"
jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Generate a summary of yesterday's commits and open issues"
          claude_args: "--model opus"
```

### Common use cases

In issue or PR comments:

```
@claude implement this feature based on the issue description
@claude how should I implement user authentication for this endpoint?
@claude fix the TypeError in the user dashboard component
```

Claude will automatically analyze the context and respond appropriately.

## Best practices

### CLAUDE.md configuration

Create a `CLAUDE.md` file in your repository root to define code style guidelines, review criteria, project-specific rules, and preferred patterns. This file guides Claude's understanding of your project standards.

### Security considerations

**Never commit API keys directly to your repository.**

For comprehensive security guidance including permissions, authentication, and best practices, see the [Claude Code Action security documentation](https://github.com/anthropics/claude-code-action/blob/main/docs/security.md).

Always use GitHub Secrets for API keys:
* Add your API key as a repository secret named `ANTHROPIC_API_KEY`
* Reference it in workflows: `anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}`
* Limit action permissions to only what's necessary
* Review Claude's suggestions before merging

### Optimizing performance

Use issue templates to provide context, keep your `CLAUDE.md` concise and focused, and configure appropriate timeouts for your workflows.

### CI costs

When using Claude Code GitHub Actions, be aware of the associated costs:

**GitHub Actions costs:**
* Claude Code runs on GitHub-hosted runners, which consume your GitHub Actions minutes
* See [GitHub's billing documentation](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions) for detailed pricing and minute limits

**API costs:**
* Each Claude interaction consumes API tokens based on the length of prompts and responses
* Token usage varies by task complexity and codebase size
* See [Claude's pricing page](https://claude.com/platform/api) for current token rates

**Cost optimization tips:**
* Use specific `@claude` commands to reduce unnecessary API calls
* Configure appropriate `--max-turns` in `claude_args` to prevent excessive iterations
* Set workflow-level timeouts to avoid runaway jobs
* Consider using GitHub's concurrency controls to limit parallel runs

## Configuration examples

The Claude Code Action v1 simplifies configuration with unified parameters:

```yaml
- uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    prompt: "Your instructions here" # Optional
    claude_args: "--max-turns 5" # Optional CLI arguments
```

Key features:
* **Unified prompt interface** - Use `prompt` for all instructions
* **Skills** - Invoke installed skills directly from the prompt
* **CLI passthrough** - Any Claude Code CLI argument via `claude_args`
* **Flexible triggers** - Works with any GitHub event

Visit the [examples directory](https://github.com/anthropics/claude-code-action/tree/main/examples) for complete workflow files.

When responding to issue or PR comments, Claude automatically responds to @claude mentions. For other events, use the `prompt` parameter to provide instructions.

## Using with AWS Bedrock & Google Vertex AI

For enterprise environments, you can use Claude Code GitHub Actions with your own cloud infrastructure. This approach gives you control over data residency and billing while maintaining the same functionality.

### Prerequisites

#### For Google Cloud Vertex AI:

1. A Google Cloud Project with Vertex AI enabled
2. Workload Identity Federation configured for GitHub Actions
3. A service account with the required permissions
4. A GitHub App (recommended) or use the default GITHUB_TOKEN

#### For AWS Bedrock:

1. An AWS account with Amazon Bedrock enabled
2. GitHub OIDC Identity Provider configured in AWS
3. An IAM role with Bedrock permissions
4. A GitHub App (recommended) or use the default GITHUB_TOKEN

### Step 1: Create a custom GitHub App (Recommended for 3P Providers)

For best control and security when using 3P providers like Vertex AI or Bedrock, we recommend creating your own GitHub App:

1. Go to [https://github.com/settings/apps/new](https://github.com/settings/apps/new)
2. Fill in the basic information (name, homepage URL)
3. Configure app settings: uncheck "Active" webhooks (not needed)
4. Set required permissions: Contents, Issues, Pull requests — all Read & Write
5. Click "Create GitHub App"
6. After creation, click "Generate a private key" and save the `.pem` file
7. Note your App ID from the app settings page
8. Install the app to your repository
9. Add the private key as a secret named `APP_PRIVATE_KEY`
10. Add the App ID as a secret named `APP_ID`

**Alternative**: Install the official Anthropic app from [https://github.com/apps/claude](https://github.com/apps/claude).

### Step 2: Configure cloud provider authentication

**AWS Bedrock:**

1. Enable Amazon Bedrock and request access to Claude models
2. Set up GitHub OIDC Identity Provider in AWS (URL: `https://token.actions.githubusercontent.com`, Audience: `sts.amazonaws.com`)
3. Create IAM Role for GitHub Actions with `AmazonBedrockFullAccess` policy
4. **Required value**: `AWS_ROLE_TO_ASSUME` — ARN of the IAM role

**Google Vertex AI:**

1. Enable IAM Credentials API, STS API, and Vertex AI API
2. Create a Workload Identity Pool with a GitHub OIDC provider (issuer: `https://token.actions.githubusercontent.com`)
3. Create a Service Account with only `Vertex AI User` role
4. Configure IAM bindings to allow Workload Identity Pool to impersonate the service account
5. **Required values**: `GCP_WORKLOAD_IDENTITY_PROVIDER` and `GCP_SERVICE_ACCOUNT`

### Step 3: Add Required Secrets

**For Claude API (Direct):**
* `ANTHROPIC_API_KEY`: Your Claude API key
* `APP_ID` and `APP_PRIVATE_KEY`: If using your own GitHub App

**For Google Cloud Vertex AI:**
* `GCP_WORKLOAD_IDENTITY_PROVIDER`
* `GCP_SERVICE_ACCOUNT`
* `APP_ID` and `APP_PRIVATE_KEY`: If using your own GitHub App

**For AWS Bedrock:**
* `AWS_ROLE_TO_ASSUME`
* `APP_ID` and `APP_PRIVATE_KEY`: If using your own GitHub App

### Step 4: Create workflow files

**AWS Bedrock workflow:**

```yaml
name: Claude PR Action

permissions:
  contents: write
  pull-requests: write
  issues: write
  id-token: write

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]

jobs:
  claude-pr:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'issues' && contains(github.event.issue.body, '@claude'))
    runs-on: ubuntu-latest
    env:
      AWS_REGION: us-west-2
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Generate GitHub App token
        id: app-token
        uses: actions/create-github-app-token@v2
        with:
          app-id: ${{ secrets.APP_ID }}
          private-key: ${{ secrets.APP_PRIVATE_KEY }}

      - name: Configure AWS Credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_TO_ASSUME }}
          aws-region: us-west-2

      - uses: anthropics/claude-code-action@v1
        with:
          github_token: ${{ steps.app-token.outputs.token }}
          use_bedrock: "true"
          claude_args: '--model us.anthropic.claude-sonnet-4-6 --max-turns 10'
```

The model ID format for Bedrock includes a region prefix (for example, `us.anthropic.claude-sonnet-4-6`).

**Google Vertex AI workflow:**

```yaml
name: Claude PR Action

permissions:
  contents: write
  pull-requests: write
  issues: write
  id-token: write

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]

jobs:
  claude-pr:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'issues' && contains(github.event.issue.body, '@claude'))
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Generate GitHub App token
        id: app-token
        uses: actions/create-github-app-token@v2
        with:
          app-id: ${{ secrets.APP_ID }}
          private-key: ${{ secrets.APP_PRIVATE_KEY }}

      - name: Authenticate to Google Cloud
        id: auth
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}

      - uses: anthropics/claude-code-action@v1
        with:
          github_token: ${{ steps.app-token.outputs.token }}
          trigger_phrase: "@claude"
          use_vertex: "true"
          claude_args: '--model claude-sonnet-4-5@20250929 --max-turns 10'
        env:
          ANTHROPIC_VERTEX_PROJECT_ID: ${{ steps.auth.outputs.project_id }}
          CLOUD_ML_REGION: us-east5
          VERTEX_REGION_CLAUDE_4_5_SONNET: us-east5
```

The project ID is automatically retrieved from the Google Cloud authentication step, so you don't need to hardcode it.

## Troubleshooting

### Claude not responding to @claude commands

Verify the GitHub App is installed correctly, check that workflows are enabled, ensure API key is set in repository secrets, and confirm the comment contains `@claude` (not `/claude`).

### CI not running on Claude's commits

Ensure you're using the GitHub App or custom app (not Actions user), check workflow triggers include the necessary events, and verify app permissions include CI triggers.

### Authentication errors

Confirm API key is valid and has sufficient permissions. For Bedrock/Vertex, check credentials configuration and ensure secrets are named correctly in workflows.

## Advanced configuration

### Action parameters

| Parameter | Description | Required |
|---|---|---|
| `prompt` | Instructions for Claude (plain text or a skill name) | No* |
| `claude_args` | CLI arguments passed to Claude Code | No |
| `anthropic_api_key` | Claude API key | Yes** |
| `github_token` | GitHub token for API access | No |
| `trigger_phrase` | Custom trigger phrase (default: "@claude") | No |
| `use_bedrock` | Use AWS Bedrock instead of Claude API | No |
| `use_vertex` | Use Google Vertex AI instead of Claude API | No |

*Prompt is optional - when omitted for issue/PR comments, Claude responds to trigger phrase
**Required for direct Claude API, not for Bedrock/Vertex

### Pass CLI arguments

The `claude_args` parameter accepts any Claude Code CLI arguments:

```yaml
claude_args: "--max-turns 5 --model claude-sonnet-4-6 --mcp-config /path/to/config.json"
```

Common arguments:
* `--max-turns`: Maximum conversation turns (default: 10)
* `--model`: Model to use (for example, `claude-sonnet-4-6`)
* `--mcp-config`: Path to MCP configuration
* `--allowedTools`: Comma-separated list of allowed tools
* `--debug`: Enable debug output

### Customizing Claude's behavior

You can configure Claude's behavior in two ways:

1. **CLAUDE.md**: Define coding standards, review criteria, and project-specific rules in a `CLAUDE.md` file at the root of your repository.
2. **Custom prompts**: Use the `prompt` parameter in the workflow file to provide workflow-specific instructions.

Claude will follow these guidelines when creating PRs and responding to requests.
> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.
