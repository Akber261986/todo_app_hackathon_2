# Spec Refiner Skill

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
3. Functional Requirements: List specific requirements
4. Acceptance Criteria: Clear criteria for acceptance
5. Test Scenarios: Specific test cases
6. Assumptions: Any assumptions made
7. Questions: Any ambiguities that need clarification

Focus on making the specification clear, complete, and testable.
```