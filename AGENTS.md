DO NOT OPEN, READ, OR MODIFY ANY FILES IN /notes/ FOLDER.

# RISK LEVELS

## Risk Assessment

| Level      | Description                                    | Examples                                                      |
| ---------- | ---------------------------------------------- | ------------------------------------------------------------- |
| **LOW**    | Minimal impact, easily reversible              | Text updates, config tweaks, UI styling                       |
| **MEDIUM** | Moderate impact, may affect functionality      | New features, component additions, API changes                |
| **HIGH**   | Significant impact, potential breaking changes | Database schema, security changes, architecture modifications |

## Requirements by Risk Level

### LOW Risk

- Proceed with implementation
- No special approval needed

### MEDIUM Risk

- Ask clarifying questions first
- Confirm approach with user before implementing
- Run lint/typecheck after changes

### HIGH Risk

- **STOP** - Do not implement without explicit user approval
- Present detailed plan with trade-offs
- Identify rollback strategy
- Wait for user confirmation before proceeding

## Backend & Frontend

Refer to specific guidelines:

- `frontend/AGENTS.md` - Frontend-specific rules
- `backend/AGENTS.md` - Backend-specific rules
