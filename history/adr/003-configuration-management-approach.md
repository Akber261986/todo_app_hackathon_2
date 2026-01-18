# ADR-003: Configuration Management Approach

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2026-01-10
- **Feature:** 001-k8s-deployment-specs
- **Context:** Need to manage application configuration and sensitive data in a secure, scalable, and environment-specific manner within the Kubernetes deployment.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security?
     2) Alternatives: Multiple viable options considered with tradeoffs?
     3) Scope: Cross-cutting concern (not an isolated detail)?
     If any are false, prefer capturing as a PHR note instead of an ADR. -->

## Decision

- **Non-Sensitive Configuration**: Kubernetes ConfigMaps for non-sensitive application configuration
- **Sensitive Configuration**: Kubernetes Secrets for sensitive data (DATABASE_URL, BETTER_AUTH_SECRET, OPENAI_API_KEY)
- **Environment Parameterization**: Helm values for environment-specific configurations
- **Security**: No hardcoded secrets in code or deployment manifests

## Consequences

### Positive

- Proper separation of sensitive and non-sensitive configuration
- Secure handling of secrets with Kubernetes native tools
- Environment-specific configuration through Helm parameterization
- Version control of configuration changes
- Consistent configuration management across environments

### Negative

- Kubernetes Secrets are base64 encoded but not encrypted by default
- Additional complexity in secret management at rest
- Need for additional tools for advanced secret management if required
- Potential for secrets to be exposed in logs or debugging output
- Complexity in managing multiple environment configurations

## Alternatives Considered

Alternative Approach A: Environment variables directly in deployment files
- Why rejected: Less secure, harder to manage, no proper secret handling

Alternative Approach B: External configuration services (HashiCorp Vault, AWS Secrets Manager)
- Why rejected: Adds complexity for basic configuration needs, additional infrastructure overhead

Alternative Approach C: Configuration files mounted as volumes
- Why rejected: Less secure, harder to manage, not following Kubernetes best practices

## References

- Feature Spec: specs/001-k8s-deployment-specs/spec.md
- Implementation Plan: specs/001-k8s-deployment-specs/plan.md
- Related ADRs: ADR-001
- Evaluator Evidence: specs/001-k8s-deployment-specs/research.md