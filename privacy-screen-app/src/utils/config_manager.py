"""
Configuration management module.

This module handles loading, saving, and updating configuration files
for the Privacy Screen App.
"""

import yaml
import json
from typing import Dict, Any, Optional, Union
from pathlib import Path
from loguru import logger
import os


class ConfigManager:
    """
    Configuration manager for Privacy Screen App.
    
    Handles loading, saving, and updating configuration files in YAML format.
    Provides validation and default value management.
    """
    
    def __init__(self, config_path: Optional[str] = None):
        """
        Initialize the configuration manager.
        
        Args:
            config_path: Path to configuration file. If None, uses default.
        """
        self.config_path = self._resolve_config_path(config_path)
        self.config = {}
        self.default_config = self._get_default_config()
        
        # Load configuration
        self.load_config()
        
        logger.info(f"Configuration manager initialized with: {self.config_path}")
    
    def _resolve_config_path(self, config_path: Optional[str]) -> Path:
        """
        Resolve the configuration file path.
        
        Args:
            config_path: User-specified config path or None
            
        Returns:
            Resolved configuration file path
        """
        if config_path:
            return Path(config_path)
        
        # Default config locations
        default_paths = [
            Path("config/settings.yaml"),
            Path("~/.privacy_screen_app/config.yaml").expanduser(),
            Path("/etc/privacy_screen_app/config.yaml")
        ]
        
        # Find first existing config file
        for path in default_paths:
            if path.exists():
                return path
        
        # Return default path if none exist
        return default_paths[0]
    
    def _get_default_config(self) -> Dict[str, Any]:
        """
        Get default configuration values.
        
        Returns:
            Dictionary containing default configuration
        """
        return {
            'protection': {
                'mode': 'blur',
                'sensitivity': 0.8,
                'reaction_time': 200,
                'blur_intensity': 15,
                'pixel_block_size': 20,
                'brightness_reduction': 0.7,
                'overlay_opacity': 0.8
            },
            'camera': {
                'device_index': 0,
                'resolution': '720p',
                'fps': 30,
                'flip_horizontal': True,
                'auto_focus': True
            },
            'face_detection': {
                'confidence_threshold': 0.7,
                'tracking_enabled': True,
                'max_faces': 5,
                'model': 'hog',
                'recognition_tolerance': 0.6
            },
            'gaze_detection': {
                'enabled': True,
                'precision': 0.8,
                'tolerance_degrees': 15,
                'calibration_points': 9
            },
            'performance': {
                'max_cpu_usage': 0.3,
                'battery_optimization': True,
                'power_saving': False,
                'memory_limit': 100,
                'gpu_acceleration': True
            },
            'security': {
                'stealth_mode': False,
                'local_processing': True,
                'encrypt_data': True,
                'auto_lock_timeout': 300,
                'require_auth': False
            },
            'ui': {
                'theme': 'auto',
                'language': 'auto',
                'show_status': True,
                'minimize_to_tray': True,
                'start_with_boot': False,
                'show_notifications': True
            },
            'logging': {
                'level': 'INFO',
                'log_to_file': True,
                'log_file': 'logs/privacy_screen.log',
                'max_log_size': 10,
                'log_rotation': True
            }
        }
    
    def load_config(self) -> bool:
        """
        Load configuration from file.
        
        Returns:
            True if config loaded successfully, False otherwise
        """
        try:
            if self.config_path.exists():
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    file_config = yaml.safe_load(f)
                
                if file_config:
                    # Merge with defaults
                    self.config = self._merge_configs(self.default_config, file_config)
                    logger.info(f"Configuration loaded from: {self.config_path}")
                    return True
                else:
                    logger.warning("Configuration file is empty, using defaults")
                    self.config = self.default_config.copy()
                    return True
            else:
                logger.info("Configuration file not found, creating with defaults")
                self.config = self.default_config.copy()
                return self.save_config()
                
        except Exception as e:
            logger.error(f"Failed to load configuration: {e}")
            logger.info("Using default configuration")
            self.config = self.default_config.copy()
            return False
    
    def save_config(self) -> bool:
        """
        Save current configuration to file.
        
        Returns:
            True if config saved successfully, False otherwise
        """
        try:
            # Create directory if it doesn't exist
            self.config_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(self.config_path, 'w', encoding='utf-8') as f:
                yaml.dump(self.config, f, default_flow_style=False, indent=2, allow_unicode=True)
            
            logger.info(f"Configuration saved to: {self.config_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to save configuration: {e}")
            return False
    
    def _merge_configs(self, default: Dict[str, Any], user: Dict[str, Any]) -> Dict[str, Any]:
        """
        Merge user configuration with defaults.
        
        Args:
            default: Default configuration
            user: User configuration
            
        Returns:
            Merged configuration
        """
        merged = default.copy()
        
        def merge_dict(base: Dict[str, Any], update: Dict[str, Any]):
            for key, value in update.items():
                if key in base and isinstance(base[key], dict) and isinstance(value, dict):
                    merge_dict(base[key], value)
                else:
                    base[key] = value
        
        merge_dict(merged, user)
        return merged
    
    def get_config(self) -> Dict[str, Any]:
        """
        Get current configuration.
        
        Returns:
            Current configuration dictionary
        """
        return self.config.copy()
    
    def get_section(self, section: str) -> Dict[str, Any]:
        """
        Get configuration section.
        
        Args:
            section: Configuration section name
            
        Returns:
            Configuration section dictionary
        """
        return self.config.get(section, {}).copy()
    
    def get_value(self, key_path: str, default: Any = None) -> Any:
        """
        Get configuration value by key path.
        
        Args:
            key_path: Dot-separated key path (e.g., 'protection.mode')
            default: Default value if key not found
            
        Returns:
            Configuration value or default
        """
        try:
            keys = key_path.split('.')
            value = self.config
            
            for key in keys:
                value = value[key]
            
            return value
            
        except (KeyError, TypeError):
            return default
    
    def set_value(self, key_path: str, value: Any) -> bool:
        """
        Set configuration value by key path.
        
        Args:
            key_path: Dot-separated key path (e.g., 'protection.mode')
            value: Value to set
            
        Returns:
            True if value set successfully, False otherwise
        """
        try:
            keys = key_path.split('.')
            config = self.config
            
            # Navigate to parent of target key
            for key in keys[:-1]:
                if key not in config:
                    config[key] = {}
                config = config[key]
            
            # Set the value
            config[keys[-1]] = value
            
            logger.debug(f"Configuration value set: {key_path} = {value}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to set configuration value: {e}")
            return False
    
    def update_config(self, updates: Dict[str, Any]) -> bool:
        """
        Update configuration with multiple values.
        
        Args:
            updates: Dictionary of configuration updates
            
        Returns:
            True if updates applied successfully, False otherwise
        """
        try:
            success = True
            
            for key_path, value in updates.items():
                if not self.set_value(key_path, value):
                    success = False
            
            if success:
                logger.info("Configuration updated successfully")
                return self.save_config()
            
            return False
            
        except Exception as e:
            logger.error(f"Failed to update configuration: {e}")
            return False
    
    def reset_to_defaults(self) -> bool:
        """
        Reset configuration to default values.
        
        Returns:
            True if reset successful, False otherwise
        """
        try:
            logger.info("Resetting configuration to defaults")
            
            self.config = self.default_config.copy()
            return self.save_config()
            
        except Exception as e:
            logger.error(f"Failed to reset configuration: {e}")
            return False
    
    def validate_config(self) -> Dict[str, Any]:
        """
        Validate current configuration.
        
        Returns:
            Dictionary containing validation results
        """
        validation_results = {
            'valid': True,
            'errors': [],
            'warnings': []
        }
        
        try:
            # Validate protection settings
            protection = self.config.get('protection', {})
            
            if 'sensitivity' in protection:
                sensitivity = protection['sensitivity']
                if not 0.0 <= sensitivity <= 1.0:
                    validation_results['errors'].append(
                        f"Protection sensitivity must be between 0.0 and 1.0, got {sensitivity}"
                    )
                    validation_results['valid'] = False
            
            if 'reaction_time' in protection:
                reaction_time = protection['reaction_time']
                if not 50 <= reaction_time <= 1000:
                    validation_results['warnings'].append(
                        f"Reaction time {reaction_time}ms may be too slow for real-time protection"
                    )
            
            # Validate camera settings
            camera = self.config.get('camera', {})
            
            if 'fps' in camera:
                fps = camera['fps']
                if not 1 <= fps <= 60:
                    validation_results['errors'].append(
                        f"Camera FPS must be between 1 and 60, got {fps}"
                    )
                    validation_results['valid'] = False
            
            # Validate performance settings
            performance = self.config.get('performance', {})
            
            if 'max_cpu_usage' in performance:
                cpu_usage = performance['max_cpu_usage']
                if not 0.1 <= cpu_usage <= 1.0:
                    validation_results['warnings'].append(
                        f"Max CPU usage {cpu_usage} may be too restrictive"
                    )
            
            logger.info(f"Configuration validation completed: {validation_results['valid']}")
            return validation_results
            
        except Exception as e:
            logger.error(f"Configuration validation failed: {e}")
            validation_results['valid'] = False
            validation_results['errors'].append(f"Validation error: {e}")
            return validation_results
    
    def export_config(self, format: str = 'yaml', file_path: Optional[str] = None) -> bool:
        """
        Export configuration to file.
        
        Args:
            format: Export format ('yaml', 'json')
            file_path: Output file path (uses config_path if None)
            
        Returns:
            True if export successful, False otherwise
        """
        try:
            if file_path is None:
                file_path = self.config_path
            
            output_path = Path(file_path)
            
            if format.lower() == 'json':
                with open(output_path, 'w', encoding='utf-8') as f:
                    json.dump(self.config, f, indent=2, ensure_ascii=False)
            else:  # yaml
                with open(output_path, 'w', encoding='utf-8') as f:
                    yaml.dump(self.config, f, default_flow_style=False, indent=2, allow_unicode=True)
            
            logger.info(f"Configuration exported to: {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to export configuration: {e}")
            return False
    
    def import_config(self, file_path: str) -> bool:
        """
        Import configuration from file.
        
        Args:
            file_path: Path to configuration file to import
            
        Returns:
            True if import successful, False otherwise
        """
        try:
            import_path = Path(file_path)
            
            if not import_path.exists():
                logger.error(f"Import file not found: {import_path}")
                return False
            
            # Load imported config
            with open(import_path, 'r', encoding='utf-8') as f:
                if import_path.suffix.lower() == '.json':
                    imported_config = json.load(f)
                else:
                    imported_config = yaml.safe_load(f)
            
            if not imported_config:
                logger.error("Imported configuration is empty")
                return False
            
            # Validate imported config
            validation = self._validate_imported_config(imported_config)
            if not validation['valid']:
                logger.error(f"Imported configuration validation failed: {validation['errors']}")
                return False
            
            # Merge with current config
            self.config = self._merge_configs(self.config, imported_config)
            
            # Save merged config
            if self.save_config():
                logger.info(f"Configuration imported from: {import_path}")
                return True
            else:
                logger.error("Failed to save imported configuration")
                return False
                
        except Exception as e:
            logger.error(f"Failed to import configuration: {e}")
            return False
    
    def _validate_imported_config(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate imported configuration.
        
        Args:
            config: Configuration to validate
            
        Returns:
            Validation results
        """
        validation_results = {
            'valid': True,
            'errors': []
        }
        
        try:
            # Basic structure validation
            required_sections = ['protection', 'camera', 'face_detection']
            
            for section in required_sections:
                if section not in config:
                    validation_results['errors'].append(f"Missing required section: {section}")
                    validation_results['valid'] = False
            
            # Type validation for critical values
            if 'protection' in config:
                protection = config['protection']
                if 'sensitivity' in protection and not isinstance(protection['sensitivity'], (int, float)):
                    validation_results['errors'].append("Protection sensitivity must be numeric")
                    validation_results['valid'] = False
            
            return validation_results
            
        except Exception as e:
            validation_results['valid'] = False
            validation_results['errors'].append(f"Validation error: {e}")
            return validation_results
    
    def get_config_info(self) -> Dict[str, Any]:
        """
        Get configuration information.
        
        Returns:
            Dictionary containing configuration information
        """
        return {
            'config_path': str(self.config_path),
            'config_exists': self.config_path.exists(),
            'sections': list(self.config.keys()),
            'total_keys': self._count_config_keys(self.config),
            'last_modified': self.config_path.stat().st_mtime if self.config_path.exists() else None
        }
    
    def _count_config_keys(self, config: Dict[str, Any]) -> int:
        """Count total number of configuration keys."""
        count = 0
        for key, value in config.items():
            count += 1
            if isinstance(value, dict):
                count += self._count_config_keys(value)
        return count