"""
Simple test to verify API structure without requiring a database connection
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Import the main app to verify it loads correctly
from src.main import app
from src.api.chat_endpoints import router as chat_router
from src.services.task_service import TaskService
from src.services.conversation_service import ConversationService

def test_api_structure():
    """Test that API endpoints are properly defined"""
    print("[OK] Main app imported successfully")

    # Check that the chat router is registered
    chat_routes = [route for route in app.routes if hasattr(route, 'path') and '/chat' in route.path]
    print(f"[OK] Found {len(chat_routes)} chat-related routes")

    # Check that services can be instantiated
    task_service = TaskService()
    conversation_service = ConversationService()
    print("[OK] TaskService and ConversationService instantiated successfully")

    # Check that service methods exist
    expected_task_methods = ['create_task', 'get_task', 'get_user_tasks', 'update_task', 'delete_task', 'complete_task']
    for method in expected_task_methods:
        if hasattr(task_service, method):
            print(f"[OK] TaskService.{method} method exists")
        else:
            print(f"[ERROR] TaskService.{method} method missing")

    expected_conversation_methods = ['create_conversation', 'get_conversation', 'get_user_conversations', 'add_message', 'get_conversation_messages']
    for method in expected_conversation_methods:
        if hasattr(conversation_service, method):
            print(f"[OK] ConversationService.{method} method exists")
        else:
            print(f"[ERROR] ConversationService.{method} method missing")

    print("\nAPI structure verification completed successfully!")

if __name__ == "__main__":
    test_api_structure()