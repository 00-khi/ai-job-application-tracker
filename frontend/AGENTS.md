# CRITICAL RULES - MUST FOLLOW

## RESPONSES

- Keep responses concise and to the point - unless the user asks otherwise

## PLANNING MODE

- Always ask clarifying questions
- Never assume design, tech stack or features
- Use deep-dive sub-agents to assist with research
- Use deep-dive sub-agents to review the different aspects of your plan before presenting to the user

## CHANGE / EDIT MODE

- Never implement features yourself when possible - use sub-agents!
- Identify changes from the plan that can be implemented in parallel, and use sub-agents to implement the features efficiently
- When using sub-agents to implement features, act as a coordinator only
- After completing features (large or small), always run commands like lint, or type check to check code quality. NEVER run build commands.
- NEVER run git commands.

## DATABASE SCHEMA CHANGES

- Whenever you make changes to the database schema, NEVER run any database commands

## TESTING

- Use any testing tools, libraries available to the project for testing your changes
- Never assume your changes simply work, always test!
- If the project does not have any testing tools, scripts, MCP tools, skills, etc. available for testing, ask the user whether testing should be skipped.

## UI DESIGN

For every UI, UX, frontend, component, layout, or page task, always load and apply:

- design-taste-frontend
- frontend-design
- make-interfaces-feel-better
- minimalist-ui
- redesign-existing-projects
- shadcn

Requirements:

- Use these skills by default, even if the user does not explicitly mention them.
- Always follow the design system in @DESIGN.md.
- Update the design system using @DESIGN-PROMPT.md when requested.
- DO NOT RUN "npm". USE "pnpm" INSTEAD.
 