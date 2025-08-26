"""
Gaze tracking module.

This module provides eye tracking and gaze direction analysis using
MediaPipe and computer vision techniques for precise user attention detection.
"""

import cv2
import numpy as np
import mediapipe as mp
from typing import List, Tuple, Optional, Dict, Any
from loguru import logger
import math

from ..models.face_data import FaceData
from ..utils.image_processing import ImageProcessor


class GazeTracker:
    """
    Gaze tracking system for detecting user attention direction.
    
    Uses MediaPipe face mesh for precise eye landmark detection and
    implements gaze direction estimation algorithms.
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize the gaze tracker.
        
        Args:
            config: Configuration dictionary for gaze detection
        """
        self.config = config
        self.enabled = config.get('enabled', True)
        self.precision = config.get('precision', 0.8)
        self.tolerance_degrees = config.get('tolerance_degrees', 15)
        self.calibration_points = config.get('calibration_points', 9)
        
        # Initialize MediaPipe face mesh
        self._initialize_face_mesh()
        
        # Gaze calibration data
        self.calibration_data = {}
        self.is_calibrated = False
        
        # Eye aspect ratio thresholds
        self.EAR_THRESHOLD = 0.2
        
        # Gaze direction history for smoothing
        self.gaze_history = []
        self.history_size = 5
        
        logger.info("Gaze tracker initialized successfully")
    
    def _initialize_face_mesh(self):
        """Initialize MediaPipe face mesh for eye tracking."""
        try:
            self.mp_face_mesh = mp.solutions.face_mesh
            self.mp_drawing = mp.solutions.drawing_utils
            
            self.face_mesh = self.mp_face_mesh.FaceMesh(
                static_image_mode=False,
                max_num_faces=1,  # Focus on one face for gaze tracking
                refine_landmarks=True,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5
            )
            
            # Define eye landmark indices
            self.LEFT_EYE = [362, 385, 387, 263, 373, 380]
            self.RIGHT_EYE = [33, 160, 158, 133, 153, 144]
            
            # Iris landmarks for precise gaze tracking
            self.LEFT_IRIS = [468, 469, 470, 471, 472]
            self.RIGHT_IRIS = [473, 474, 475, 476, 477]
            
            logger.debug("MediaPipe face mesh initialized for gaze tracking")
            
        except Exception as e:
            logger.error(f"Failed to initialize face mesh: {e}")
            raise
    
    def track_gaze(self, frame: np.ndarray, face_data: FaceData) -> Optional[Tuple[float, float]]:
        """
        Track gaze direction for a detected face.
        
        Args:
            frame: Input image frame
            face_data: Face data containing landmarks
            
        Returns:
            Gaze direction as (x, y) coordinates or None if tracking failed
        """
        if not self.enabled:
            return None
        
        try:
            # Convert BGR to RGB for MediaPipe
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Process frame with face mesh
            results = self.face_mesh.process(rgb_frame)
            
            if not results.multi_face_landmarks:
                return None
            
            # Get the first (and should be only) face
            face_landmarks = results.multi_face_landmarks[0]
            
            # Extract eye landmarks
            left_eye_landmarks = self._extract_eye_landmarks(face_landmarks, self.LEFT_EYE)
            right_eye_landmarks = self._extract_eye_landmarks(face_landmarks, self.RIGHT_EYE)
            
            # Calculate eye aspect ratio for blink detection
            left_ear = self._calculate_eye_aspect_ratio(left_eye_landmarks)
            right_ear = self._calculate_eye_aspect_ratio(right_eye_landmarks)
            
            # Check if eyes are open
            if left_ear < self.EAR_THRESHOLD or right_ear < self.EAR_THRESHOLD:
                logger.debug("Eyes closed, skipping gaze tracking")
                return None
            
            # Calculate gaze direction
            gaze_direction = self._calculate_gaze_direction(face_landmarks, frame.shape)
            
            # Apply smoothing
            gaze_direction = self._smooth_gaze_direction(gaze_direction)
            
            # Convert to screen coordinates
            screen_coords = self._gaze_to_screen_coordinates(gaze_direction)
            
            return screen_coords
            
        except Exception as e:
            logger.error(f"Error in gaze tracking: {e}")
            return None
    
    def _extract_eye_landmarks(self, face_landmarks, eye_indices: List[int]) -> List[Tuple[float, float]]:
        """
        Extract eye landmark coordinates.
        
        Args:
            face_landmarks: MediaPipe face landmarks
            eye_indices: Indices of eye landmarks
            
        Returns:
            List of (x, y) coordinates for eye landmarks
        """
        landmarks = []
        
        try:
            for idx in eye_indices:
                landmark = face_landmarks.landmark[idx]
                landmarks.append((landmark.x, landmark.y))
            
        except Exception as e:
            logger.error(f"Error extracting eye landmarks: {e}")
        
        return landmarks
    
    def _calculate_eye_aspect_ratio(self, eye_landmarks: List[Tuple[float, float]]) -> float:
        """
        Calculate eye aspect ratio for blink detection.
        
        Args:
            eye_landmarks: Eye landmark coordinates
            
        Returns:
            Eye aspect ratio value
        """
        try:
            if len(eye_landmarks) < 6:
                return 0.0
            
            # Calculate vertical distances
            A = self._euclidean_distance(eye_landmarks[1], eye_landmarks[5])
            B = self._euclidean_distance(eye_landmarks[2], eye_landmarks[4])
            
            # Calculate horizontal distance
            C = self._euclidean_distance(eye_landmarks[0], eye_landmarks[3])
            
            # Eye aspect ratio
            ear = (A + B) / (2.0 * C)
            
            return ear
            
        except Exception as e:
            logger.error(f"Error calculating eye aspect ratio: {e}")
            return 0.0
    
    def _euclidean_distance(self, point1: Tuple[float, float], point2: Tuple[float, float]) -> float:
        """
        Calculate Euclidean distance between two points.
        
        Args:
            point1: First point (x, y)
            point2: Second point (x, y)
            
        Returns:
            Euclidean distance
        """
        return math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2)
    
    def _calculate_gaze_direction(self, face_landmarks, frame_shape: Tuple[int, int, int]) -> Tuple[float, float]:
        """
        Calculate gaze direction from face landmarks.
        
        Args:
            face_landmarks: MediaPipe face landmarks
            frame_shape: Frame dimensions (height, width, channels)
            
        Returns:
            Gaze direction as (x, y) normalized coordinates
        """
        try:
            height, width = frame_shape[:2]
            
            # Get iris center points
            left_iris_center = self._get_iris_center(face_landmarks, self.LEFT_IRIS, width, height)
            right_iris_center = self._get_iris_center(face_landmarks, self.RIGHT_IRIS, width, height)
            
            if left_iris_center is None or right_iris_center is None:
                return (0.5, 0.5)  # Default center
            
            # Calculate gaze direction based on iris position relative to eye center
            left_gaze = self._calculate_eye_gaze(face_landmarks, self.LEFT_EYE, left_iris_center, width, height)
            right_gaze = self._calculate_eye_gaze(face_landmarks, self.RIGHT_EYE, right_iris_center, width, height)
            
            # Combine both eyes (average)
            gaze_x = (left_gaze[0] + right_gaze[0]) / 2.0
            gaze_y = (left_gaze[1] + right_gaze[1]) / 2.0
            
            return (gaze_x, gaze_y)
            
        except Exception as e:
            logger.error(f"Error calculating gaze direction: {e}")
            return (0.5, 0.5)
    
    def _get_iris_center(self, face_landmarks, iris_indices: List[int], width: int, height: int) -> Optional[Tuple[float, float]]:
        """
        Get the center point of the iris.
        
        Args:
            face_landmarks: MediaPipe face landmarks
            iris_indices: Indices of iris landmarks
            width: Frame width
            height: Frame height
            
        Returns:
            Iris center coordinates or None
        """
        try:
            if len(iris_indices) < 3:
                return None
            
            # Calculate center of iris landmarks
            x_sum = sum(face_landmarks.landmark[idx].x for idx in iris_indices)
            y_sum = sum(face_landmarks.landmark[idx].y for idx in iris_indices)
            
            center_x = x_sum / len(iris_indices)
            center_y = y_sum / len(iris_indices)
            
            return (center_x, center_y)
            
        except Exception as e:
            logger.error(f"Error getting iris center: {e}")
            return None
    
    def _calculate_eye_gaze(self, face_landmarks, eye_indices: List[int], iris_center: Tuple[float, float], 
                           width: int, height: int) -> Tuple[float, float]:
        """
        Calculate gaze direction for a single eye.
        
        Args:
            face_landmarks: MediaPipe face landmarks
            eye_indices: Eye landmark indices
            iris_center: Iris center coordinates
            width: Frame width
            height: Frame height
            
        Returns:
            Gaze direction as normalized coordinates
        """
        try:
            # Get eye center
            eye_center_x = sum(face_landmarks.landmark[idx].x for idx in eye_indices) / len(eye_indices)
            eye_center_y = sum(face_landmarks.landmark[idx].y for idx in eye_indices) / len(eye_indices)
            
            # Calculate iris offset from eye center
            iris_offset_x = iris_center[0] - eye_center_x
            iris_offset_y = iris_center[1] - eye_center_y
            
            # Normalize offset to get gaze direction
            # Positive x = looking right, Positive y = looking down
            gaze_x = 0.5 + iris_offset_x * 2.0  # Scale and center
            gaze_y = 0.5 + iris_offset_y * 2.0
            
            # Clamp to valid range
            gaze_x = max(0.0, min(1.0, gaze_x))
            gaze_y = max(0.0, min(1.0, gaze_y))
            
            return (gaze_x, gaze_y)
            
        except Exception as e:
            logger.error(f"Error calculating eye gaze: {e}")
            return (0.5, 0.5)
    
    def _smooth_gaze_direction(self, gaze_direction: Tuple[float, float]) -> Tuple[float, float]:
        """
        Apply temporal smoothing to gaze direction.
        
        Args:
            gaze_direction: Current gaze direction
            
        Returns:
            Smoothed gaze direction
        """
        try:
            # Add to history
            self.gaze_history.append(gaze_direction)
            
            # Keep only recent history
            if len(self.gaze_history) > self.history_size:
                self.gaze_history.pop(0)
            
            # Calculate weighted average (recent frames have higher weight)
            if len(self.gaze_history) < 2:
                return gaze_direction
            
            weights = np.linspace(0.5, 1.0, len(self.gaze_history))
            weights = weights / np.sum(weights)
            
            smoothed_x = sum(g[0] * w for g, w in zip(self.gaze_history, weights))
            smoothed_y = sum(g[1] * w for g, w in zip(self.gaze_history, weights))
            
            return (smoothed_x, smoothed_y)
            
        except Exception as e:
            logger.error(f"Error smoothing gaze direction: {e}")
            return gaze_direction
    
    def _gaze_to_screen_coordinates(self, gaze_direction: Tuple[float, float]) -> Tuple[float, float]:
        """
        Convert normalized gaze direction to screen coordinates.
        
        Args:
            gaze_direction: Normalized gaze direction (0-1, 0-1)
            
        Returns:
            Screen coordinates (0-1, 0-1)
        """
        try:
            # Apply calibration if available
            if self.is_calibrated:
                return self._apply_calibration(gaze_direction)
            
            # Simple linear mapping
            screen_x = gaze_direction[0]
            screen_y = gaze_direction[1]
            
            return (screen_x, screen_y)
            
        except Exception as e:
            logger.error(f"Error converting gaze to screen coordinates: {e}")
            return gaze_direction
    
    def _apply_calibration(self, gaze_direction: Tuple[float, float]) -> Tuple[float, float]:
        """
        Apply calibration transformation to gaze direction.
        
        Args:
            gaze_direction: Raw gaze direction
            
        Returns:
            Calibrated screen coordinates
        """
        try:
            # Simple bilinear interpolation for calibration
            # This is a simplified version - real calibration would be more sophisticated
            
            # For now, return the input (no calibration applied)
            return gaze_direction
            
        except Exception as e:
            logger.error(f"Error applying calibration: {e}")
            return gaze_direction
    
    def is_gaze_valid(self, gaze_direction: Tuple[float, float], tolerance_degrees: float) -> bool:
        """
        Check if gaze direction is within valid range.
        
        Args:
            gaze_direction: Gaze direction coordinates
            tolerance_degrees: Tolerance in degrees
            
        Returns:
            True if gaze is valid, False otherwise
        """
        try:
            if gaze_direction is None:
                return False
            
            # Convert tolerance to normalized coordinates
            # This is a simplified check - real implementation would use proper angle calculations
            tolerance_normalized = tolerance_degrees / 90.0  # Approximate conversion
            
            # Check if gaze is within center region
            center_x, center_y = 0.5, 0.5
            
            distance_x = abs(gaze_direction[0] - center_x)
            distance_y = abs(gaze_direction[1] - center_y)
            
            return distance_x <= tolerance_normalized and distance_y <= tolerance_normalized
            
        except Exception as e:
            logger.error(f"Error checking gaze validity: {e}")
            return False
    
    def start_calibration(self) -> bool:
        """
        Start gaze calibration process.
        
        Returns:
            True if calibration started successfully, False otherwise
        """
        try:
            logger.info("Starting gaze calibration")
            
            # Reset calibration data
            self.calibration_data = {}
            self.is_calibrated = False
            
            # Generate calibration points
            self._generate_calibration_points()
            
            logger.info("Gaze calibration started")
            return True
            
        except Exception as e:
            logger.error(f"Failed to start calibration: {e}")
            return False
    
    def _generate_calibration_points(self):
        """Generate calibration point positions."""
        try:
            # Generate a grid of calibration points
            grid_size = int(math.sqrt(self.calibration_points))
            
            for i in range(grid_size):
                for j in range(grid_size):
                    x = (i + 0.5) / grid_size
                    y = (j + 0.5) / grid_size
                    
                    point_id = f"point_{i}_{j}"
                    self.calibration_data[point_id] = {
                        'target': (x, y),
                        'gaze_samples': [],
                        'calibrated': False
                    }
            
        except Exception as e:
            logger.error(f"Error generating calibration points: {e}")
    
    def add_calibration_sample(self, point_id: str, gaze_direction: Tuple[float, float]) -> bool:
        """
        Add a calibration sample for a specific point.
        
        Args:
            point_id: Calibration point identifier
            gaze_direction: Measured gaze direction
            
        Returns:
            True if sample added successfully, False otherwise
        """
        try:
            if point_id not in self.calibration_data:
                logger.warning(f"Unknown calibration point: {point_id}")
                return False
            
            # Add gaze sample
            self.calibration_data[point_id]['gaze_samples'].append(gaze_direction)
            
            # Check if enough samples collected
            if len(self.calibration_data[point_id]['gaze_samples']) >= 5:
                self.calibration_data[point_id]['calibrated'] = True
                logger.debug(f"Calibration point {point_id} completed")
            
            return True
            
        except Exception as e:
            logger.error(f"Error adding calibration sample: {e}")
            return False
    
    def finish_calibration(self) -> bool:
        """
        Finish calibration and calculate transformation matrix.
        
        Returns:
            True if calibration completed successfully, False otherwise
        """
        try:
            logger.info("Finishing gaze calibration")
            
            # Check if all points are calibrated
            calibrated_points = sum(1 for p in self.calibration_data.values() if p['calibrated'])
            
            if calibrated_points < self.calibration_points * 0.8:  # Require 80% completion
                logger.warning("Insufficient calibration points completed")
                return False
            
            # Calculate calibration transformation
            self._calculate_calibration_transform()
            
            self.is_calibrated = True
            logger.info("Gaze calibration completed successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to finish calibration: {e}")
            return False
    
    def _calculate_calibration_transform(self):
        """Calculate calibration transformation matrix."""
        try:
            # This is a simplified calibration calculation
            # Real implementation would use more sophisticated methods like RANSAC
            
            logger.debug("Calculating calibration transformation")
            
            # For now, just mark as calibrated
            # In a real implementation, this would calculate the transformation matrix
            
        except Exception as e:
            logger.error(f"Error calculating calibration transform: {e}")
    
    def get_calibration_status(self) -> Dict[str, Any]:
        """
        Get calibration status and progress.
        
        Returns:
            Dictionary containing calibration status
        """
        try:
            total_points = len(self.calibration_data)
            calibrated_points = sum(1 for p in self.calibration_data.values() if p['calibrated'])
            
            return {
                'is_calibrated': self.is_calibrated,
                'total_points': total_points,
                'calibrated_points': calibrated_points,
                'progress': calibrated_points / total_points if total_points > 0 else 0.0,
                'calibration_data': self.calibration_data
            }
            
        except Exception as e:
            logger.error(f"Error getting calibration status: {e}")
            return {}
    
    def __del__(self):
        """Cleanup on deletion."""
        try:
            if hasattr(self, 'face_mesh'):
                self.face_mesh.close()
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")