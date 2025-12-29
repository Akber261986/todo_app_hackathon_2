#!/usr/bin/env python3
"""
Runner script for the Console Todo Application.
"""
import sys
import os

# Add the src directory to the Python path
src_dir = os.path.join(os.path.dirname(__file__), 'src')
sys.path.insert(0, src_dir)

# Now import and run the application
from ui.console_menu import ConsoleMenu


def main():
    """Main function to run the Console Todo Application."""
    print("Initializing Console Todo Application...")
    menu = ConsoleMenu()
    menu.run()


if __name__ == "__main__":
    main()