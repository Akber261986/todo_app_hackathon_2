---
id: 1
title: "Update Constitution for Phase II Multi-User Todo App"
stage: constitution
date: 2025-12-29
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: Claude Code
command: /sp.constitution
labels: ["constitution", "full-stack", "multi-user", "todo-app"]
spec: null
ticket: null
adr: null
pr: null
files:
  - .specify/memory/constitution.md
tests: []
---

# Prompt History Record: Update Constitution for Phase II Multi-User Todo App

## Overview
Updated the project constitution to reflect the requirements for Phase II: a multi-user full-stack web Todo app with persistent Neon DB, JWT authentication via Better Auth, and responsive UI.

## Original Prompt
```
Reference the Spec-Kit monorepo structure from the hackathon doc: Add /frontend/ (Next.js App Router), /backend/ (FastAPI), docker-compose.yml later.

/sp.constitution Create constitution.md for Phase II: Multi-user full-stack web Todo app building on Phase I. Govern migration to persistent Neon DB, REST API with user isolation via JWT from Better Auth, responsive UI. Rules: Use shared BETTER_AUTH_SECRET env var, filter tasks by authenticated user_id, no manual code.

As Main Orchestrator Agent (# Main Orchestrator Agent

## Role
Coordinate sub-agents for the Todo project. Handle phase progression, delegate tasks, ensure spec-driven flow, and assemble final outputs.

## Capabilities
- Read constitution and specs
- Delegate to Planning, Implementation, Review Agents
- Handoff: "Pass to Implementation Agent: [task]"
- Ensure all work aligns with Agentic Dev Stack

## Prompt Template
You are the Main Orchestrator for the Todo Evolution hackathon. Follow AGENTS.md strictly. User query: [query]. Steps: 1. Check specs. 2. Delegate if needed. 3. Assemble response.

Example: "Orchestrate Phase I implementation."), orchestrate this. Use Spec Refiner Skill (# Spec Refiner Skill

## Purpose
The Spec Refiner Skill processes natural language descriptions of Todo features and converts them into structured specifications.

## Input
- Natural language description of Todo features
- Example: "Add a feature to create tasks with priorities and due dates"

## Processing
- Use NLP to identify key entities (tasks, priorities, due dates, CRUD operations)
- Extract functional requirements from the description
- Generate acceptance criteria based on the requirements
- Identify potential edge cases and error conditions

## Output
- Structured specification with clear requirements
- Acceptance criteria
- Test scenarios
- Identified ambiguities that need clarification

## Prompt
```
You are a specification refinement expert. Convert the following natural language description into a structured specification:

Input: {natural_language_description}

Output format:
1. Title: Clear title for the feature
2. Description: Detailed description
3. Functional Requirements: List specific req) to refine.
```

## Response
Created a new constitution.md file that includes:
- Updated core principles for full-stack development
- Multi-user architecture requirements
- JWT authentication and authorization principles
- Persistent data management requirements
- Frontend-backend separation principles
- Updated development constraints and workflow for full-stack application
- Version 2.0.0 reflecting major changes from Phase I to Phase II

## Outcome
Successfully created a new constitution that governs the development of the multi-user full-stack web Todo app, including requirements for Neon DB migration, JWT authentication via Better Auth, user isolation, and responsive UI.

## Evaluation
The new constitution properly reflects the architectural changes from Phase I (console app) to Phase II (full-stack web app) with multi-user support, authentication, and persistent storage.