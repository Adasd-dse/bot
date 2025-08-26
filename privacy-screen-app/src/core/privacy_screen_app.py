"""
Main Privacy Screen App class.

This class orchestrates all the components of the privacy protection system.
"""

import time
import threading
from typing import Optional, Dict, Any
from loguru import logger
from pathlib import Path

from .face_detector import FaceDetector
from .gaze_tracker import GazeTracker
from .screen_protector import ScreenProtector
from .camera_manager import CameraManager
from ..utils.config_manager import ConfigManager
from ..utils.logger import setup_logging


class PrivacyScreenApp:
    """
    Main application class for Privacy Screen App (SafeView).
    
    This class coordinates all components:
    - Camera management
    - Face detection
    - Gaze tracking
    - Screen protection
    - Configuration management
    """
    
    def __init__(self, config_path: Optional[str] = None):
        """
        Initialize the Privacy Screen App.
        
        Args:
            config_path: Path to configuration file. If None, uses default.
        """
        logger.info("Initializing Privacy Screen App (SafeView)")
        
        # Setup logging
        setup_logging()
        
        # Load configuration
        self.config_manager = ConfigManager(config_path)
        self.config = self.config_manager.get_config()
        
        # Initialize components
        self.camera_manager = CameraManager(self.config['camera'])
        self.face_detector = FaceDetector(self.config['face_detection'])
        self.gaze_tracker = GazeTracker(self.config['gaze_detection'])
        self.screen_protector = ScreenProtector(self.config['protection'])
        
        # Application state
        self.is_running = False
        self.is_protected = False
        self.protection_thread = None
        self.last_face_detected = None
        self.last_gaze_direction = None
        
        # Performance metrics
        self.fps_counter = 0
        self.last_fps_time = time.time()
        self.avg_reaction_time = 0.0
        
        logger.info("Privacy Screen App initialized successfully")
    
    def start_protection(self) -> bool:
        """
        Start the privacy protection system.
        
        Returns:
            True if started successfully, False otherwise
        """
        try:
            logger.info("Starting privacy protection system")
            
            # Start camera
            if not self.camera_manager.start():
                logger.error("Failed to start camera")
                return False
            
            # Start protection loop
            self.is_running = True
            self.protection_thread = threading.Thread(
                target=self._protection_loop,
                daemon=True
            )
            self.protection_thread.start()
            
            logger.info("Privacy protection system started successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to start protection: {e}")
            return False
    
    def stop_protection(self) -> bool:
        """
        Stop the privacy protection system.
        
        Returns:
            True if stopped successfully, False otherwise
        """
        try:
            logger.info("Stopping privacy protection system")
            
            # Stop protection loop
            self.is_running = False
            
            # Wait for thread to finish
            if self.protection_thread and self.protection_thread.is_alive():
                self.protection_thread.join(timeout=2.0)
            
            # Stop camera
            self.camera_manager.stop()
            
            # Remove protection if active
            if self.is_protected:
                self.screen_protector.remove_protection()
                self.is_protected = False
            
            logger.info("Privacy protection system stopped successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to stop protection: {e}")
            return False
    
    def _protection_loop(self):
        """Main protection loop that runs continuously."""
        logger.debug("Starting protection loop")
        
        while self.is_running:
            try:
                start_time = time.time()
                
                # Get camera frame
                frame = self.camera_manager.get_frame()
                if frame is None:
                    time.sleep(0.01)  # 10ms delay
                    continue
                
                # Detect faces
                faces = self.face_detector.detect_faces(frame)
                
                # Track gaze if faces detected
                gaze_direction = None
                if faces:
                    gaze_direction = self.gaze_tracker.track_gaze(frame, faces[0])
                
                # Update protection state
                self._update_protection_state(faces, gaze_direction)
                
                # Calculate performance metrics
                self._update_performance_metrics(start_time)
                
                # Control frame rate
                self._control_frame_rate()
                
            except Exception as e:
                logger.error(f"Error in protection loop: {e}")
                time.sleep(0.1)  # 100ms delay on error
        
        logger.debug("Protection loop stopped")
    
    def _update_protection_state(self, faces: list, gaze_direction: Optional[tuple]):
        """
        Update the protection state based on face detection and gaze tracking.
        
        Args:
            faces: List of detected faces
            gaze_direction: Current gaze direction (x, y)
        """
        # Check if authorized user is present
        user_present = self._is_authorized_user_present(faces, gaze_direction)
        
        # Update protection if needed
        if user_present and self.is_protected:
            # User is present, remove protection
            self.screen_protector.remove_protection()
            self.is_protected = False
            logger.debug("User detected, protection removed")
            
        elif not user_present and not self.is_protected:
            # User not present, apply protection
            self.screen_protector.apply_protection()
            self.is_protected = True
            logger.debug("User not detected, protection applied")
        
        # Update tracking data
        self.last_face_detected = len(faces) > 0
        self.last_gaze_direction = gaze_direction
    
    def _is_authorized_user_present(self, faces: list, gaze_direction: Optional[tuple]) -> bool:
        """
        Determine if an authorized user is present.
        
        Args:
            faces: List of detected faces
            gaze_direction: Current gaze direction
            
        Returns:
            True if authorized user is present, False otherwise
        """
        if not faces:
            return False
        
        # Check if face is recognized (if face recognition is enabled)
        if self.config['face_detection'].get('recognition_enabled', False):
            recognized = self.face_detector.recognize_face(faces[0])
            if not recognized:
                return False
        
        # Check gaze direction if enabled
        if (self.config['gaze_detection']['enabled'] and 
            gaze_direction is not None):
            
            # Check if gaze is within acceptable range
            tolerance = self.config['gaze_detection']['tolerance_degrees']
            if not self.gaze_tracker.is_gaze_valid(gaze_direction, tolerance):
                return False
        
        return True
    
    def _update_performance_metrics(self, start_time: float):
        """
        Update performance metrics.
        
        Args:
            start_time: Start time of the current iteration
        """
        # Calculate reaction time
        reaction_time = (time.time() - start_time) * 1000  # Convert to ms
        
        # Update average reaction time
        if self.avg_reaction_time == 0:
            self.avg_reaction_time = reaction_time
        else:
            self.avg_reaction_time = (self.avg_reaction_time + reaction_time) / 2
        
        # Update FPS counter
        self.fps_counter += 1
        current_time = time.time()
        
        if current_time - self.last_fps_time >= 1.0:
            fps = self.fps_counter / (current_time - self.last_fps_time)
            logger.debug(f"Current FPS: {fps:.1f}, Avg Reaction Time: {self.avg_reaction_time:.1f}ms")
            
            self.fps_counter = 0
            self.last_fps_time = current_time
    
    def _control_frame_rate(self):
        """Control the frame rate to meet performance requirements."""
        target_fps = self.config['camera']['fps']
        target_delay = 1.0 / target_fps
        
        # Simple frame rate control
        time.sleep(max(0, target_delay - 0.001))  # Small buffer
    
    def set_protection_mode(self, mode: str) -> bool:
        """
        Set the protection mode.
        
        Args:
            mode: Protection mode (blur, pixelate, overlay, brightness)
            
        Returns:
            True if mode set successfully, False otherwise
        """
        try:
            self.screen_protector.set_protection_mode(mode)
            self.config_manager.update_config({'protection': {'mode': mode}})
            logger.info(f"Protection mode set to: {mode}")
            return True
        except Exception as e:
            logger.error(f"Failed to set protection mode: {e}")
            return False
    
    def set_sensitivity(self, sensitivity: float) -> bool:
        """
        Set the detection sensitivity.
        
        Args:
            sensitivity: Sensitivity value (0.0 to 1.0)
            
        Returns:
            True if sensitivity set successfully, False otherwise
        """
        try:
            if not 0.0 <= sensitivity <= 1.0:
                raise ValueError("Sensitivity must be between 0.0 and 1.0")
            
            self.config_manager.update_config({'protection': {'sensitivity': sensitivity}})
            self.face_detector.set_sensitivity(sensitivity)
            logger.info(f"Sensitivity set to: {sensitivity}")
            return True
        except Exception as e:
            logger.error(f"Failed to set sensitivity: {e}")
            return False
    
    def get_status(self) -> Dict[str, Any]:
        """
        Get the current application status.
        
        Returns:
            Dictionary containing current status information
        """
        return {
            'is_running': self.is_running,
            'is_protected': self.is_protected,
            'protection_mode': self.screen_protector.current_mode,
            'sensitivity': self.config['protection']['sensitivity'],
            'fps': self.fps_counter,
            'avg_reaction_time': self.avg_reaction_time,
            'face_detected': self.last_face_detected,
            'gaze_direction': self.last_gaze_direction,
            'camera_status': self.camera_manager.get_status()
        }
    
    def get_performance_metrics(self) -> Dict[str, Any]:
        """
        Get performance metrics.
        
        Returns:
            Dictionary containing performance metrics
        """
        return {
            'fps': self.fps_counter,
            'avg_reaction_time': self.avg_reaction_time,
            'cpu_usage': self._get_cpu_usage(),
            'memory_usage': self._get_memory_usage(),
            'camera_fps': self.camera_manager.get_fps()
        }
    
    def _get_cpu_usage(self) -> float:
        """Get current CPU usage percentage."""
        try:
            import psutil
            return psutil.cpu_percent(interval=0.1)
        except ImportError:
            return 0.0
    
    def _get_memory_usage(self) -> float:
        """Get current memory usage in MB."""
        try:
            import psutil
            process = psutil.Process()
            return process.memory_info().rss / 1024 / 1024  # Convert to MB
        except ImportError:
            return 0.0
    
    def __enter__(self):
        """Context manager entry."""
        self.start_protection()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.stop_protection()
    
    def __del__(self):
        """Cleanup on deletion."""
        if self.is_running:
            self.stop_protection()