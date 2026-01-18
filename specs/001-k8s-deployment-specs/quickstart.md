# Quickstart Guide: K8s Deployment for Todo Chatbot

## Prerequisites

- Docker (v20.10 or higher)
- Kubernetes cluster (Minikube recommended for local development)
- Helm (v3.0 or higher)
- kubectl
- kubectl-ai plugin (optional, for AI-assisted operations)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd todo_app_hackathon_2
```

### 2. Start Minikube (for local development)

```bash
minikube start
```

### 3. Build Docker Images

#### Build Frontend Image
```bash
cd frontend
docker build -t todo-chatbot-frontend:latest .
cd ..
```

#### Build Backend Image
```bash
cd backend
docker build -t todo-chatbot-backend:latest .
cd ..
```

### 4. Load Images into Minikube (for local development)

```bash
minikube image load todo-chatbot-frontend:latest
minikube image load todo-chatbot-backend:latest
```

### 5. Install Helm Chart

```bash
cd helm/todo-chatbot
helm install todo-chatbot . --values values.yaml
```

### 6. Verify Installation

```bash
kubectl get pods
kubectl get services
kubectl get ingress
```

## Configuration

### Environment Variables

The application requires the following environment variables:

- `DATABASE_URL`: Connection string for the database
- `BETTER_AUTH_SECRET`: Secret key for JWT authentication
- `OPENAI_API_KEY`: API key for OpenAI services

These are configured in the Helm chart's `values.yaml` file under the `secrets` section.

### Customizing Deployment

Modify the `values.yaml` file to customize:

- Replica counts
- Resource limits and requests
- Environment-specific configurations
- Ingress hostnames

## Using AI-Assisted Operations

Once kubectl-ai is installed, you can use natural language commands:

```bash
# Scale the backend deployment
kubectl ai "scale backend deployment to 3 replicas"

# Get status of all deployments
kubectl ai "show me the status of all deployments"

# Analyze logs for errors
kubectl ai "analyze pod logs for errors"
```

## Accessing the Application

### Local Development (Minikube)

```bash
minikube service todo-chatbot-frontend --url
```

### Production

Access the application via the configured ingress hostname.

## Troubleshooting

### Common Issues

1. **Images not found**: Ensure images are built and loaded into the Kubernetes cluster
2. **Service unavailable**: Check that all pods are running and services are properly configured
3. **Configuration errors**: Verify that all required environment variables are set

### Useful Commands

```bash
# Check pod status
kubectl get pods

# View pod logs
kubectl logs <pod-name>

# Describe a resource for detailed information
kubectl describe <resource-type> <resource-name>

# Check Helm release status
helm status todo-chatbot
```

## Uninstall

To remove the deployment:

```bash
helm uninstall todo-chatbot
```