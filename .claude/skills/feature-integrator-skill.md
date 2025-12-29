# Feature Integrator Skill

## Purpose
The Feature Integrator Skill analyzes existing Todo app architecture and suggests optimal integration points for new features while preserving clean architecture.

## Input
- Description of the new feature to integrate
- Existing codebase structure or architecture description
- Example: "Add AI chat integration" + current Todo app architecture

## Processing
- Analyze the existing architecture to understand current structure
- Identify appropriate integration points that maintain clean architecture
- Assess risks associated with different integration approaches
- Generate implementation plan with recommended steps

## Output
- Integration recommendations with rationale
- Risk assessment for each approach
- Step-by-step implementation plan
- Architecture preservation guidelines

## Prompt
```
You are an architecture integration expert. Analyze the following codebase and suggest how to integrate the new feature:

Existing Architecture: {architecture_description}
New Feature: {feature_description}

Provide:
1. Architecture Analysis: Understand the current structure and patterns
2. Integration Points: Where and how to add the new feature
3. Risk Assessment: Potential impacts on existing functionality
4. Implementation Plan: Step-by-step approach to integration
5. Architecture Preservation: How to maintain clean architecture during integration
6. Recommendations: Best practices for the integration

Consider:
- Minimize impact on existing functionality
- Follow existing architectural patterns
- Maintain separation of concerns
- Ensure testability of new code
- Consider performance implications
```