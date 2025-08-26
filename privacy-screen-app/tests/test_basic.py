"""
Basic tests for Privacy Screen App.

This module contains basic tests to verify the application functionality.
"""

import pytest
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from privacy_screen_app import PrivacyScreenApp


def test_app_initialization():
    """Test that the app can be initialized."""
    try:
        app = PrivacyScreenApp()
        assert app is not None
        assert hasattr(app, 'config')
        assert hasattr(app, 'camera_manager')
        assert hasattr(app, 'face_detector')
        assert hasattr(app, 'gaze_tracker')
        assert hasattr(app, 'screen_protector')
    except Exception as e:
        pytest.fail(f"App initialization failed: {e}")


def test_config_loading():
    """Test that configuration can be loaded."""
    try:
        app = PrivacyScreenApp()
        config = app.config
        
        # Check required sections
        assert 'protection' in config
        assert 'camera' in config
        assert 'face_detection' in config
        assert 'gaze_detection' in config
        
        # Check protection settings
        protection = config['protection']
        assert 'mode' in protection
        assert 'sensitivity' in protection
        assert 'reaction_time' in protection
        
    except Exception as e:
        pytest.fail(f"Configuration loading failed: {e}")


def test_protection_modes():
    """Test that protection modes can be set."""
    try:
        app = PrivacyScreenApp()
        
        # Test setting different protection modes
        modes = ['blur', 'pixelate', 'overlay', 'brightness', 'stealth']
        
        for mode in modes:
            success = app.set_protection_mode(mode)
            assert success, f"Failed to set protection mode: {mode}"
            
    except Exception as e:
        pytest.fail(f"Protection mode setting failed: {e}")


def test_sensitivity_setting():
    """Test that sensitivity can be set."""
    try:
        app = PrivacyScreenApp()
        
        # Test valid sensitivity values
        valid_sensitivities = [0.0, 0.5, 1.0]
        
        for sensitivity in valid_sensitivities:
            success = app.set_sensitivity(sensitivity)
            assert success, f"Failed to set sensitivity: {sensitivity}"
            
        # Test invalid sensitivity values
        invalid_sensitivities = [-0.1, 1.1, "invalid"]
        
        for sensitivity in invalid_sensitivities:
            if isinstance(sensitivity, (int, float)):
                success = app.set_sensitivity(sensitivity)
                assert not success, f"Should not accept invalid sensitivity: {sensitivity}"
                
    except Exception as e:
        pytest.fail(f"Sensitivity setting failed: {e}")


def test_app_status():
    """Test that app status can be retrieved."""
    try:
        app = PrivacyScreenApp()
        
        status = app.get_status()
        assert isinstance(status, dict)
        assert 'is_running' in status
        assert 'is_protected' in status
        assert 'protection_mode' in status
        assert 'sensitivity' in status
        
    except Exception as e:
        pytest.fail(f"Status retrieval failed: {e}")


def test_performance_metrics():
    """Test that performance metrics can be retrieved."""
    try:
        app = PrivacyScreenApp()
        
        metrics = app.get_performance_metrics()
        assert isinstance(metrics, dict)
        assert 'fps' in metrics
        assert 'avg_reaction_time' in metrics
        assert 'cpu_usage' in metrics
        assert 'memory_usage' in metrics
        
    except Exception as e:
        pytest.fail(f"Performance metrics retrieval failed: {e}")


if __name__ == "__main__":
    # Run tests
    pytest.main([__file__])