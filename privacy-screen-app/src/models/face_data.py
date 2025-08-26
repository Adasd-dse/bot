"""
Face data models.

This module contains data structures for representing face detection
and recognition information.
"""

from typing import List, Tuple, Optional, Dict, Any
from dataclasses import dataclass
import numpy as np


@dataclass
class FaceData:
    """
    Data structure for face detection results.
    
    Attributes:
        bbox: Bounding box coordinates (x, y, width, height)
        confidence: Detection confidence score (0.0 to 1.0)
        landmarks: List of facial landmark coordinates
        detection_method: Method used for detection
        tracking_id: Optional tracking identifier
    """
    bbox: Tuple[int, int, int, int]  # (x, y, width, height)
    confidence: float
    landmarks: List[Tuple[int, int]]
    detection_method: str
    tracking_id: Optional[int] = None
    
    def get_center(self) -> Tuple[int, int]:
        """Get center point of the face bounding box."""
        x, y, w, h = self.bbox
        return (x + w // 2, y + h // 2)
    
    def get_area(self) -> int:
        """Get area of the face bounding box."""
        w, h = self.bbox[2:]
        return w * h
    
    def is_valid(self) -> bool:
        """Check if face data is valid."""
        return (
            len(self.bbox) == 4 and
            all(isinstance(x, int) and x >= 0 for x in self.bbox) and
            0.0 <= self.confidence <= 1.0 and
            isinstance(self.detection_method, str)
        )


@dataclass
class FaceEncoding:
    """
    Data structure for face encodings used in recognition.
    
    Attributes:
        encoding: Face encoding vector
        name: Name/identifier of the person
        confidence: Recognition confidence score
        metadata: Additional metadata
    """
    encoding: np.ndarray
    name: str
    confidence: float
    metadata: Optional[Dict[str, Any]] = None
    
    def is_valid(self) -> bool:
        """Check if face encoding is valid."""
        return (
            isinstance(self.encoding, np.ndarray) and
            len(self.encoding.shape) == 1 and
            isinstance(self.name, str) and
            0.0 <= self.confidence <= 1.0
        )
    
    def get_encoding_vector(self) -> np.ndarray:
        """Get the encoding vector as a copy."""
        return self.encoding.copy()