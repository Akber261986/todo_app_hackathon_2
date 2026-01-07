# Implementation Plan: Todo AI Chatbot with MCP Server Architecture

**Branch**: `001-todo-ai-chatbot` | **Date**: 2026-01-03 | **Spec**: [link to spec.md](spec.md)
**Input**: Feature specification from `/specs/001-todo-ai-chatbot/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement an AI-powered todo management chatbot that uses natural language processing to understand user commands and perform task operations. The system will utilize OpenAI Agents SDK with MCP (Model Context Protocol) server architecture to expose standardized tools for task management operations. The frontend will use OpenAI ChatKit for the conversational interface, while the backend will be built with FastAPI and include a stateless API with conversation persistence in a database.

## Technical Context

**Language/Version**: Python 3.11, JavaScript/TypeScript for frontend
**Primary Dependencies**: FastAPI, OpenAI Agents SDK, Official MCP SDK, OpenAI ChatKit, SQLMds ORM, Better Auth
**Storage**: PostgreSQL database for tasks, conversations, and messages
**Testing**: pytest for backend, Jest for frontend
**Target Platform**: Web application with responsive frontend and Linux server backend
**Project Type**: Web application (frontend + backend + MCP server)
**Performance Goals**: <3 second response time for API requests, 95% success rate for natural language processing
**Constraints**: <200ms p95 response time for database queries, JWT-based authentication, proper user data isolation
**Scale/Scope**: Support 100+ concurrent users, maintain conversation context across multiple interactions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution Compliance Verification:**
- ✅ Skill-Centric Architecture: All functionality will be encapsulated as reusable Claude Code Skills
- ✅ Specification-Driven Development: Following the spec created in previous step
- ✅ Automated Quality Assurance: Will implement automated testing through Code Tester Skill
- ✅ Multi-User Architecture: System will filter data by authenticated user_id with proper isolation
- ✅ JWT Authentication & Authorization: Using Better Auth with JWT tokens for authentication
- ✅ Persistent Data Management: Using PostgreSQL with proper schema for tasks, conversations, and messages
- ✅ Frontend-Backend Separation: Clear separation with OpenAI ChatKit frontend and FastAPI backend
- ✅ MCP Server Architecture: Implementing MCP server with standardized tools for task operations
- ✅ AI-Powered Conversational Interface: Using OpenAI Agents SDK for natural language processing
- ✅ Stateless Server Design: Backend will be stateless, retrieving conversation state from database
- ✅ OpenAI ChatKit Integration: Frontend will use OpenAI ChatKit for conversational interface

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-ai-chatbot/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── task.py
│   │   ├── conversation.py
│   │   └── message.py
│   ├── services/
│   │   ├── task_service.py
│   │   ├── conversation_service.py
│   │   ├── mcp_server.py
│   │   └── ai_agent.py
│   ├── api/
│   │   ├── chat_endpoints.py
│   │   └── auth_endpoints.py
│   └── main.py
└── tests/
    ├── unit/
    ├── integration/
    └── contract/

mcp-server/
├── src/
│   ├── tools/
│   │   ├── add_task.py
│   │   ├── list_tasks.py
│   │   ├── complete_task.py
│   │   ├── delete_task.py
│   │   └── update_task.py
│   └── server.py
└── tests/

frontend/
├── src/
│   ├── components/
│   │   ├── ChatInterface.jsx
│   │   └── TaskList.jsx
│   ├── services/
│   │   └── api_client.js
│   └── pages/
│       └── ChatPage.jsx
└── tests/
    ├── unit/
    └── integration/

contracts/
├── openapi.yaml          # API contract for backend endpoints
└── mcp-contracts/        # MCP tool contracts
    ├── add_task.yaml
    ├── list_tasks.yaml
    ├── complete_task.yaml
    ├── delete_task.yaml
    └── update_task.yaml
```

**Structure Decision**: Web application with separate frontend (using OpenAI ChatKit) and backend (using FastAPI) with an additional MCP server component. This structure aligns with the constitution's requirement for frontend-backend separation while supporting the MCP server architecture needed for AI tool integration.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
