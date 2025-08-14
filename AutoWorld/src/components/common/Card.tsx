import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SIZES } from '../../constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  elevation?: number;
  padding?: number;
  margin?: number;
  borderRadius?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  disabled = false,
  elevation = 2,
  padding = SIZES.cardPadding,
  margin = SIZES.cardMargin,
  borderRadius = SIZES.cardRadius,
  backgroundColor = COLORS.card,
  borderColor = 'transparent',
  borderWidth = 0,
}) => {
  const cardStyle: ViewStyle = {
    backgroundColor,
    borderRadius,
    padding,
    margin,
    borderColor,
    borderWidth,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: elevation,
    },
    shadowOpacity: 0.1,
    shadowRadius: elevation * 2,
    elevation: elevation,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[cardStyle, style]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  // Stilurile sunt definite inline pentru flexibilitate
});

export default Card;