"""
Main entry point for the Console Todo Application.

This module initializes and runs the console-based todo application
with all required features as specified in the requirements.
"""
import sys
import os

# Add the project root directory to Python path so imports work correctly
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from hackathon_todo.src.ui.console_menu import ConsoleMenu


def main():
    """
    Main function to run the Console Todo Application.

    Initializes the ConsoleMenu and starts the main application loop.
    """
    print("Initializing Console Todo Application...")
    menu = ConsoleMenu()
    menu.run()


if __name__ == "__main__":
    main()