# Claude Code Skills for Todo App Development

This directory contains a set of specialized skills for Todo app development using natural language processing.

## Available Skills

### 1. Spec Refiner Skill
- **File**: `skills/spec-refiner-skill.md`
- **Purpose**: Converts natural language feature descriptions into structured specifications
- **Use Case**: "Convert this feature request into a detailed specification"
- **Input**: Natural language description of Todo features
- **Output**: Structured specification with requirements and acceptance criteria

### 2. Code Tester Skill
- **File**: `skills/code-tester-skill.md`
- **Purpose**: Generates unit tests for Todo app code snippets without execution
- **Use Case**: "Create test cases for this function and predict outcomes"
- **Input**: Code snippets in Python, JavaScript, etc.
- **Output**: Comprehensive test cases with predicted results

### 3. Feature Integrator Skill
- **File**: `skills/feature-integrator-skill.md`
- **Purpose**: Suggests optimal integration points while preserving architecture
- **Use Case**: "How should I add this feature to my existing Todo app?"
- **Input**: New feature description + existing architecture
- **Output**: Integration recommendations with risk assessment

## Usage Guidelines

1. **For Specification Creation**: Use the Spec Refiner Skill when you have a feature idea that needs to be formalized into requirements.

2. **For Testing**: Use the Code Tester Skill when you have code that needs comprehensive test coverage analysis.

3. **For Integration**: Use the Feature Integrator Skill when adding new functionality to an existing Todo application.

Each skill contains detailed prompts that can be used directly with Claude to perform the specific task.