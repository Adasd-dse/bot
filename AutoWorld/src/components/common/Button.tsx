import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: SIZES.radius.medium,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      ...(fullWidth && { width: '100%' }),
    };

    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingVertical: SIZES.spacing.small,
        paddingHorizontal: SIZES.spacing.medium,
        minHeight: 36,
      },
      medium: {
        paddingVertical: SIZES.spacing.medium,
        paddingHorizontal: SIZES.spacing.large,
        minHeight: 48,
      },
      large: {
        paddingVertical: SIZES.spacing.large,
        paddingHorizontal: SIZES.spacing.xlarge,
        minHeight: 56,
      },
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: COLORS.primary,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: COLORS.secondary,
        borderWidth: 0,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
      danger: {
        backgroundColor: COLORS.error,
        borderWidth: 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(disabled && { opacity: 0.5 }),
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontFamily: FONTS.medium,
      textAlign: 'center',
    };

    const sizeTextStyles: Record<string, TextStyle> = {
      small: {
        fontSize: SIZES.font.small,
      },
      medium: {
        fontSize: SIZES.font.medium,
      },
      large: {
        fontSize: SIZES.font.large,
      },
    };

    const variantTextStyles: Record<string, TextStyle> = {
      primary: {
        color: COLORS.background,
      },
      secondary: {
        color: COLORS.background,
      },
      outline: {
        color: COLORS.primary,
      },
      ghost: {
        color: COLORS.primary,
      },
      danger: {
        color: COLORS.background,
      },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
      ...textStyle,
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.background}
          size="small"
        />
      ) : (
        <>
          {icon && icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Stilurile sunt definite inline pentru flexibilitate
});

export default Button;