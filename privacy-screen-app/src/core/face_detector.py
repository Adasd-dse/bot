"""
Face detection and recognition module.

This module provides face detection, tracking, and recognition capabilities
using OpenCV and MediaPipe for real-time processing.
"""

import cv2
import numpy as np
import mediapipe as mp
from typing import List, Tuple, Optional, Dict, Any
from loguru import logger
import face_recognition
import os
import pickle
from pathlib import Path

from ..models.face_data import FaceData, FaceEncoding
from ..utils.image_processing import ImageProcessor


class FaceDetector:
    """
    Face detection and recognition system.
    
    Uses multiple detection methods for robust face detection:
    - MediaPipe for real-time face detection
    - OpenCV Haar cascades for fallback
    - Face recognition for identity verification
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize the face detector.
        
        Args:
            config: Configuration dictionary for face detection
        """
        self.config = config
        self.confidence_threshold = config.get('confidence_threshold', 0.7)
        self.max_faces = config.get('max_faces', 5)
        self.model = config.get('model', 'hog')  # 'hog' or 'cnn'
        self.recognition_tolerance = config.get('recognition_tolerance', 0.6)
        
        # Initialize detection models
        self._initialize_models()
        
        # Face tracking
        self.tracking_enabled = config.get('tracking_enabled', True)
        self.face_tracker = None
        self.tracked_faces = {}
        
        # Face recognition database
        self.known_faces = {}
        self.face_encodings = []
        self.face_names = []
        self._load_known_faces()
        
        logger.info("Face detector initialized successfully")
    
    def _initialize_models(self):
        """Initialize face detection models."""
        try:
            # MediaPipe face detection
            self.mp_face_detection = mp.solutions.face_detection
            self.mp_drawing = mp.solutions.drawing_utils
            
            self.face_detection = self.mp_face_detection.FaceDetection(
                model_selection=1,  # 0 for short-range, 1 for full-range
                min_detection_confidence=self.confidence_threshold
            )
            
            # OpenCV Haar cascade fallback
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            self.face_cascade = cv2.CascadeClassifier(cascade_path)
            
            # MediaPipe face mesh for detailed landmarks
            self.mp_face_mesh = mp.solutions.face_mesh
            self.face_mesh = self.mp_face_mesh.FaceMesh(
                static_image_mode=False,
                max_num_faces=self.max_faces,
                refine_landmarks=True,
                min_detection_confidence=self.confidence_threshold,
                min_tracking_confidence=0.5
            )
            
            logger.debug("Face detection models initialized")
            
        except Exception as e:
            logger.error(f"Failed to initialize face detection models: {e}")
            raise
    
    def detect_faces(self, frame: np.ndarray) -> List[FaceData]:
        """
        Detect faces in the given frame.
        
        Args:
            frame: Input image frame (BGR format)
            
        Returns:
            List of detected faces with metadata
        """
        try:
            # Convert BGR to RGB for MediaPipe
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Primary detection using MediaPipe
            faces = self._detect_with_mediapipe(rgb_frame)
            
            # Fallback to OpenCV if no faces detected
            if not faces:
                faces = self._detect_with_opencv(frame)
            
            # Update face tracking
            if self.tracking_enabled:
                faces = self._update_face_tracking(faces, frame)
            
            # Limit number of faces
            if len(faces) > self.max_faces:
                faces = faces[:self.max_faces]
            
            return faces
            
        except Exception as e:
            logger.error(f"Error in face detection: {e}")
            return []
    
    def _detect_with_mediapipe(self, rgb_frame: np.ndarray) -> List[FaceData]:
        """
        Detect faces using MediaPipe.
        
        Args:
            rgb_frame: Input image frame (RGB format)
            
        Returns:
            List of detected faces
        """
        faces = []
        
        try:
            # Detect faces
            results = self.face_detection.process(rgb_frame)
            
            if results.detections:
                height, width = rgb_frame.shape[:2]
                
                for detection in results.detections:
                    # Get bounding box
                    bbox = detection.location_data.relative_bounding_box
                    x = int(bbox.xmin * width)
                    y = int(bbox.ymin * height)
                    w = int(bbox.width * width)
                    h = int(bbox.height * height)
                    
                    # Get confidence score
                    confidence = detection.score[0]
                    
                    if confidence >= self.confidence_threshold:
                        # Get facial landmarks
                        landmarks = self._extract_mediapipe_landmarks(detection, width, height)
                        
                        # Create face data
                        face_data = FaceData(
                            bbox=(x, y, w, h),
                            confidence=confidence,
                            landmarks=landmarks,
                            detection_method="mediapipe"
                        )
                        
                        faces.append(face_data)
            
        except Exception as e:
            logger.error(f"Error in MediaPipe detection: {e}")
        
        return faces
    
    def _detect_with_opencv(self, frame: np.ndarray) -> List[FaceData]:
        """
        Detect faces using OpenCV Haar cascade.
        
        Args:
            frame: Input image frame (BGR format)
            
        Returns:
            List of detected faces
        """
        faces = []
        
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Detect faces
            face_rects = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30)
            )
            
            for (x, y, w, h) in face_rects:
                # Estimate confidence (OpenCV doesn't provide confidence scores)
                confidence = 0.8  # Default confidence for OpenCV
                
                # Get facial landmarks (simplified)
                landmarks = self._extract_opencv_landmarks(frame, (x, y, w, h))
                
                # Create face data
                face_data = FaceData(
                    bbox=(x, y, w, h),
                    confidence=confidence,
                    landmarks=landmarks,
                    detection_method="opencv"
                )
                
                faces.append(face_data)
            
        except Exception as e:
            logger.error(f"Error in OpenCV detection: {e}")
        
        return faces
    
    def _extract_mediapipe_landmarks(self, detection, width: int, height: int) -> List[Tuple[int, int]]:
        """
        Extract facial landmarks from MediaPipe detection.
        
        Args:
            detection: MediaPipe detection result
            width: Frame width
            height: Frame height
            
        Returns:
            List of landmark coordinates
        """
        landmarks = []
        
        try:
            if detection.location_data.relative_keypoints:
                for keypoint in detection.location_data.relative_keypoints:
                    x = int(keypoint.x * width)
                    y = int(keypoint.y * height)
                    landmarks.append((x, y))
            
        except Exception as e:
            logger.error(f"Error extracting MediaPipe landmarks: {e}")
        
        return landmarks
    
    def _extract_opencv_landmarks(self, frame: np.ndarray, bbox: Tuple[int, int, int, int]) -> List[Tuple[int, int]]:
        """
        Extract simplified facial landmarks from OpenCV detection.
        
        Args:
            frame: Input frame
            bbox: Bounding box (x, y, w, h)
            
        Returns:
            List of estimated landmark coordinates
        """
        x, y, w, h = bbox
        landmarks = []
        
        try:
            # Estimate key facial points
            landmarks = [
                (x + w // 2, y + h // 3),      # Left eye (approximate)
                (x + w // 2, y + h // 3),      # Right eye (approximate)
                (x + w // 2, y + h // 2),      # Nose
                (x + w // 2, y + 2 * h // 3),  # Mouth
            ]
            
        except Exception as e:
            logger.error(f"Error extracting OpenCV landmarks: {e}")
        
        return landmarks
    
    def _update_face_tracking(self, faces: List[FaceData], frame: np.ndarray) -> List[FaceData]:
        """
        Update face tracking information.
        
        Args:
            faces: List of detected faces
            frame: Current frame
            
        Returns:
            Updated list of faces with tracking info
        """
        if not self.tracking_enabled:
            return faces
        
        try:
            # Simple tracking based on position similarity
            current_face_centers = []
            for face in faces:
                x, y, w, h = face.bbox
                center = (x + w // 2, y + h // 2)
                current_face_centers.append(center)
            
            # Update tracked faces
            for face_id, tracked_face in self.tracked_faces.items():
                if tracked_face['active']:
                    # Find closest current face
                    min_distance = float('inf')
                    closest_face = None
                    
                    for i, center in enumerate(current_face_centers):
                        distance = np.sqrt(
                            (center[0] - tracked_face['center'][0]) ** 2 +
                            (center[1] - tracked_face['center'][1]) ** 2
                        )
                        
                        if distance < min_distance and distance < 100:  # 100px threshold
                            min_distance = distance
                            closest_face = faces[i]
                    
                    if closest_face:
                        # Update tracking info
                        tracked_face['center'] = closest_face.bbox[:2]
                        tracked_face['frames_active'] += 1
                        closest_face.tracking_id = face_id
                    else:
                        # Face lost
                        tracked_face['frames_lost'] += 1
                        if tracked_face['frames_lost'] > 10:  # Lost for 10+ frames
                            tracked_face['active'] = False
            
            # Add new faces to tracking
            for face in faces:
                if not hasattr(face, 'tracking_id'):
                    # Find available ID
                    face_id = self._get_next_tracking_id()
                    face.tracking_id = face_id
                    
                    x, y, w, h = face.bbox
                    center = (x + w // 2, y + h // 2)
                    
                    self.tracked_faces[face_id] = {
                        'center': center,
                        'frames_active': 1,
                        'frames_lost': 0,
                        'active': True
                    }
            
        except Exception as e:
            logger.error(f"Error updating face tracking: {e}")
        
        return faces
    
    def _get_next_tracking_id(self) -> int:
        """Get next available tracking ID."""
        if not self.tracked_faces:
            return 0
        
        used_ids = set(self.tracked_faces.keys())
        next_id = 0
        
        while next_id in used_ids:
            next_id += 1
        
        return next_id
    
    def recognize_face(self, face_data: FaceData) -> Optional[str]:
        """
        Recognize a detected face.
        
        Args:
            face_data: Face data containing landmarks and bounding box
            
        Returns:
            Name of recognized person or None if not recognized
        """
        try:
            if not self.known_faces:
                return None
            
            # Extract face encoding
            x, y, w, h = face_data.bbox
            face_image = self._extract_face_region(face_data)
            
            if face_image is None:
                return None
            
            # Get face encoding
            face_encoding = face_recognition.face_encodings(face_image)
            
            if not face_encoding:
                return None
            
            # Compare with known faces
            matches = face_recognition.compare_faces(
                self.face_encodings,
                face_encoding[0],
                tolerance=self.recognition_tolerance
            )
            
            if True in matches:
                match_index = matches.index(True)
                return self.face_names[match_index]
            
            return None
            
        except Exception as e:
            logger.error(f"Error in face recognition: {e}")
            return None
    
    def _extract_face_region(self, face_data: FaceData) -> Optional[np.ndarray]:
        """
        Extract face region from frame.
        
        Args:
            face_data: Face data with bounding box
            
        Returns:
            Extracted face image or None
        """
        try:
            # This would need access to the original frame
            # For now, return None - implementation depends on frame storage
            return None
            
        except Exception as e:
            logger.error(f"Error extracting face region: {e}")
            return None
    
    def add_known_face(self, name: str, face_encoding: np.ndarray) -> bool:
        """
        Add a known face to the recognition database.
        
        Args:
            name: Name of the person
            face_encoding: Face encoding vector
            
        Returns:
            True if added successfully, False otherwise
        """
        try:
            self.face_encodings.append(face_encoding)
            self.face_names.append(name)
            self.known_faces[name] = face_encoding
            
            # Save to disk
            self._save_known_faces()
            
            logger.info(f"Added known face: {name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to add known face: {e}")
            return False
    
    def remove_known_face(self, name: str) -> bool:
        """
        Remove a known face from the recognition database.
        
        Args:
            name: Name of the person to remove
            
        Returns:
            True if removed successfully, False otherwise
        """
        try:
            if name in self.known_faces:
                # Remove from all lists
                if name in self.face_names:
                    index = self.face_names.index(name)
                    del self.face_names[index]
                    del self.face_encodings[index]
                
                del self.known_faces[name]
                
                # Save to disk
                self._save_known_faces()
                
                logger.info(f"Removed known face: {name}")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Failed to remove known face: {e}")
            return False
    
    def _load_known_faces(self):
        """Load known faces from disk."""
        try:
            faces_file = Path("data/known_faces.pkl")
            
            if faces_file.exists():
                with open(faces_file, 'rb') as f:
                    data = pickle.load(f)
                    self.face_encodings = data.get('encodings', [])
                    self.face_names = data.get('names', [])
                    self.known_faces = data.get('faces', {})
                
                logger.info(f"Loaded {len(self.known_faces)} known faces")
            
        except Exception as e:
            logger.error(f"Failed to load known faces: {e}")
    
    def _save_known_faces(self):
        """Save known faces to disk."""
        try:
            # Create data directory if it doesn't exist
            data_dir = Path("data")
            data_dir.mkdir(exist_ok=True)
            
            faces_file = data_dir / "known_faces.pkl"
            
            data = {
                'encodings': self.face_encodings,
                'names': self.face_names,
                'faces': self.known_faces
            }
            
            with open(faces_file, 'wb') as f:
                pickle.dump(data, f)
            
            logger.debug("Saved known faces to disk")
            
        except Exception as e:
            logger.error(f"Failed to save known faces: {e}")
    
    def set_sensitivity(self, sensitivity: float):
        """
        Set detection sensitivity.
        
        Args:
            sensitivity: Sensitivity value (0.0 to 1.0)
        """
        try:
            if not 0.0 <= sensitivity <= 1.0:
                raise ValueError("Sensitivity must be between 0.0 and 1.0")
            
            # Update confidence threshold
            self.confidence_threshold = 1.0 - sensitivity
            
            # Update MediaPipe models
            self.face_detection = self.mp_face_detection.FaceDetection(
                model_selection=1,
                min_detection_confidence=self.confidence_threshold
            )
            
            self.face_mesh = self.mp_face_mesh.FaceMesh(
                static_image_mode=False,
                max_num_faces=self.max_faces,
                refine_landmarks=True,
                min_detection_confidence=self.confidence_threshold,
                min_tracking_confidence=0.5
            )
            
            logger.info(f"Detection sensitivity set to: {sensitivity}")
            
        except Exception as e:
            logger.error(f"Failed to set sensitivity: {e}")
    
    def get_detection_stats(self) -> Dict[str, Any]:
        """
        Get face detection statistics.
        
        Returns:
            Dictionary containing detection statistics
        """
        return {
            'total_faces_detected': len(self.tracked_faces),
            'active_faces': sum(1 for f in self.tracked_faces.values() if f['active']),
            'known_faces_count': len(self.known_faces),
            'confidence_threshold': self.confidence_threshold,
            'detection_methods': ['mediapipe', 'opencv']
        }
    
    def __del__(self):
        """Cleanup on deletion."""
        try:
            if hasattr(self, 'face_detection'):
                self.face_detection.close()
            if hasattr(self, 'face_mesh'):
                self.face_mesh.close()
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")