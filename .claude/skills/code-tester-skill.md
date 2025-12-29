# Code Tester Skill

## Purpose
The Code Tester Skill generates unit tests for Todo app code snippets without executing the code, using simulation to predict outcomes.

## Input
- Code snippets in Python, JavaScript, or other languages
- Example: Function definitions, class implementations, or modules

## Processing
- Analyze code structure to identify functions/methods
- Generate test cases for normal execution paths
- Generate test cases for edge cases and error conditions
- Simulate test execution to predict outcomes without running code
- Estimate test coverage

## Output
- Generated test cases with predicted outcomes
- Test coverage analysis
- Suggested additional test scenarios
- Risk assessment for untested code paths

## Prompt
```
You are a code testing expert. Analyze the following code and generate comprehensive tests without executing it:

Code: {code_snippet}

For each function/method in the code, generate:

1. Happy Path Tests: Test normal execution with valid inputs
2. Edge Case Tests: Test boundary conditions and unusual inputs
3. Error Path Tests: Test error handling and invalid inputs
4. For each test case, predict the expected outcome based on the code logic
5. Identify which parts of the code are covered by tests
6. Suggest additional test scenarios that would improve coverage

Output format:
- Test Cases with inputs, expected outputs, and predicted results
- Coverage analysis (percentage and uncovered areas)
- Additional test suggestions
- Risk assessment for untested code
```