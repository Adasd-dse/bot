import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants';

interface HeaderProps {
  title: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
  elevation?: number;
}

const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  showBackButton = false,
  onBackPress,
  subtitle,
  backgroundColor = COLORS.background,
  textColor = COLORS.text,
  elevation = 0,
}) => {
  const renderLeftButton = () => {
    if (showBackButton) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
      );
    }

    if (leftIcon) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onLeftPress}
          activeOpacity={0.7}
        >
          <Ionicons name={leftIcon as any} size={24} color={textColor} />
        </TouchableOpacity>
      );
    }

    return <View style={styles.iconButton} />;
  };

  const renderRightButton = () => {
    if (rightIcon) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onRightPress}
          activeOpacity={0.7}
        >
          <Ionicons name={rightIcon as any} size={24} color={textColor} />
        </TouchableOpacity>
      );
    }

    return <View style={styles.iconButton} />;
  };

  return (
    <>
      <StatusBar
        barStyle={textColor === COLORS.background ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor,
            elevation,
            shadowOpacity: elevation > 0 ? 0.1 : 0,
            shadowRadius: elevation > 0 ? elevation * 2 : 0,
          },
        ]}
      >
        {renderLeftButton()}
        
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              { color: textColor },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: textColor === COLORS.background ? COLORS.textLight : COLORS.textSecondary },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {renderRightButton()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: SIZES.headerHeight,
    paddingHorizontal: SIZES.spacing.medium,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.spacing.medium,
  },
  title: {
    fontSize: SIZES.font.large,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default Header;