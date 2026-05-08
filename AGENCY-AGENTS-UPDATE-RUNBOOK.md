# Agency Agents Update Runbook

This project uses `agency-agents` as a source of Cursor rules in `.cursor/rules/`.

## Monthly Refresh

1. Pull the latest upstream changes:
   - `cd agency-agents`
   - `git pull`
2. Regenerate Cursor integration:
   - `./scripts/convert.sh --tool cursor`
3. Reinstall rules into this project:
   - `cd /c/Programming/Agents`
   - `./agency-agents/scripts/install.sh --tool cursor --no-interactive`

On Windows, run those commands in Git Bash.

## Local Customizations to Reapply

After reinstall, re-check these project-specific files/settings:

- `.cursor/rules/agency-starter-pack.mdc`
- `.cursor/rules/frontend-developer.mdc` (`globs` scoped to frontend file types)
- `.cursor/rules/backend-architect.mdc` (`globs` scoped to backend/config file types)
- `.cursor/rules/code-reviewer.mdc` (`alwaysApply: true`)
- `.cursor/rules/security-engineer.mdc` (`alwaysApply: true`)

## Regression Smoke Test (3 prompts)

Run these prompts in Cursor and verify behavior:

1. `@frontend-developer review this component for accessibility and rendering issues`
2. `@backend-architect propose an API contract and database changes for this feature`
3. `@security-engineer threat-model this auth flow and list critical/high risks`

Expected result: responses follow the selected specialist persona and produce domain-specific output structure.

## Failure Recovery

If rules look broken after an update:

1. Re-run conversion: `./scripts/convert.sh --tool cursor`
2. Re-run install: `./scripts/install.sh --tool cursor --no-interactive`
3. Reapply the customization block listed above
4. Re-run the 3 smoke prompts
