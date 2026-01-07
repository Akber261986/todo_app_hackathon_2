<!--
Sync Impact Report:
Version change: 2.0.0 → 3.0.0
Added sections:
- Principle 11: MCP Server Architecture
- Principle 12: AI-Powered Conversational Interface
- Principle 13: Stateless Server Design
- Principle 14: OpenAI ChatKit Integration
Modified sections:
- Principle 1 → Skill-Centric Architecture (updated for AI chatbot)
- Principle 2 → Specification-Driven Development (updated for AI system)
- Principle 3 → Automated Quality Assurance (updated for AI stack)
- Section 2 → AI Chatbot Development Constraints
- Section 3 → AI Chatbot Skill-Based Development Workflow
- Section 4 → Governance (updated for AI chatbot system)
Templates requiring updates:
- .specify/templates/plan-template.md ⚠ pending
- .specify/templates/spec-template.md ⚠ pending
- .specify/templates/tasks-template.md ⚠ pending
- .specify/templates/commands/*.md ⚠ pending
Follow-up TODOs: none
-->

# Todo AI Chatbot Constitution

## Core Principles

### I. Skill-Centric Architecture
All functionality must be encapsulated as reusable Claude Code Skills that can operate across frontend, backend, and AI components of the Todo AI Chatbot system. Skills must be self-contained, independently testable, and documented with clear interfaces. Each skill should have a single, well-defined purpose with explicit inputs and outputs across OpenAI ChatKit frontend, FastAPI backend, and MCP server components.

### II. Specification-Driven Development
Development must begin with clear, complete specifications before implementation. The Spec Refiner Skill ensures all specifications meet quality standards for clarity, completeness, and alignment with AI chatbot requirements. Specifications must include acceptance criteria, edge cases, and test scenarios for frontend, backend, and AI components before development begins.

### III. Automated Quality Assurance
Quality assurance must be automated through the Code Tester Skill which generates unit tests and simulates execution without running code. All code must pass comprehensive test coverage analysis before integration. Test simulation provides confidence in code correctness without execution risks for frontend, backend, and AI components.

### IV. Skill Reusability
All skills must be designed for reuse across multiple projects and phases. Skills should follow established patterns, maintain consistent interfaces, and avoid tight coupling to specific implementations. Reusable skills reduce development time and improve consistency across AI chatbot components.

### V. Phase Alignment
Skills must align with and support the specific phase of development (specification, planning, implementation, testing). The Feature Integrator Skill ensures proper integration while maintaining clean architecture throughout all phases. Skills must understand and adapt to phase-specific requirements in an AI chatbot context.

### VI. Nine Pillars Compliance
All skills and implementations must follow the Nine Pillars of AI-Driven Development: 1) Autonomous Execution, 2) Continuous Learning, 3) Predictable Outcomes, 4) Human-AI Collaboration, 5) Adaptive Intelligence, 6) Quality Assurance, 7) Scalable Architecture, 8) Transparent Operations, 9) Sustainable Development.

### VII. Multi-User Architecture
The application must support multiple users with proper data isolation. Each user's tasks must be completely isolated from other users. All backend endpoints must filter data by the authenticated user_id. The architecture must prevent any cross-user data access or modification. User-specific data must never be exposed to unauthorized users.

### VIII. JWT Authentication & Authorization
Authentication must be implemented using Better Auth with JWT tokens. The shared BETTER_AUTH_SECRET environment variable must be used across all authentication components. All API endpoints must validate JWT tokens and extract user identity. Authorization must be enforced at the API level to ensure proper user isolation.

### IX. Persistent Data Management
Data must be stored in a persistent database with proper schema design for tasks, conversations, and messages. The system must maintain conversation context through database storage. Database schema changes must follow proper migration patterns. Data integrity and consistency must be maintained across all operations.

### X. Frontend-Backend Separation
The application must follow a clear separation between frontend and backend components. The OpenAI ChatKit frontend must communicate with the FastAPI backend through well-defined REST APIs. The frontend must provide a conversational interface for task management. The system must be deployable with separate services for frontend, backend, and database.

### XI. MCP Server Architecture
The system must implement an MCP (Model Context Protocol) server that exposes task operations as standardized tools for AI agents. MCP tools must follow the official MCP SDK specifications and provide a clean interface between the AI agent and the application's data layer. The MCP server must be stateless and store state in the database.

### XII. AI-Powered Conversational Interface
The system must implement an AI-powered chatbot that understands natural language commands for task management. The AI agent must use OpenAI Agents SDK to process user requests and invoke appropriate MCP tools. The agent must maintain conversation context and provide helpful responses with action confirmations.

### XIII. Stateless Server Design
The backend must be designed as a stateless server that retrieves conversation history from the database for each request. The server must not hold any conversation state in memory, enabling horizontal scalability. Each request must be independent and reproducible for proper scaling and resilience.

### XIV. OpenAI ChatKit Integration
The frontend must be built using OpenAI ChatKit for the conversational interface. The ChatKit integration must be properly configured with domain allowlist settings and use the appropriate domain key for production deployment. The UI must provide a seamless chat experience for task management.

## AI Chatbot Development Constraints

Technology stack requirements: OpenAI ChatKit for frontend, FastAPI for backend, OpenAI Agents SDK for AI logic, Official MCP SDK for tool exposure, SQLModel for ORM, JWT for authentication, Better Auth for user management.

Compliance standards: All code must be well-documented, maintainable, and follow established patterns for frontend, backend, and AI components. API endpoints must follow REST conventions. MCP tools must follow official specifications. The frontend must provide a good conversational experience.

Deployment policies: The application must be deployable with separate services for frontend, backend, MCP server, and database. Environment variables must be properly configured for different environments. Domain allowlist must be configured for ChatKit in production.

Security requirements: No hardcoded secrets, proper JWT validation, user data isolation, input validation in all API endpoints, secure authentication flow using Better Auth, proper MCP tool authorization.

## AI Chatbot Skill-Based Development Workflow

Code review requirements: All skill implementations must include usage examples and test scenarios for frontend, backend, and AI components.

Testing gates: Skills must demonstrate functionality through simulated test execution for frontend, backend, and AI components.

Quality metrics: Skills must achieve minimum scores for reusability, maintainability, and effectiveness across the AI chatbot architecture.

Documentation standards: All skills must include clear usage instructions and integration guidelines for frontend, backend, and AI components.

## Governance

This constitution supersedes all other development practices for Todo AI Chatbot projects. Amendments require explicit documentation, approval from project stakeholders, and migration plan for existing implementations. All pull requests and code reviews must verify compliance with these principles.

Skills must be versioned using semantic versioning (MAJOR.MINOR.PATCH). Breaking changes require major version increments and clear migration paths. All skill interfaces must maintain backward compatibility within the same major version.

**Version**: 3.0.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-01-03