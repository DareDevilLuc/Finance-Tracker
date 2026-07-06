# Contributing to Finance Tracker

Thanks for your interest in contributing! This document explains how to get the project set up locally, follow the project's style, and submit contributions.

## Getting Started

1. Fork the repository and clone your fork.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the app at `http://localhost:3000`.

## Branches and Pull Requests

- Create a branch for each change, for example:
  - `feature/add-report-summary`
  - `fix/transaction-validation`
- Keep changes focused and small.
- Open a pull request against the main branch of this repository.
- Describe what changed and why.

## Issue Workflow

- If you find a bug or want a new feature, please open an issue.
- Provide a clear description of the problem or enhancement.
- Include steps to reproduce if you are reporting a bug.

## Code Style and Quality

This project uses Vue 3, TypeScript, and Prettier/ESLint rules.

- Run linting before submitting a PR:

  ```bash
  npm run lint
  ```

- Format changed files with Prettier:

  ```bash
  npm run format
  ```

- Keep code readable and consistent with existing patterns in the repository.
- Prefer Vue single-file components and use the established component structure.

## Testing Your Changes

There is no dedicated test suite in this repository yet, but you should:

- Run the app locally and verify your changes.
- Check any UI behavior manually if you update pages or components.

## Working with Supabase and Env Data

This project uses Supabase in `src/utils/supabase.ts`. Do not commit private keys or credentials.

The main transactions table uses the following columns:

- `id`
- `user_id`
- `amount`
- `date`
- `type`
- `description`

If you need to work with your own Supabase project:

- Create a local environment file if needed.
- Keep secrets out of version control.

## Helpful Tips

- Keep PRs small and easy to review.
- Link PRs to issues when possible.
- Explain user-facing changes clearly.

## Thank You

Your contributions help improve this project and make it more useful for everyone. 😊
