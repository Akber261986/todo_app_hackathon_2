# Helm Chart Specification: Todo Chatbot Kubernetes Deployment

**Feature**: 001-k8s-deployment-specs
**Created**: 2026-01-10
**Status**: Draft

## Overview

This specification defines the Helm chart structure and configuration for deploying the Todo Chatbot application to Kubernetes. The chart provides a complete deployment solution with configurable components for frontend, backend, and supporting services.

## Chart Structure

### Chart.yaml
- Name: `todo-chatbot`
- Version: `0.1.0` (following semantic versioning)
- AppVersion: Match the application version
- Description: "Helm chart for Todo Chatbot application"
- APIVersion: `v2` (using Helm 3)

### values.yaml Default Configuration
- Global settings (image registry, tags, etc.)
- Frontend-specific values (replica count, resources, environment)
- Backend-specific values (replica count, resources, environment)
- Service configuration (ports, type)
- Ingress configuration (host, TLS settings)
- Database connection parameters
- Resource limits and requests
- Environment variables for the application

### templates/ Directory Structure
- `deployment-frontend.yaml`: Frontend deployment configuration
- `deployment-backend.yaml`: Backend deployment configuration
- `service-frontend.yaml`: Frontend service definition
- `service-backend.yaml`: Backend service definition
- `ingress.yaml`: Ingress resource for external access
- `secret.yaml`: Encrypted storage for sensitive values
- `configmap.yaml`: Configuration values for the application
- `_helpers.tpl`: Named templates for reuse
- `NOTES.txt`: Installation notes and post-installation instructions

## Deployment Templates

### Frontend Deployment
- Use imagePullPolicy based on tag (Always for latest, IfNotPresent for versioned)
- Configure resource limits and requests
- Mount environment variables via ConfigMap and Secrets
- Configure liveness and readiness probes
- Set replica count based on values
- Configure node affinity and tolerations if needed

### Backend Deployment
- Use imagePullPolicy based on tag (Always for latest, IfNotPresent for versioned)
- Configure resource limits and requests
- Mount environment variables via ConfigMap and Secrets
- Configure liveness and readiness probes
- Set replica count based on values
- Configure database connection settings

## Service Templates

### Frontend Service
- Type: ClusterIP or LoadBalancer based on values
- Port mapping (external: internal)
- Selector labels to match deployment

### Backend Service
- Type: ClusterIP
- Port mapping for API access
- Selector labels to match deployment

## Ingress Template

### Routing Configuration
- Hostname from values (with default)
- Path-based routing for frontend
- TLS configuration (optional)
- Annotations for ingress controller configuration
- Backend service routing for API endpoints

## Configuration Management

### Secrets
- BETTER_AUTH_SECRET: For JWT authentication
- OPENAI_API_KEY: For OpenAI API access
- DATABASE_URL: Database connection string
- Additional secrets as needed

### ConfigMap
- Non-sensitive environment variables
- Application configuration settings
- Frontend-specific settings

## Values Customization Points

### Frontend Configuration
- `frontend.image.repository`: Image repository
- `frontend.image.tag`: Image tag
- `frontend.replicaCount`: Number of frontend replicas
- `frontend.resources`: CPU/Memory limits and requests
- `frontend.service.port`: Service port

### Backend Configuration
- `backend.image.repository`: Image repository
- `backend.image.tag`: Image tag
- `backend.replicaCount`: Number of backend replicas
- `backend.resources`: CPU/Memory limits and requests
- `backend.service.port`: Service port

### Ingress Configuration
- `ingress.enabled`: Enable/disable ingress
- `ingress.hosts`: Hostnames for routing
- `ingress.tls`: TLS configuration
- `ingress.annotations`: Controller-specific annotations

### Resource Configuration
- `resources.limits.cpu`
- `resources.limits.memory`
- `resources.requests.cpu`
- `resources.requests.memory`

## Probes Configuration

### Liveness Probes
- HTTP GET requests to health endpoints
- Appropriate timeouts and failure thresholds
- Different endpoints for frontend and backend

### Readiness Probes
- Verify service is ready to serve traffic
- Proper delay and timeout settings
- Different endpoints for frontend and backend

## Security Considerations

### RBAC (if required)
- Minimal required permissions
- Namespace-scoped resources
- Principle of least privilege

### Pod Security
- Run as non-root user
- ReadOnlyRootFilesystem where possible
- Seccomp and AppArmor profiles
- Privilege escalation disabled

## Upgrades and Rollbacks

### Upgrade Strategy
- RollingUpdate strategy by default
- MaxUnavailable and MaxSurge configuration
- Hooks for pre/post upgrade operations

### Rollback Capability
- Maintain release history
- Ability to rollback to previous versions
- Data persistence across upgrades