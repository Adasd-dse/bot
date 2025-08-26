"""
Image processing utilities.

This module provides image processing functions for the Privacy Screen App.
"""

import cv2
import numpy as np
from typing import Tuple, Optional


class ImageProcessor:
    """Utility class for image processing operations."""
    
    @staticmethod
    def resize_image(image: np.ndarray, target_size: Tuple[int, int]) -> np.ndarray:
        """Resize image to target size."""
        return cv2.resize(image, target_size)
    
    @staticmethod
    def apply_blur(image: np.ndarray, intensity: int) -> np.ndarray:
        """Apply Gaussian blur to image."""
        return cv2.GaussianBlur(image, (intensity, intensity), 0)
    
    @staticmethod
    def apply_pixelation(image: np.ndarray, block_size: int) -> np.ndarray:
        """Apply pixelation effect to image."""
        height, width = image.shape[:2]
        
        # Resize down
        small = cv2.resize(image, (width // block_size, height // block_size))
        
        # Resize up
        return cv2.resize(small, (width, height), interpolation=cv2.INTER_NEAREST)
    
    @staticmethod
    def adjust_brightness(image: np.ndarray, factor: float) -> np.ndarray:
        """Adjust image brightness."""
        return cv2.convertScaleAbs(image, alpha=factor, beta=0)