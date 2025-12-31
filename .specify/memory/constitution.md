<!--
Sync Impact Report:
Version change: 1.1.0 → 2.0.0
Added sections:
- Principle 7: Multi-User Architecture
- Principle 8: JWT Authentication & Authorization
- Principle 9: Persistent Data Management
- Principle 10: Frontend-Backend Separation
Modified sections:
- Principle 1 → Skill-Centric Architecture (updated for full-stack)
- Principle 2 → Specification-Driven Development (updated for web app)
- Principle 3 → Automated Quality Assurance (updated for web stack)
- Section 2 → Full-Stack Web App Development Constraints
- Section 3 → Full-Stack Skill-Based Development Workflow
- Section 4 → Governance (updated for multi-user app)
Templates requiring updates:
- .specify/templates/plan-template.md ⚠ pending
- .specify/templates/spec-template.md ⚠ pending
- .specify/templates/tasks-template.md ⚠ pending
- .specify/templates/commands/*.md ⚠ pending
Follow-up TODOs: none
-->

# Todo App Full-Stack Web Constitution

## Core Principles

### I. Skill-Centric Architecture
All functionality must be encapsulated as reusable Claude Code Skills that can operate across both frontend and backend components of the full-stack application. Skills must be self-contained, independently testable, and documented with clear interfaces. Each skill should have a single, well-defined purpose with explicit inputs and outputs across both Next.js frontend and FastAPI backend.

### II. Specification-Driven Development
Development must begin with clear, complete specifications before implementation. The Spec Refiner Skill ensures all specifications meet quality standards for clarity, completeness, and alignment with full-stack requirements. Specifications must include acceptance criteria, edge cases, and test scenarios for both frontend and backend components before development begins.

### III. Automated Quality Assurance
Quality assurance must be automated through the Code Tester Skill which generates unit tests and simulates execution without running code. All code must pass comprehensive test coverage analysis before integration. Test simulation provides confidence in code correctness without execution risks for both frontend and backend components.

### IV. Skill Reusability
All skills must be designed for reuse across multiple projects and phases. Skills should follow established patterns, maintain consistent interfaces, and avoid tight coupling to specific implementations. Reusable skills reduce development time and improve consistency across full-stack components.

### V. Phase Alignment
Skills must align with and support the specific phase of development (specification, planning, implementation, testing). The Feature Integrator Skill ensures proper integration while maintaining clean architecture throughout all phases. Skills must understand and adapt to phase-specific requirements in a full-stack context.

### VI. Nine Pillars Compliance
All skills and implementations must follow the Nine Pillars of AI-Driven Development: 1) Autonomous Execution, 2) Continuous Learning, 3) Predictable Outcomes, 4) Human-AI Collaboration, 5) Adaptive Intelligence, 6) Quality Assurance, 7) Scalable Architecture, 8) Transparent Operations, 9) Sustainable Development.

### VII. Multi-User Architecture
The application must support multiple users with proper data isolation. Each user's tasks must be completely isolated from other users. All backend endpoints must filter data by the authenticated user_id. The architecture must prevent any cross-user data access or modification. User-specific data must never be exposed to unauthorized users.

### VIII. JWT Authentication & Authorization
Authentication must be implemented using Better Auth with JWT tokens. The shared BETTER_AUTH_SECRET environment variable must be used across all authentication components. All API endpoints must validate JWT tokens and extract user identity. Authorization must be enforced at the API level to ensure proper user isolation.

### IX. Persistent Data Management
Data must be stored in a persistent Neon database with proper schema design. The migration from in-memory storage to persistent storage must be handled carefully. Database schema changes must follow proper migration patterns. Data integrity and consistency must be maintained across all operations.

### X. Frontend-Backend Separation
The application must follow a clear separation between frontend and backend components. The Next.js frontend (in /frontend/) must communicate with the FastAPI backend (in /backend/) through well-defined REST APIs. The frontend must be responsive and provide a good user experience. Docker Compose must be used for containerized deployment of both components.

## Full-Stack Web App Development Constraints

Technology stack requirements: Next.js with App Router for frontend, FastAPI for backend, Neon DB for persistent storage, Docker Compose for deployment, JWT for authentication, Better Auth for user management.

Compliance standards: All code must be well-documented, maintainable, and follow established patterns for both frontend and backend. API endpoints must follow REST conventions. Frontend must be responsive and accessible.

Deployment policies: The application must be deployable via Docker Compose with separate services for frontend, backend, and database. Environment variables must be properly configured for different environments.

Security requirements: No hardcoded secrets, proper JWT validation, user data isolation, input validation in all API endpoints, secure authentication flow using Better Auth.

## Full-Stack Skill-Based Development Workflow

Code review requirements: All skill implementations must include usage examples and test scenarios for both frontend and backend components.

Testing gates: Skills must demonstrate functionality through simulated test execution for both frontend and backend components.

Quality metrics: Skills must achieve minimum scores for reusability, maintainability, and effectiveness across the full-stack architecture.

Documentation standards: All skills must include clear usage instructions and integration guidelines for both frontend and backend components.

## Governance

This constitution supersedes all other development practices for Todo app projects. Amendments require explicit documentation, approval from project stakeholders, and migration plan for existing implementations. All pull requests and code reviews must verify compliance with these principles.

Skills must be versioned using semantic versioning (MAJOR.MINOR.PATCH). Breaking changes require major version increments and clear migration paths. All skill interfaces must maintain backward compatibility within the same major version.

**Version**: 2.0.0 | **Ratified**: 2025-12-29 | **Last Amended**: 2025-12-29