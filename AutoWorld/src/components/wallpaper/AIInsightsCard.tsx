import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../../constants';
import { AIWallpaperService } from '../../services/AIWallpaperService';

interface UserInsights {
  favoriteCategory: string;
  favoriteTimeForChange: string;
  preferredWeather: string;
  activityLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

interface AIInsightsCardProps {
  onRefresh?: () => void;
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ onRefresh }) => {
  const [insights, setInsights] = useState<UserInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const userInsights = await AIWallpaperService.getUserInsights();
      setInsights(userInsights);
    } catch (error) {
      console.error('Error loading AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityLevelIcon = (level: string) => {
    switch (level) {
      case 'high':
        return 'flash';
      case 'medium':
        return 'trending-up';
      default:
        return 'leaf';
    }
  };

  const getActivityLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return COLORS.error;
      case 'medium':
        return COLORS.warning;
      default:
        return COLORS.success;
    }
  };

  const getActivityLevelText = (level: string) => {
    switch (level) {
      case 'high':
        return 'Foarte Activ';
      case 'medium':
        return 'Moderat Activ';
      default:
        return 'Puțin Activ';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'auto':
        return 'car-sport';
      case 'natura':
        return 'leaf';
      case 'urban':
        return 'business';
      case 'abstract':
        return 'color-palette';
      default:
        return 'image';
    }
  };

  const getTimeIcon = (time: string) => {
    switch (time) {
      case 'morning':
        return 'sunny';
      case 'afternoon':
        return 'partly-sunny';
      case 'evening':
        return 'sunset';
      case 'night':
        return 'moon';
      default:
        return 'time';
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather.toLowerCase()) {
      case 'clear':
        return 'sunny';
      case 'rain':
        return 'rainy';
      case 'clouds':
        return 'cloudy';
      case 'snow':
        return 'snow';
      default:
        return 'partly-sunny';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Ionicons name="brain" size={24} color={COLORS.background} />
            <Text style={styles.title}>AI Insights</Text>
          </View>
        </LinearGradient>
        
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass" size={32} color={COLORS.textSecondary} />
          <Text style={styles.loadingText}>Analizez preferințele tale...</Text>
        </View>
      </View>
    );
  }

  if (!insights) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Ionicons name="brain" size={24} color={COLORS.background} />
            <Text style={styles.title}>AI Insights</Text>
          </View>
        </LinearGradient>
        
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={32} color={COLORS.error} />
          <Text style={styles.errorText}>Nu am putut încărca insights-urile</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadInsights}>
            <Text style={styles.retryText}>Încearcă din nou</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="brain" size={24} color={COLORS.background} />
          <Text style={styles.title}>AI Insights</Text>
        </View>
        <TouchableOpacity onPress={() => { loadInsights(); onRefresh?.(); }}>
          <Ionicons name="refresh" size={20} color={COLORS.background} />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons 
                name={getCategoryIcon(insights.favoriteCategory)} 
                size={20} 
                color={COLORS.primary} 
              />
            </View>
            <Text style={styles.statLabel}>Categoria Preferată</Text>
            <Text style={styles.statValue}>{insights.favoriteCategory}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons 
                name={getTimeIcon(insights.favoriteTimeForChange)} 
                size={20} 
                color={COLORS.warning} 
              />
            </View>
            <Text style={styles.statLabel}>Timp Preferat</Text>
            <Text style={styles.statValue}>
              {insights.favoriteTimeForChange === 'morning' ? 'Dimineața' :
               insights.favoriteTimeForChange === 'afternoon' ? 'După-amiaza' :
               insights.favoriteTimeForChange === 'evening' ? 'Seara' : 'Noaptea'}
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons 
                name={getWeatherIcon(insights.preferredWeather)} 
                size={20} 
                color={COLORS.info} 
              />
            </View>
            <Text style={styles.statLabel}>Vreme Preferată</Text>
            <Text style={styles.statValue}>
              {insights.preferredWeather === 'clear' ? 'Însorit' :
               insights.preferredWeather === 'rain' ? 'Ploios' :
               insights.preferredWeather === 'clouds' ? 'Înorat' : insights.preferredWeather}
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={[
              styles.statIconContainer,
              { backgroundColor: `${getActivityLevelColor(insights.activityLevel)}20` }
            ]}>
              <Ionicons 
                name={getActivityLevelIcon(insights.activityLevel)} 
                size={20} 
                color={getActivityLevelColor(insights.activityLevel)} 
              />
            </View>
            <Text style={styles.statLabel}>Nivel Activitate</Text>
            <Text style={[styles.statValue, { color: getActivityLevelColor(insights.activityLevel) }]}>
              {getActivityLevelText(insights.activityLevel)}
            </Text>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="bulb" size={16} color={COLORS.warning} /> Recomandări Personalizate
          </Text>
          
          {insights.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <View style={styles.recommendationIcon}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              </View>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>

        {/* AI Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="star" size={16} color={COLORS.secondary} /> Tips AI
          </Text>
          
          <View style={styles.tipCard}>
            <Ionicons name="time" size={18} color={COLORS.primary} />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Timp Optimal</Text>
              <Text style={styles.tipText}>
                Wallpaper-urile se schimbă cel mai bine în momentele când ești activ pe telefon.
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Ionicons name="cloud" size={18} color={COLORS.info} />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Adaptare Meteo</Text>
              <Text style={styles.tipText}>
                AI-ul selectează wallpaper-uri care se potrivesc cu vremea curentă.
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Ionicons name="heart" size={18} color={COLORS.error} />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Învățare Continuă</Text>
              <Text style={styles.tipText}>
                Cu cât interacționezi mai mult, cu atât recomandările devin mai precise.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius.medium,
    overflow: 'hidden',
    marginVertical: SIZES.spacing.medium,
    elevation: 3,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.spacing.medium,
    paddingVertical: SIZES.spacing.medium,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.font.large,
    fontWeight: 'bold',
    color: COLORS.background,
    marginLeft: SIZES.spacing.small,
  },
  content: {
    maxHeight: 400,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.spacing.xlarge,
  },
  loadingText: {
    fontSize: SIZES.font.medium,
    color: COLORS.textSecondary,
    marginTop: SIZES.spacing.small,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.spacing.xlarge,
  },
  errorText: {
    fontSize: SIZES.font.medium,
    color: COLORS.error,
    marginTop: SIZES.spacing.small,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.spacing.medium,
    paddingVertical: SIZES.spacing.small,
    borderRadius: SIZES.radius.small,
    marginTop: SIZES.spacing.medium,
  },
  retryText: {
    color: COLORS.background,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SIZES.spacing.medium,
    gap: SIZES.spacing.small,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.small,
    padding: SIZES.spacing.medium,
    alignItems: 'center',
  },
  statIconContainer: {
    backgroundColor: `${COLORS.primary}20`,
    padding: SIZES.spacing.small,
    borderRadius: SIZES.radius.round,
    marginBottom: SIZES.spacing.small,
  },
  statLabel: {
    fontSize: SIZES.font.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.spacing.tiny,
  },
  statValue: {
    fontSize: SIZES.font.medium,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  recommendationsSection: {
    padding: SIZES.spacing.medium,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: SIZES.font.medium,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.spacing.medium,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.spacing.small,
  },
  recommendationIcon: {
    marginRight: SIZES.spacing.small,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: SIZES.font.medium,
    color: COLORS.text,
    lineHeight: 20,
  },
  tipsSection: {
    padding: SIZES.spacing.medium,
    paddingTop: 0,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.small,
    padding: SIZES.spacing.medium,
    marginBottom: SIZES.spacing.small,
  },
  tipContent: {
    flex: 1,
    marginLeft: SIZES.spacing.small,
  },
  tipTitle: {
    fontSize: SIZES.font.medium,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.spacing.tiny,
  },
  tipText: {
    fontSize: SIZES.font.small,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

export default AIInsightsCard;