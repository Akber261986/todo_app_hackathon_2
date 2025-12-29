<!--
Sync Impact Report:
Version change: 1.0.0 → 1.1.0
Added sections:
- Principle 4: Skill Reusability
- Principle 5: Phase Alignment
- Principle 6: Nine Pillars Compliance
Modified sections:
- Principle 1 → Skill-Centric Architecture
- Principle 2 → Specification-Driven Development
- Principle 3 → Automated Quality Assurance
- Section 2 → Todo App Development Constraints
- Section 3 → Skill-Based Development Workflow
Templates requiring updates:
- .specify/templates/plan-template.md ⚠ pending
- .specify/templates/spec-template.md ⚠ pending
- .specify/templates/tasks-template.md ⚠ pending
- .specify/templates/commands/*.md ⚠ pending
Follow-up TODOs: none
-->

# Todo App Skills Constitution

## Core Principles

### I. Skill-Centric Architecture
All functionality must be encapsulated as reusable Claude Code Skills that can operate across different phases of development. Skills must be self-contained, independently testable, and documented with clear interfaces. Each skill should have a single, well-defined purpose with explicit inputs and outputs.

### II. Specification-Driven Development
Development must begin with clear, complete specifications before implementation. The Spec Refiner Skill ensures all specifications meet quality standards for clarity, completeness, and alignment with project requirements. Specifications must include acceptance criteria, edge cases, and test scenarios before development begins.

### III. Automated Quality Assurance
Quality assurance must be automated through the Code Tester Skill which generates unit tests and simulates execution without running code. All code must pass comprehensive test coverage analysis before integration. Test simulation provides confidence in code correctness without execution risks.

### IV. Skill Reusability
All skills must be designed for reuse across multiple projects and phases. Skills should follow established patterns, maintain consistent interfaces, and avoid tight coupling to specific implementations. Reusable skills reduce development time and improve consistency.

### V. Phase Alignment
Skills must align with and support the specific phase of development (specification, planning, implementation, testing). The Feature Integrator Skill ensures proper integration while maintaining clean architecture throughout all phases. Skills must understand and adapt to phase-specific requirements.

### VI. Nine Pillars Compliance
All skills and implementations must follow the Nine Pillars of AI-Driven Development: 1) Autonomous Execution, 2) Continuous Learning, 3) Predictable Outcomes, 4) Human-AI Collaboration, 5) Adaptive Intelligence, 6) Quality Assurance, 7) Scalable Architecture, 8) Transparent Operations, 9) Sustainable Development.

## Todo App Development Constraints

Technology stack requirements: Python/JavaScript for core functionality, Markdown for specifications, Git for version control.
Compliance standards: All code must be well-documented, maintainable, and follow established patterns.
Deployment policies: Skills must be portable and not depend on specific runtime environments.
Security requirements: No hardcoded secrets, proper input validation in all skills.

## Skill-Based Development Workflow

Code review requirements: All skill implementations must include usage examples and test scenarios.
Testing gates: Skills must demonstrate functionality through simulated test execution.
Quality metrics: Skills must achieve minimum scores for reusability, maintainability, and effectiveness.
Documentation standards: All skills must include clear usage instructions and integration guidelines.

## Governance

This constitution supersedes all other development practices for Todo app projects. Amendments require explicit documentation, approval from project stakeholders, and migration plan for existing implementations. All pull requests and code reviews must verify compliance with these principles.

Skills must be versioned using semantic versioning (MAJOR.MINOR.PATCH). Breaking changes require major version increments and clear migration paths. All skill interfaces must maintain backward compatibility within the same major version.

**Version**: 1.1.0 | **Ratified**: 2025-12-28 | **Last Amended**: 2025-12-28
