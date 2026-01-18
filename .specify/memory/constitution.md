<!--
Sync Impact Report:
Version change: 3.0.0 → 4.0.0
Added sections:
- Principle 15: Containerization Standards (Docker)
- Principle 16: Kubernetes Deployment Architecture
- Principle 17: Helm Chart Packaging
- Principle 18: Local K8s Development (Minikube)
- Principle 19: AI-Assisted Operations (kubectl-ai/kagent)
- Principle 20: Infrastructure as Code Governance
Modified sections:
- Section 2 → K8s Deployment Development Constraints
- Section 3 → K8s Deployment Skill-Based Development Workflow
- Section 4 → Governance (updated for K8s deployment system)
Templates requiring updates:
- .specify/templates/plan-template.md ⚠ pending
- .specify/templates/spec-template.md ⚠ pending
- .specify/templates/tasks-template.md ⚠ pending
- .specify/templates/commands/*.md ⚠ pending
Follow-up TODOs: none
-->

# Todo AI Chatbot Constitution for K8s Deployment

## Core Principles

### I. Skill-Centric Architecture
All functionality must be encapsulated as reusable Claude Code Skills that can operate across frontend, backend, and AI components of the Todo AI Chatbot system. Skills must be self-contained, independently testable, and documented with clear interfaces. Each skill should have a single, well-defined purpose with explicit inputs and outputs across OpenAI ChatKit frontend, FastAPI backend, and MCP server components deployed in Kubernetes environment.

### II. Specification-Driven Development
Development must begin with clear, complete specifications before implementation. The Spec Refiner Skill ensures all specifications meet quality standards for clarity, completeness, and alignment with AI chatbot requirements. Specifications must include acceptance criteria, edge cases, and test scenarios for frontend, backend, AI components, and Kubernetes deployments before development begins.

### III. Automated Quality Assurance
Quality assurance must be automated through the Code Tester Skill which generates unit tests and simulates execution without running code. All code must pass comprehensive test coverage analysis before integration. Test simulation provides confidence in code correctness without execution risks for frontend, backend, AI, and infrastructure components. Infrastructure changes must pass automated validation before deployment to Kubernetes clusters.

### IV. Skill Reusability
All skills must be designed for reuse across multiple projects and phases. Skills should follow established patterns, maintain consistent interfaces, and avoid tight coupling to specific implementations. Reusable skills reduce development time and improve consistency across AI chatbot components. Kubernetes deployment skills must be reusable across different environments and cloud providers.

### V. Phase Alignment
Skills must align with and support the specific phase of development (specification, planning, implementation, testing, deployment). The Feature Integrator Skill ensures proper integration while maintaining clean architecture throughout all phases including Kubernetes deployment. Skills must understand and adapt to phase-specific requirements in an AI chatbot context with containerized deployments.

### VI. Nine Pillars Compliance
All skills and implementations must follow the Nine Pillars of AI-Driven Development: 1) Autonomous Execution, 2) Continuous Learning, 3) Predictable Outcomes, 4) Human-AI Collaboration, 5) Adaptive Intelligence, 6) Quality Assurance, 7) Scalable Architecture, 8) Transparent Operations, 9) Sustainable Development. These pillars extend to infrastructure and deployment practices with Kubernetes enabling scalable architecture and transparent operations through declarative configuration.

### VII. Multi-User Architecture
The application must support multiple users with proper data isolation. Each user's tasks must be completely isolated from other users. All backend endpoints must filter data by the authenticated user_id. The architecture must prevent any cross-user data access or modification. User-specific data must never be exposed to unauthorized users. Deployment architecture must maintain these isolation principles through Kubernetes namespaces and RBAC configurations when applicable.

### VIII. JWT Authentication & Authorization
Authentication must be implemented using Better Auth with JWT tokens. The shared BETTER_AUTH_SECRET environment variable must be used across all authentication components. All API endpoints must validate JWT tokens and extract user identity. Authorization must be enforced at the API level to ensure proper user isolation. Secrets management in Kubernetes must follow best practices using Kubernetes secrets or external secret stores for JWT secrets and other sensitive data.

### IX. Persistent Data Management
Data must be stored in a persistent database with proper schema design for tasks, conversations, and messages. The system must maintain conversation context through database storage. Database schema changes must follow proper migration patterns. Data integrity and consistency must be maintained across all operations. Persistence in Kubernetes must use persistent volumes and claims to ensure data durability across pod restarts and scaling events.

### X. Frontend-Backend Separation
The application must follow a clear separation between frontend and backend components. The OpenAI ChatKit frontend must communicate with the FastAPI backend through well-defined REST APIs. The frontend must provide a conversational interface for task management. The system must be deployable with separate services for frontend, backend, and database using Kubernetes deployments, services, and ingress resources for networking and load balancing across components.

### XI. MCP Server Architecture
The system must implement an MCP (Model Context Protocol) server that exposes task operations as standardized tools for AI agents. MCP tools must follow the official MCP SDK specifications and provide a clean interface between the AI agent and the application's data layer. The MCP server must be stateless and store state in the database. Kubernetes deployments must maintain statelessness of the MCP server for horizontal scaling capabilities and resiliency across pods.

### XII. AI-Powered Conversational Interface
The system must implement an AI-powered chatbot that understands natural language commands for task management. The AI agent must use OpenAI Agents SDK to process user requests and invoke appropriate MCP tools. The agent must maintain conversation context and provide helpful responses with action confirmations. Kubernetes deployments must ensure availability and scaling of AI interface components to handle varying loads and maintain conversational responsiveness during peak usage periods.

### XIII. Stateless Server Design
The backend must be designed as a stateless server that retrieves conversation history from the database for each request. The server must not hold any conversation state in memory, enabling horizontal scalability. Each request must be independent and reproducible for proper scaling and resilience. Kubernetes deployments must be architected to leverage this stateless design for horizontal pod autoscaling and reliable scaling operations across all backend services without losing conversation state or functionality.

### XIV. OpenAI ChatKit Integration
The frontend must be built using OpenAI ChatKit for the conversational interface. The ChatKit integration must be properly configured with domain allowlist settings and use the appropriate domain key for production deployment. The UI must provide a seamless chat experience for task management. Kubernetes ingress configurations must properly handle CORS and domain allowlist requirements for secure OpenAI ChatKit integration in production environments.

### XV. Containerization Standards (Docker)
All application components must be packaged in containers using Docker. Dockerfiles must follow security best practices, use minimal base images, implement multi-stage builds to reduce attack surface, and avoid running containers as root. Container images must be scanned for vulnerabilities before deployment. No manual Dockerfile modifications allowed - use Gordon (if available) or standard Docker patterns for consistent, secure, and maintainable containerization across all services (frontend, backend, database, MCP server).

### XVI. Kubernetes Deployment Architecture
Application deployments must follow Kubernetes best practices with proper separation of concerns using Deployments for stateless services, StatefulSets for stateful applications, Services for network connectivity, ConfigMaps for configuration, and Secrets for sensitive data. Pod resource limits and requests must be defined for proper resource allocation and cluster stability. Health checks (liveness and readiness probes) must be implemented for all services to ensure reliable operation and automatic recovery from failures in the Kubernetes environment.

### XVII. Helm Chart Packaging
All Kubernetes manifests must be packaged as Helm charts for consistent, versioned, and configurable deployments across different environments. Helm charts must follow semantic versioning, include proper templates with parameterization, and contain values files for different deployment environments (dev, staging, prod). No manual Kubernetes manifest creation allowed - use Helm templating for repeatable and maintainable infrastructure-as-code. Chart testing must be performed before deployment to ensure proper functionality across different configurations and environments.

### XVIII. Local K8s Development (Minikube)
Local development must be supported using Minikube for Kubernetes-based testing and development. Developers must be able to spin up complete application stacks locally with the same Kubernetes manifests used in production for consistent behavior and reduced environment drift. Minikube configurations must mirror production Kubernetes settings as closely as possible while accommodating local resource constraints. Development workflows must include proper local K8s testing before pushing to higher environments to catch deployment issues early in the development cycle.

### XIX. AI-Assisted Operations (kubectl-ai/kagent)
Kubernetes operations must leverage AI-powered tools such as kubectl-ai or kagent for intelligent cluster management, troubleshooting, and monitoring. Operations teams must use AI-assisted kubectl plugins for complex operations, resource debugging, and performance optimization in Kubernetes clusters. AI-assisted operations should enhance human capabilities rather than replace them, with proper oversight and validation of AI-generated commands before execution in production environments. This principle supports rapid problem resolution and intelligent cluster insights through natural language interaction with Kubernetes resources and monitoring systems.

### XX. Infrastructure as Code Governance
All infrastructure definitions must be maintained as code in version control with proper peer review processes. Changes to Kubernetes manifests, Helm charts, or infrastructure configurations must follow the same code review and testing practices as application code. Infrastructure changes must be applied through automated CI/CD pipelines rather than manual intervention to ensure consistency, auditability, and reduced risk of configuration drift. Immutable infrastructure patterns must be followed where possible, with infrastructure changes implemented through new deployments rather than in-place modifications to existing resources.

## K8s Deployment Development Constraints

Technology stack requirements: OpenAI ChatKit for frontend, FastAPI for backend, OpenAI Agents SDK for AI logic, Official MCP SDK for tool exposure, SQLModel for ORM, JWT for authentication, Better Auth for user management, Docker for containerization, Kubernetes for orchestration, Helm for package management, kubectl-ai/kagent for AI-assisted operations, Minikube for local development, PostgreSQL for persistent data in production K8s deployments with persistent volumes and claims for data durability across pod restarts and scaling events.

Compliance standards: All code must be well-documented, maintainable, and follow established patterns for frontend, backend, AI components, and Kubernetes deployments. API endpoints must follow REST conventions. MCP tools must follow official specifications. Kubernetes resources must follow security best practices (RBAC, network policies, pod security policies). The frontend must provide a good conversational experience with proper scaling in Kubernetes deployments to handle varying user loads and maintain responsive interactions during peak usage periods.

Deployment policies: The application must be deployable with separate services for frontend, backend, MCP server, and database using Kubernetes Deployments, Services, ConfigMaps, and Secrets. Environment variables must be properly configured through Kubernetes ConfigMaps and Secrets for different environments. Domain allowlist must be configured for ChatKit in production via Kubernetes Ingress configurations. Helm charts must be used for all deployments with proper parameterization for different environments and rollback capabilities in case of deployment failures or issues requiring immediate remediation in production clusters.

Security requirements: No hardcoded secrets in code, proper JWT validation, user data isolation, input validation in all API endpoints, secure authentication flow using Better Auth, proper MCP tool authorization, Kubernetes RBAC implementation for cluster security, network policies for service communication security, image scanning for container vulnerabilities, secure secret management in Kubernetes using secrets or external secret stores, and proper resource limits to prevent resource exhaustion attacks that could impact cluster stability and application availability for end users accessing the chatbot services deployed in Kubernetes environments.

## K8s Deployment Skill-Based Development Workflow

Code review requirements: All skill implementations must include usage examples and test scenarios for frontend, backend, AI components, and Kubernetes deployments. Reviews must verify proper containerization, Helm chart configurations, Kubernetes resource definitions, and adherence to Infrastructure as Code principles for consistent, reliable, and maintainable deployments across all environments and development team members working with the Kubernetes-based infrastructure and application services that power the Todo Chatbot system.

Testing gates: Skills must demonstrate functionality through simulated test execution for frontend, backend, AI components, and infrastructure. Containerized applications must pass integration tests in Kubernetes environments, Helm charts must be validated through template rendering and dry-run installations, and deployment configurations must be tested in isolated environments before promotion to production.

Quality metrics: Skills must achieve minimum scores for reusability, maintainability, and effectiveness across the AI chatbot architecture and Kubernetes deployment practices. Container images must pass security scans, Kubernetes manifests must pass linting and security validation, and Helm charts must follow best practices for template structure and parameterization.

Documentation standards: All skills must include clear usage instructions and integration guidelines for frontend, backend, AI components, and Kubernetes deployments. Documentation must cover container build and deployment procedures, Helm chart customization options, and Kubernetes operational procedures including scaling, monitoring, and troubleshooting steps for the deployed AI chatbot services.

## Governance

This constitution supersedes all other development practices for Todo AI Chatbot K8s Deployment projects. Amendments require explicit documentation, approval from project stakeholders, and migration plan for existing implementations. All pull requests and code reviews must verify compliance with these principles.

Skills must be versioned using semantic versioning (MAJOR.MINOR.PATCH). Breaking changes require major version increments and clear migration paths. All skill interfaces must maintain backward compatibility within the same major version. Infrastructure changes must also follow semantic versioning with proper deprecation cycles for Kubernetes resources and Helm chart parameters.

**Version**: 4.0.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-01-10