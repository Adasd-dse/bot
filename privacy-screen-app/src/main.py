#!/usr/bin/env python3
"""
Privacy Screen App (SafeView) - Main Entry Point

This is the main entry point for the Privacy Screen App.
"""

import sys
import os
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent))

from privacy_screen_app import PrivacyScreenApp
from utils.logger import setup_logging
from loguru import logger


def main():
    """Main application entry point."""
    try:
        # Setup logging
        setup_logging()
        
        logger.info("Starting Privacy Screen App (SafeView)")
        
        # Initialize the app
        app = PrivacyScreenApp()
        
        # Start protection
        if app.start_protection():
            logger.info("Privacy protection started successfully")
            
            # Keep running
            try:
                while True:
                    import time
                    time.sleep(1)
            except KeyboardInterrupt:
                logger.info("Shutting down...")
                app.stop_protection()
        else:
            logger.error("Failed to start privacy protection")
            return 1
        
        return 0
        
    except Exception as e:
        logger.error(f"Application error: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())