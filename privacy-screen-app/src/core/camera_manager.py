"""
Camera management module.

This module provides camera/webcam management functionality for capturing
video frames used in face detection and gaze tracking.
"""

import cv2
import numpy as np
from typing import Optional, Dict, Any, Tuple
from loguru import logger
import threading
import time
import platform
import sys

from ..utils.image_processing import ImageProcessor


class CameraManager:
    """
    Camera management system for video capture and frame processing.
    
    Handles camera initialization, frame capture, and provides
    platform-specific optimizations for different operating systems.
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize the camera manager.
        
        Args:
            config: Configuration dictionary for camera settings
        """
        self.config = config
        self.device_index = config.get('device_index', 0)
        self.resolution = config.get('resolution', '720p')
        self.fps = config.get('fps', 30)
        self.flip_horizontal = config.get('flip_horizontal', True)
        self.auto_focus = config.get('auto_focus', True)
        
        # Camera state
        self.camera = None
        self.is_running = False
        self.current_frame = None
        self.frame_lock = threading.Lock()
        
        # Performance metrics
        self.frame_count = 0
        self.fps_start_time = time.time()
        self.current_fps = 0.0
        
        # Platform detection
        self.platform = self._detect_platform()
        
        # Resolution mapping
        self.resolution_map = {
            '480p': (640, 480),
            '720p': (1280, 720),
            '1080p': (1920, 1080)
        }
        
        logger.info(f"Camera manager initialized for {self.platform}")
    
    def _detect_platform(self) -> str:
        """Detect the current platform."""
        system = platform.system().lower()
        
        if system == "windows":
            return "windows"
        elif system == "darwin":
            return "macos"
        elif system == "linux":
            return "linux"
        else:
            return "unknown"
    
    def start(self) -> bool:
        """
        Start the camera and begin frame capture.
        
        Returns:
            True if camera started successfully, False otherwise
        """
        try:
            logger.info("Starting camera")
            
            # Initialize camera
            if not self._initialize_camera():
                logger.error("Failed to initialize camera")
                return False
            
            # Start frame capture thread
            self.is_running = True
            self.capture_thread = threading.Thread(
                target=self._capture_loop,
                daemon=True
            )
            self.capture_thread.start()
            
            logger.info("Camera started successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to start camera: {e}")
            return False
    
    def stop(self) -> bool:
        """
        Stop the camera and release resources.
        
        Returns:
            True if camera stopped successfully, False otherwise
        """
        try:
            logger.info("Stopping camera")
            
            # Stop capture thread
            self.is_running = False
            
            # Wait for thread to finish
            if hasattr(self, 'capture_thread') and self.capture_thread.is_alive():
                self.capture_thread.join(timeout=2.0)
            
            # Release camera
            if self.camera is not None:
                self.camera.release()
                self.camera = None
            
            logger.info("Camera stopped successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to stop camera: {e}")
            return False
    
    def _initialize_camera(self) -> bool:
        """
        Initialize the camera with specified settings.
        
        Returns:
            True if camera initialized successfully, False otherwise
        """
        try:
            # Get resolution
            width, height = self.resolution_map.get(self.resolution, (1280, 720))
            
            # Initialize camera based on platform
            if self.platform == "windows":
                success = self._init_windows_camera(width, height)
            elif self.platform == "macos":
                success = self._init_macos_camera(width, height)
            elif self.platform == "linux":
                success = self._init_linux_camera(width, height)
            else:
                success = self._init_generic_camera(width, height)
            
            if success:
                # Configure camera properties
                self._configure_camera_properties()
                
                # Test camera
                if not self._test_camera():
                    logger.error("Camera test failed")
                    return False
                
                logger.info(f"Camera initialized: {width}x{height} @ {self.fps}fps")
                return True
            else:
                logger.error("Failed to initialize camera")
                return False
                
        except Exception as e:
            logger.error(f"Error initializing camera: {e}")
            return False
    
    def _init_windows_camera(self, width: int, height: int) -> bool:
        """Initialize camera on Windows."""
        try:
            # Windows-specific camera initialization
            # Use DirectShow backend for better compatibility
            
            self.camera = cv2.VideoCapture(self.device_index, cv2.CAP_DSHOW)
            
            if not self.camera.isOpened():
                # Fallback to default backend
                self.camera = cv2.VideoCapture(self.device_index)
            
            if self.camera.isOpened():
                # Set resolution
                self.camera.set(cv2.CAP_PROP_FRAME_WIDTH, width)
                self.camera.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
                
                # Set FPS
                self.camera.set(cv2.CAP_PROP_FPS, self.fps)
                
                logger.debug("Windows camera initialized successfully")
                return True
            else:
                logger.error("Failed to open Windows camera")
                return False
                
        except Exception as e:
            logger.error(f"Error initializing Windows camera: {e}")
            return False
    
    def _init_macos_camera(self, width: int, height: int) -> bool:
        """Initialize camera on macOS."""
        try:
            # macOS-specific camera initialization
            # Use AVFoundation backend
            
            self.camera = cv2.VideoCapture(self.device_index, cv2.CAP_AVFOUNDATION)
            
            if not self.camera.isOpened():
                # Fallback to default backend
                self.camera = cv2.VideoCapture(self.device_index)
            
            if self.camera.isOpened():
                # Set resolution
                self.camera.set(cv2.CAP_PROP_FRAME_WIDTH, width)
                self.camera.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
                
                # Set FPS
                self.camera.set(cv2.CAP_PROP_FPS, self.fps)
                
                logger.debug("macOS camera initialized successfully")
                return True
            else:
                logger.error("Failed to open macOS camera")
                return False
                
        except Exception as e:
            logger.error(f"Error initializing macOS camera: {e}")
            return False
    
    def _init_linux_camera(self, width: int, height: int) -> bool:
        """Initialize camera on Linux."""
        try:
            # Linux-specific camera initialization
            # Try V4L2 backend first
            
            self.camera = cv2.VideoCapture(self.device_index, cv2.CAP_V4L2)
            
            if not self.camera.isOpened():
                # Fallback to default backend
                self.camera = cv2.VideoCapture(self.device_index)
            
            if self.camera.isOpened():
                # Set resolution
                self.camera.set(cv2.CAP_PROP_FRAME_WIDTH, width)
                self.camera.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
                
                # Set FPS
                self.camera.set(cv2.CAP_PROP_FPS, self.fps)
                
                logger.debug("Linux camera initialized successfully")
                return True
            else:
                logger.error("Failed to open Linux camera")
                return False
                
        except Exception as e:
            logger.error(f"Error initializing Linux camera: {e}")
            return False
    
    def _init_generic_camera(self, width: int, height: int) -> bool:
        """Initialize camera using generic backend."""
        try:
            # Generic camera initialization
            self.camera = cv2.VideoCapture(self.device_index)
            
            if self.camera.isOpened():
                # Set resolution
                self.camera.set(cv2.CAP_PROP_FRAME_WIDTH, width)
                self.camera.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
                
                # Set FPS
                self.camera.set(cv2.CAP_PROP_FPS, self.fps)
                
                logger.debug("Generic camera initialized successfully")
                return True
            else:
                logger.error("Failed to open generic camera")
                return False
                
        except Exception as e:
            logger.error(f"Error initializing generic camera: {e}")
            return False
    
    def _configure_camera_properties(self):
        """Configure additional camera properties."""
        try:
            if self.camera is None:
                return
            
            # Set auto-focus if supported
            if self.auto_focus:
                self.camera.set(cv2.CAP_PROP_AUTOFOCUS, 1)
            
            # Set buffer size for better performance
            self.camera.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            
            # Set exposure (auto)
            self.camera.set(cv2.CAP_PROP_AUTO_EXPOSURE, 0.25)
            
            # Set white balance (auto)
            self.camera.set(cv2.CAP_PROP_AUTO_WB, 1)
            
            logger.debug("Camera properties configured")
            
        except Exception as e:
            logger.error(f"Error configuring camera properties: {e}")
    
    def _test_camera(self) -> bool:
        """
        Test camera by capturing a test frame.
        
        Returns:
            True if test successful, False otherwise
        """
        try:
            if self.camera is None:
                return False
            
            # Capture test frame
            ret, frame = self.camera.read()
            
            if not ret or frame is None:
                logger.error("Failed to capture test frame")
                return False
            
            # Check frame dimensions
            height, width = frame.shape[:2]
            expected_width, expected_height = self.resolution_map.get(self.resolution, (1280, 720))
            
            if width < expected_width * 0.8 or height < expected_height * 0.8:
                logger.warning(f"Camera resolution lower than expected: {width}x{height}")
            
            logger.debug("Camera test successful")
            return True
            
        except Exception as e:
            logger.error(f"Camera test failed: {e}")
            return False
    
    def _capture_loop(self):
        """Main camera capture loop."""
        logger.debug("Starting camera capture loop")
        
        while self.is_running:
            try:
                if self.camera is None:
                    time.sleep(0.01)
                    continue
                
                # Capture frame
                ret, frame = self.camera.read()
                
                if ret and frame is not None:
                    # Process frame
                    processed_frame = self._process_frame(frame)
                    
                    # Update current frame
                    with self.frame_lock:
                        self.current_frame = processed_frame
                    
                    # Update metrics
                    self._update_metrics()
                else:
                    logger.warning("Failed to capture frame")
                    time.sleep(0.01)
                
                # Control frame rate
                time.sleep(1.0 / self.fps)
                
            except Exception as e:
                logger.error(f"Error in capture loop: {e}")
                time.sleep(0.1)
        
        logger.debug("Camera capture loop stopped")
    
    def _process_frame(self, frame: np.ndarray) -> np.ndarray:
        """
        Process captured frame.
        
        Args:
            frame: Raw camera frame
            
        Returns:
            Processed frame
        """
        try:
            # Flip horizontally if configured
            if self.flip_horizontal:
                frame = cv2.flip(frame, 1)
            
            # Apply any additional processing
            # This could include noise reduction, color correction, etc.
            
            return frame
            
        except Exception as e:
            logger.error(f"Error processing frame: {e}")
            return frame
    
    def _update_metrics(self):
        """Update performance metrics."""
        try:
            self.frame_count += 1
            current_time = time.time()
            
            # Calculate FPS every second
            if current_time - self.fps_start_time >= 1.0:
                self.current_fps = self.frame_count / (current_time - self.fps_start_time)
                self.frame_count = 0
                self.fps_start_time = current_time
                
        except Exception as e:
            logger.error(f"Error updating metrics: {e}")
    
    def get_frame(self) -> Optional[np.ndarray]:
        """
        Get the most recent camera frame.
        
        Returns:
            Current frame or None if not available
        """
        try:
            with self.frame_lock:
                if self.current_frame is not None:
                    return self.current_frame.copy()
                return None
                
        except Exception as e:
            logger.error(f"Error getting frame: {e}")
            return None
    
    def get_frame_with_metadata(self) -> Optional[Dict[str, Any]]:
        """
        Get frame with metadata.
        
        Returns:
            Dictionary containing frame and metadata, or None
        """
        try:
            frame = self.get_frame()
            if frame is None:
                return None
            
            return {
                'frame': frame,
                'timestamp': time.time(),
                'fps': self.current_fps,
                'resolution': frame.shape[:2][::-1],  # (width, height)
                'platform': self.platform
            }
            
        except Exception as e:
            logger.error(f"Error getting frame with metadata: {e}")
            return None
    
    def set_resolution(self, resolution: str) -> bool:
        """
        Change camera resolution.
        
        Args:
            resolution: New resolution (480p, 720p, 1080p)
            
        Returns:
            True if resolution changed successfully, False otherwise
        """
        try:
            if resolution not in self.resolution_map:
                logger.error(f"Invalid resolution: {resolution}")
                return False
            
            logger.info(f"Changing camera resolution to {resolution}")
            
            # Stop camera
            was_running = self.is_running
            if was_running:
                self.stop()
            
            # Update resolution
            self.resolution = resolution
            
            # Restart camera
            if was_running:
                return self.start()
            
            return True
            
        except Exception as e:
            logger.error(f"Error changing resolution: {e}")
            return False
    
    def set_fps(self, fps: int) -> bool:
        """
        Change camera frame rate.
        
        Args:
            fps: New frame rate
            
        Returns:
            True if FPS changed successfully, False otherwise
        """
        try:
            if fps < 1 or fps > 60:
                logger.error(f"Invalid FPS: {fps}")
                return False
            
            logger.info(f"Changing camera FPS to {fps}")
            
            # Update FPS
            self.fps = fps
            
            # Update camera property if running
            if self.camera is not None and self.camera.isOpened():
                self.camera.set(cv2.CAP_PROP_FPS, fps)
            
            return True
            
        except Exception as e:
            logger.error(f"Error changing FPS: {e}")
            return False
    
    def get_available_cameras(self) -> list:
        """
        Get list of available camera devices.
        
        Returns:
            List of available camera indices
        """
        try:
            available_cameras = []
            
            # Check first 10 camera indices
            for i in range(10):
                cap = cv2.VideoCapture(i)
                if cap.isOpened():
                    available_cameras.append(i)
                    cap.release()
            
            logger.debug(f"Found {len(available_cameras)} available cameras")
            return available_cameras
            
        except Exception as e:
            logger.error(f"Error getting available cameras: {e}")
            return []
    
    def get_camera_info(self) -> Dict[str, Any]:
        """
        Get camera information and capabilities.
        
        Returns:
            Dictionary containing camera information
        """
        try:
            if self.camera is None or not self.camera.isOpened():
                return {}
            
            info = {
                'device_index': self.device_index,
                'resolution': self.resolution,
                'fps': self.fps,
                'platform': self.platform,
                'is_running': self.is_running,
                'current_fps': self.current_fps,
                'frame_count': self.frame_count
            }
            
            # Get actual camera properties
            if self.camera.isOpened():
                info['actual_width'] = int(self.camera.get(cv2.CAP_PROP_FRAME_WIDTH))
                info['actual_height'] = int(self.camera.get(cv2.CAP_PROP_FRAME_HEIGHT))
                info['actual_fps'] = self.camera.get(cv2.CAP_PROP_FPS)
                info['brightness'] = self.camera.get(cv2.CAP_PROP_BRIGHTNESS)
                info['contrast'] = self.camera.get(cv2.CAP_PROP_CONTRAST)
                info['exposure'] = self.camera.get(cv2.CAP_PROP_EXPOSURE)
            
            return info
            
        except Exception as e:
            logger.error(f"Error getting camera info: {e}")
            return {}
    
    def get_status(self) -> Dict[str, Any]:
        """
        Get camera status.
        
        Returns:
            Dictionary containing camera status
        """
        return {
            'is_running': self.is_running,
            'is_opened': self.camera.isOpened() if self.camera else False,
            'device_index': self.device_index,
            'resolution': self.resolution,
            'fps': self.fps,
            'current_fps': self.current_fps,
            'platform': self.platform
        }
    
    def get_fps(self) -> float:
        """
        Get current camera FPS.
        
        Returns:
            Current FPS value
        """
        return self.current_fps
    
    def __del__(self):
        """Cleanup on deletion."""
        try:
            if self.is_running:
                self.stop()
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")