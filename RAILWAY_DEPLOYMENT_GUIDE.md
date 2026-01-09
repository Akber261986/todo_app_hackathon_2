# Railway Deployment Guide for Todo App Backend

This guide will help you deploy your FastAPI backend application to Railway successfully.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. The `railway` CLI installed (optional but recommended)
3. Your project repository connected to Railway

## Step-by-Step Deployment Process

### 1. Prepare Your Railway Configuration

Your project already includes a `railway.toml` file with the correct configuration. The key points are:

- The install command changes to the backend directory: `cd backend && pip install --no-cache-dir -r requirements.txt`
- The start command also changes to the backend directory: `cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment variables are properly configured for required settings

### 2. Connect Your Project to Railway

#### Option A: Via Railway Dashboard
1. Go to [railway.app](https://railway.app) and log in
2. Click "New Project"
3. Select "Deploy from GitHub" (or your preferred Git provider)
4. Choose your repository
5. Railway will automatically detect your `railway.toml` configuration

#### Option B: Via Railway CLI
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Link your project: `railway init`
4. Deploy: `railway up`

### 3. Configure Environment Variables

After connecting your project, you need to set the required environment variables in the Railway dashboard:

1. **DATABASE_URL**: PostgreSQL connection string
   - You can create a PostgreSQL service in Railway or use an external database
   - Format: `postgresql://username:password@host:port/database_name`

2. **BETTER_AUTH_SECRET**: Secret key for authentication
   - Generate a strong secret (at least 32 characters)
   - Use: `openssl rand -base64 32` to generate one

3. **ACCESS_TOKEN_EXPIRE_MINUTES** (optional): Token expiration time in minutes (default: 30)

### 4. Create Database Service (Optional)

If you want to use Railway's PostgreSQL service:

1. In your Railway project, click "New" → "Database"
2. Choose "PostgreSQL"
3. Select "Provision PostgreSQL"
4. The DATABASE_URL will be automatically available as an environment variable

### 5. Deploy Your Application

1. Push your code to the connected repository
2. Railway will automatically detect changes and deploy
3. Monitor the deployment logs in the Railway dashboard

### 6. Verify Deployment

1. Check the deployment logs for any errors
2. Visit the provided Railway URL to verify your app is running
3. Test the health check endpoint: `https://your-app.railway.app/health`
4. Verify the root endpoint: `https://your-app.railway.app/`

## Common Issues and Troubleshooting

### Build Issues
- If dependencies fail to install, check that your `backend/requirements.txt` is properly formatted
- Ensure all dependencies are compatible with the Python 3.11 environment

### Runtime Issues
- Verify that the PORT environment variable is being used (Railway sets this automatically)
- Check that the working directory is correctly set to the backend folder
- Ensure all required environment variables are set in the Railway dashboard

### Database Issues
- If using an external database, verify the DATABASE_URL is correctly formatted
- If using Railway's PostgreSQL, ensure the service is properly linked

### Health Check Issues
- The `/health` endpoint should return `{"status": "healthy"}`
- If the health check fails, check the application logs for errors

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| BETTER_AUTH_SECRET | Yes | Authentication secret key |
| ACCESS_TOKEN_EXPIRE_MINUTES | No | Token expiration in minutes (default: 30) |

## Deployment Tips

1. Always test your application locally from the backend directory using:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. Use Railway's environment variables for sensitive data like database credentials and API keys

3. Monitor your resource usage to stay within free tier limits

4. Use Railway's automatic deployments for seamless updates when pushing to your repository

## Next Steps

Once your backend is successfully deployed:
1. Update your frontend's API base URL to point to your Railway backend URL
2. Test the complete application flow
3. Consider setting up custom domains if needed