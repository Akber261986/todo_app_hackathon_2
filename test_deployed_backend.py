import requests
import json

# Test the deployed backend endpoint
BASE_URL = "https://web-production-todoapp.up.railway.app/"

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get(BASE_URL + "health")
        print("Health Check Response:", response.json())
        print("Status Code:", response.status_code)
    except Exception as e:
        print("Health Check Error:", str(e))

def test_signin():
    """Test the sign-in endpoint (replace with actual credentials)"""
    try:
        # Replace with actual test credentials
        signin_data = {
            "email": "test@example.com",  # Replace with actual test email
            "password": "testpassword"    # Replace with actual test password
        }
        response = requests.post(BASE_URL + "api/v1/auth/signin", json=signin_data)
        print("Sign-in Response:", response.json())
        print("Status Code:", response.status_code)
    except Exception as e:
        print("Sign-in Error:", str(e))

def test_signup():
    """Test the sign-up endpoint (replace with actual test data)"""
    try:
        # Replace with actual test data
        signup_data = {
            "email": "test@example.com",  # Replace with actual test email
            "password": "testpassword"    # Replace with actual test password
        }
        response = requests.post(BASE_URL + "api/v1/auth/signup", json=signup_data)
        print("Sign-up Response:", response.json())
        print("Status Code:", response.status_code)
    except Exception as e:
        print("Sign-up Error:", str(e))

if __name__ == "__main__":
    print("Testing deployed backend at:", BASE_URL)
    print("\n1. Testing Health Check:")
    test_health_check()

    print("\n2. Testing Sign-in:")
    test_signin()

    print("\n3. Testing Sign-up:")
    test_signup()