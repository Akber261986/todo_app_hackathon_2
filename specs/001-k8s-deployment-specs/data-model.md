# Data Model: K8s Deployment for Todo Chatbot

## Container Images
- **Name**: Container Images
- **Fields**:
  - id: Unique identifier for the image
  - name: Image name and tag
  - size: Size of the image after optimization
  - build_date: Date when the image was built
  - security_scan_status: Status of vulnerability scan
- **Relationships**: Represents Docker images for frontend and backend components
- **Validation**: Must comply with multi-stage build requirements and security scanning

## Helm Chart
- **Name**: Helm Chart
- **Fields**:
  - name: Name of the Helm chart
  - version: Semantic version of the chart
  - app_version: Version of the application
  - description: Description of the chart's purpose
  - templates: Collection of Kubernetes resource templates
- **Relationships**: Contains Deployments, Services, ConfigMaps, Secrets, and Ingress resources
- **Validation**: Must follow Helm best practices and include proper parameterization

## Kubernetes Resources
- **Name**: Kubernetes Resources
- **Fields**:
  - resource_type: Type of Kubernetes resource (Deployment, Service, etc.)
  - name: Name of the resource
  - namespace: Namespace where the resource will be deployed
  - configuration: Configuration parameters for the resource
- **Relationships**: Individual Kubernetes objects managed by the Helm chart
- **Validation**: Must follow security best practices and include proper health checks

## Environment Variables
- **Name**: Environment Variables
- **Fields**:
  - name: Name of the environment variable
  - value: Value of the variable (encrypted for sensitive data)
  - scope: Scope of the variable (frontend, backend, or shared)
  - sensitivity_level: Level of sensitivity (public, protected, secret)
- **Relationships**: Configuration parameters passed to containers at runtime
- **Validation**: Sensitive variables must be stored in Kubernetes Secrets

## Deployment Configuration
- **Name**: Deployment Configuration
- **Fields**:
  - replica_count: Number of pod replicas
  - resource_limits: CPU and memory limits for the pods
  - resource_requests: CPU and memory requests for the pods
  - health_checks: Liveness and readiness probe configurations
- **Relationships**: Defines how applications are deployed and scaled in Kubernetes
- **Validation**: Must follow resource optimization and availability requirements