# Frontend-Backend Integration Troubleshooting Guide

## Issue Description
- Backend works correctly when tested via Swagger
- Frontend deployed on Vercel shows "an error occurred" when trying to sign in
- Railway logs show 404 for favicon.ico (not related to the issue)

## Troubleshooting Steps

### 1. Verify Environment Variables in Vercel
Confirm that your Vercel environment variable is set correctly:
- Variable: `NEXT_PUBLIC_API_BASE_URL`
- Value: Should be your Railway backend URL (e.g., `https://your-app-name.railway.app`)
- Make sure it includes `https://` and ends without a trailing slash

### 2. Check Browser Developer Tools
1. Open your deployed Vercel app
2. Press F12 to open Developer Tools
3. Go to the "Network" tab
4. Try to sign in
5. Look for the failed API request and check:
   - The exact URL being called
   - The error status code
   - The error message

### 3. Verify CORS Configuration in Backend
Your backend CORS settings should include your Vercel domain. In your `backend/app/main.py`, make sure you have:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-vercel-domain.vercel.app",  # Replace with your actual domain
        "http://localhost:3000",  # For local development
        # other origins...
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

### 4. Test the Backend Endpoint Directly
Test your backend endpoint manually using browser dev tools:
1. Open browser dev tools
2. Go to Console tab
3. Run:
```javascript
fetch('https://your-railway-app.railway.app/api/v1/auth/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'your-test-email@example.com',
    password: 'your-test-password'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### 5. Check Railway Logs During Request
While attempting to sign in from the frontend, monitor the Railway logs to see if the request reaches the backend.

### 6. Common Solutions
- Ensure the backend URL in Vercel environment variables is exactly the same as your Railway deployment URL
- Verify that the backend accepts HTTPS requests (not just HTTP)
- Make sure both frontend and backend are using the same protocol (both HTTPS)
- Check if there are any firewall or network restrictions between Vercel and Railway

## If Still Not Working
As a last resort, you can temporarily add "*" to allow_origins in your backend CORS configuration (NOT recommended for production):
```python
allow_origins=["*"],  # Only for testing
```

Then redeploy your backend to Railway and test again.