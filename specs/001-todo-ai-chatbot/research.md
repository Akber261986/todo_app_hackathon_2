# Research: Todo AI Chatbot with MCP Server Architecture

## Decision: Technology Stack Selection
**Rationale**: Selected technology stack based on requirements from constitution and feature specification. Python/FastAPI for backend due to strong AI/ML ecosystem and compatibility with OpenAI Agents SDK. OpenAI ChatKit for frontend due to seamless integration with OpenAI services. MCP SDK for standardized tool exposure to AI agents.

**Alternatives considered**:
- Node.js/Express backend vs Python/FastAPI: Chose Python due to better AI/ML libraries and OpenAI ecosystem integration
- Custom chat UI vs OpenAI ChatKit: Chose ChatKit for faster development and official OpenAI integration
- Custom protocol vs MCP: Chose MCP for standardized approach to AI tool exposure

## Decision: Architecture Pattern
**Rationale**: Stateless server design with database-stored conversation context enables horizontal scaling and resilience. MCP server separation allows for standardized AI tool exposure without coupling to main application logic.

**Alternatives considered**:
- Stateful server with in-memory context vs Stateless with DB storage: Chose stateless for better scalability and resilience
- Direct AI integration vs MCP-based tools: Chose MCP for standardized, reusable tool architecture

## Decision: Data Storage Approach
**Rationale**: PostgreSQL chosen for ACID compliance, complex query support, and user data isolation requirements. Three main entities (Task, Conversation, Message) with proper relationships and user_id filtering for multi-tenancy.

**Alternatives considered**:
- NoSQL vs SQL database: Chose SQL for data integrity and complex relationship queries
- Single table vs normalized schema: Chose normalized for data integrity and clear relationships

## Decision: Authentication Method
**Rationale**: JWT-based authentication with Better Auth provides stateless authentication suitable for microservices architecture while ensuring user data isolation.

**Alternatives considered**:
- Session-based vs JWT tokens: Chose JWT for stateless server design compatibility
- Custom auth vs Better Auth: Chose Better Auth for established security patterns