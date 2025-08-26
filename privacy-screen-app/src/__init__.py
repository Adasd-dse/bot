"""
Privacy Screen App (SafeView)
A privacy protection application using computer vision and face detection.

This package provides real-time screen protection based on user presence detection.
"""

__version__ = "1.0.0"
__author__ = "Privacy Screen App Team"
__email__ = "support@privacyscreenapp.com"

from .core.privacy_screen_app import PrivacyScreenApp
from .core.face_detector import FaceDetector
from .core.gaze_tracker import GazeTracker
from .core.screen_protector import ScreenProtector

__all__ = [
    "PrivacyScreenApp",
    "FaceDetector", 
    "GazeTracker",
    "ScreenProtector"
]