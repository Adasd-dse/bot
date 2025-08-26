import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../../constants';
import { WallpaperData } from '../../services/WallpaperService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SIZES.spacing.medium * 3) / 2;

interface WallpaperCardProps {
  wallpaper: WallpaperData;
  onPress?: () => void;
  onLike?: () => void;
  onDownload?: () => void;
  isLiked?: boolean;
  showActions?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const WallpaperCard: React.FC<WallpaperCardProps> = ({
  wallpaper,
  onPress,
  onLike,
  onDownload,
  isLiked = false,
  showActions = true,
  size = 'medium',
}) => {
  const getCardDimensions = () => {
    switch (size) {
      case 'small':
        return { width: CARD_WIDTH * 0.8, height: 150 };
      case 'large':
        return { width: CARD_WIDTH * 1.2, height: 250 };
      default:
        return { width: CARD_WIDTH, height: 200 };
    }
  };

  const cardDimensions = getCardDimensions();

  return (
    <TouchableOpacity
      style={[styles.container, cardDimensions]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={{ uri: wallpaper.uri }} style={styles.image} />
      
      {/* Overlay Gradient */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        {/* AI Score Badge */}
        {wallpaper.aiScore && wallpaper.aiScore > 80 && (
          <View style={styles.aiScoreBadge}>
            <Ionicons name="star" size={12} color={COLORS.secondary} />
            <Text style={styles.aiScoreText}>{wallpaper.aiScore}</Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.category} numberOfLines={1}>
            {wallpaper.category}
          </Text>
          
          <View style={styles.tagsContainer}>
            {wallpaper.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          {showActions && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, isLiked && styles.likedButton]}
                onPress={onLike}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={16}
                  color={isLiked ? COLORS.error : COLORS.background}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={onDownload}>
                <Ionicons name="download-outline" size={16} color={COLORS.background} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Time of Day Indicator */}
      {wallpaper.timeOfDay && (
        <View style={styles.timeIndicator}>
          <Ionicons
            name={
              wallpaper.timeOfDay === 'morning' ? 'sunny' :
              wallpaper.timeOfDay === 'afternoon' ? 'partly-sunny' :
              wallpaper.timeOfDay === 'evening' ? 'sunset' : 'moon'
            }
            size={14}
            color={COLORS.secondary}
          />
        </View>
      )}

      {/* Weather Indicator */}
      {wallpaper.weather && (
        <View style={styles.weatherIndicator}>
          <Ionicons
            name={
              wallpaper.weather === 'clear' ? 'sunny' :
              wallpaper.weather === 'rain' ? 'rainy' :
              wallpaper.weather === 'snow' ? 'snow' : 'cloudy'
            }
            size={14}
            color={COLORS.info}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.radius.medium,
    overflow: 'hidden',
    marginBottom: SIZES.spacing.medium,
    elevation: 3,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: COLORS.surface,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: SIZES.spacing.small,
  },
  aiScoreBadge: {
    position: 'absolute',
    top: SIZES.spacing.small,
    right: SIZES.spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: SIZES.spacing.small,
    paddingVertical: SIZES.spacing.tiny,
    borderRadius: SIZES.radius.small,
  },
  aiScoreText: {
    fontSize: SIZES.font.tiny,
    color: COLORS.secondary,
    marginLeft: SIZES.spacing.tiny,
    fontWeight: 'bold',
  },
  content: {
    marginTop: 'auto',
  },
  category: {
    fontSize: SIZES.font.medium,
    fontWeight: 'bold',
    color: COLORS.background,
    marginBottom: SIZES.spacing.tiny,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.spacing.small,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SIZES.spacing.small,
    paddingVertical: SIZES.spacing.tiny,
    borderRadius: SIZES.radius.small,
    marginRight: SIZES.spacing.tiny,
    marginBottom: SIZES.spacing.tiny,
  },
  tagText: {
    fontSize: SIZES.font.tiny,
    color: COLORS.background,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SIZES.spacing.small,
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: SIZES.spacing.small,
    borderRadius: SIZES.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likedButton: {
    backgroundColor: 'rgba(239,68,68,0.8)',
  },
  timeIndicator: {
    position: 'absolute',
    top: SIZES.spacing.small,
    left: SIZES.spacing.small,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: SIZES.spacing.tiny,
    borderRadius: SIZES.radius.round,
  },
  weatherIndicator: {
    position: 'absolute',
    top: SIZES.spacing.small + 30,
    left: SIZES.spacing.small,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: SIZES.spacing.tiny,
    borderRadius: SIZES.radius.round,
  },
});

export default WallpaperCard;