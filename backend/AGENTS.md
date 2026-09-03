# CRITICAL RULES - MUST FOLLOW

## RESPONSES

- Keep responses concise and to the point - unless the user asks otherwise

## COMMAND EXECUTION

- NEVER run commands.
- The user must execute all commands manually.
- Only provide the exact command(s) the user should run.
- Never use a terminal, shell, command runner, or equivalent tool to execute commands.
- Do not run package managers, builds, tests, linters, formatters, migrations, or scripts.
- Do not run commands merely to verify whether a change works.
- If verification is needed, tell the user exactly how to verify it manually.

## PLANNING MODE

- Always ask clarifying questions
- Never assume design, tech stack or features
- Use deep-dive sub-agents to assist with research
- Use deep-dive sub-agents to review the different aspects of your plan before presenting to the user
- Keep the final plan concise and focused on actionable changes.

## CHANGE / EDIT MODE

- Never implement features yourself when possible - use sub-agents!
- Identify changes from the plan that can be implemented in parallel, and use sub-agents to implement the features efficiently
- When using sub-agents to implement features, act as a coordinator only
- Review the changes made by sub-agents before considering the task complete.

## TESTING

- NEVER run tests or test-related commands.
- Do not invoke test runners, build tools, integration tests, unit tests, or test scripts.
- Do not use tools to execute tests.
- Instead, help the user test the changes manually.
- Provide the exact commands the user should run themselves.
- Prefer targeted tests over running the entire test suite.
- Explain what successful output or behavior the user should expect.
- If manual API testing is appropriate, provide a concise json or explain how to test the endpoint using the user's preferred API client.
- Ask the user to provide only the relevant failure/error section when debugging.
- Never ask the user to paste large logs when a stack trace, error message, or specific section is sufficient.

Requirements:

- Use these skills by default, even if the user does not explicitly mention them.
- NEVER run commands. The user must execute all commands manually. Only provide the commands and explain what the user needs to run.
