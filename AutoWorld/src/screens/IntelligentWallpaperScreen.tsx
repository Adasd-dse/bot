import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  Animated,
  Dimensions,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { COLORS, SIZES, FONTS } from '../constants';
import { WallpaperService } from '../services/WallpaperService';
import { WeatherService } from '../services/WeatherService';
import { AIWallpaperService } from '../services/AIWallpaperService';
import WallpaperCard from '../components/wallpaper/WallpaperCard';
import AIInsightsCard from '../components/wallpaper/AIInsightsCard';

const { width, height } = Dimensions.get('window');

interface WallpaperSettings {
  autoChange: boolean;
  timeBased: boolean;
  weatherBased: boolean;
  locationBased: boolean;
  moodBased: boolean;
  aiRecommendations: boolean;
  changeInterval: number;
  categories: string[];
}

interface WallpaperData {
  id: string;
  uri: string;
  category: string;
  tags: string[];
  timeOfDay?: string;
  weather?: string;
  mood?: string;
  aiScore?: number;
}

const IntelligentWallpaperScreen: React.FC = ({ navigation }: any) => {
  const [currentWallpaper, setCurrentWallpaper] = useState<WallpaperData | null>(null);
  const [wallpapers, setWallpapers] = useState<WallpaperData[]>([]);
  const [settings, setSettings] = useState<WallpaperSettings>({
    autoChange: true,
    timeBased: true,
    weatherBased: true,
    locationBased: false,
    moodBased: true,
    aiRecommendations: true,
    changeInterval: 60, // minutes
    categories: ['Auto', 'Natura', 'Urban', 'Abstract'],
  });
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<any>(null);
  const [timeOfDay, setTimeOfDay] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'current' | 'gallery' | 'settings'>('current');
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    initializeWallpaperSystem();
    checkPermissions();
    startPeriodicUpdate();
  }, []);

  const initializeWallpaperSystem = async () => {
    setLoading(true);
    try {
      // Initialize wallpaper collections
      const initialWallpapers = await WallpaperService.getDefaultWallpapers();
      setWallpapers(initialWallpapers);
      
      // Get current time of day
      const currentTimeOfDay = getCurrentTimeOfDay();
      setTimeOfDay(currentTimeOfDay);
      
      // Get weather if enabled
      if (settings.weatherBased) {
        const weatherData = await WeatherService.getCurrentWeather();
        setWeather(weatherData);
      }
      
      // Get AI recommendation
      const recommendedWallpaper = await AIWallpaperService.getRecommendation({
        timeOfDay: currentTimeOfDay,
        weather: weather,
        userPreferences: settings,
        location: null,
      });
      
      setCurrentWallpaper(recommendedWallpaper);
    } catch (error) {
      console.error('Error initializing wallpaper system:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPermissions = async () => {
    if (settings.locationBased) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisiune necesară', 'Pentru wallpaper-uri bazate pe locație, avem nevoie de acces la locație.');
      }
    }
  };

  const startPeriodicUpdate = () => {
    if (settings.autoChange) {
      const interval = setInterval(async () => {
        await updateWallpaperIntelligent();
      }, settings.changeInterval * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  };

  const getCurrentTimeOfDay = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  const updateWallpaperIntelligent = async () => {
    try {
      const context = {
        timeOfDay: getCurrentTimeOfDay(),
        weather: settings.weatherBased ? await WeatherService.getCurrentWeather() : null,
        userPreferences: settings,
        location: settings.locationBased ? await Location.getCurrentPositionAsync() : null,
      };
      
      const newWallpaper = await AIWallpaperService.getRecommendation(context);
      
      if (newWallpaper && newWallpaper.id !== currentWallpaper?.id) {
        await changeWallpaperWithAnimation(newWallpaper);
      }
    } catch (error) {
      console.error('Error updating wallpaper:', error);
    }
  };

  const changeWallpaperWithAnimation = async (newWallpaper: WallpaperData) => {
    // Fade out current wallpaper
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Change wallpaper
      setCurrentWallpaper(newWallpaper);
      
      // Reset and fade in new wallpaper
      scaleAnim.setValue(0.9);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const selectCustomWallpaper = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const customWallpaper: WallpaperData = {
          id: `custom_${Date.now()}`,
          uri: result.assets[0].uri,
          category: 'Custom',
          tags: ['custom', 'user-selected'],
        };
        
        setCurrentWallpaper(customWallpaper);
        setWallpapers(prev => [...prev, customWallpaper]);
      }
    } catch (error) {
      Alert.alert('Eroare', 'Nu am putut încărca imaginea selectată.');
    }
  };

  const toggleSetting = (key: keyof WallpaperSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderCurrentWallpaper = () => (
    <View style={styles.currentWallpaperContainer}>
      <Animated.View
        style={[
          styles.wallpaperPreview,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {currentWallpaper ? (
          <ImageBackground source={{ uri: currentWallpaper.uri }} style={styles.wallpaperImage}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.gradient}
            >
              <View style={styles.wallpaperInfo}>
                <Text style={styles.wallpaperCategory}>{currentWallpaper.category}</Text>
                <Text style={styles.wallpaperTags}>
                  {currentWallpaper.tags?.join(' • ')}
                </Text>
                {currentWallpaper.aiScore && (
                  <View style={styles.aiScoreContainer}>
                    <Ionicons name="star" size={16} color={COLORS.secondary} />
                    <Text style={styles.aiScore}>AI Score: {currentWallpaper.aiScore}%</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </ImageBackground>
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="image-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.placeholderText}>Niciun wallpaper selectat</Text>
          </View>
        )}
      </Animated.View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={selectCustomWallpaper}>
          <Ionicons name="add" size={24} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Adaugă</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={updateWallpaperIntelligent}>
          <Ionicons name="refresh" size={24} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Schimbă</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => {/* Set as wallpaper */}}>
          <Ionicons name="checkmark" size={24} color={COLORS.success} />
          <Text style={styles.actionButtonText}>Aplică</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGallery = () => (
    <ScrollView style={styles.galleryContainer}>
      <View style={styles.galleryGrid}>
        {wallpapers.map((wallpaper) => (
          <WallpaperCard
            key={wallpaper.id}
            wallpaper={wallpaper}
            onPress={() => setCurrentWallpaper(wallpaper)}
            onLike={() => {
              // Log like interaction
              AIWallpaperService.logInteraction({
                wallpaperId: wallpaper.id,
                action: 'like',
                timestamp: new Date(),
                context: {
                  timeOfDay: timeOfDay,
                  weather: weather?.condition,
                  category: wallpaper.category,
                },
              });
            }}
            onDownload={async () => {
              try {
                const downloadPath = await WallpaperService.downloadWallpaper(wallpaper);
                if (downloadPath) {
                  Alert.alert('Succes', 'Wallpaper-ul a fost salvat în galerie!');
                  // Log download interaction
                  AIWallpaperService.logInteraction({
                    wallpaperId: wallpaper.id,
                    action: 'download',
                    timestamp: new Date(),
                    context: {
                      timeOfDay: timeOfDay,
                      weather: weather?.condition,
                      category: wallpaper.category,
                    },
                  });
                } else {
                  Alert.alert('Eroare', 'Nu am putut salva wallpaper-ul.');
                }
              } catch (error) {
                Alert.alert('Eroare', 'Nu am putut salva wallpaper-ul.');
              }
            }}
            size="medium"
          />
        ))}
      </View>
    </ScrollView>
  );

  const renderSettings = () => (
    <ScrollView style={styles.settingsContainer}>
      {/* AI Insights Card */}
      <AIInsightsCard onRefresh={() => {}} />
      
      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Funcții Inteligente</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Schimbare Automată</Text>
            <Text style={styles.settingDescription}>Wallpaper-ul se schimbă automat</Text>
          </View>
          <Switch
            value={settings.autoChange}
            onValueChange={() => toggleSetting('autoChange')}
            trackColor={{ false: COLORS.textLight, true: COLORS.primary }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Bazat pe Timp</Text>
            <Text style={styles.settingDescription}>Schimbă în funcție de ora zilei</Text>
          </View>
          <Switch
            value={settings.timeBased}
            onValueChange={() => toggleSetting('timeBased')}
            trackColor={{ false: COLORS.textLight, true: COLORS.primary }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Bazat pe Vreme</Text>
            <Text style={styles.settingDescription}>Adaptare la condițiile meteo</Text>
          </View>
          <Switch
            value={settings.weatherBased}
            onValueChange={() => toggleSetting('weatherBased')}
            trackColor={{ false: COLORS.textLight, true: COLORS.primary }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Bazat pe Locație</Text>
            <Text style={styles.settingDescription}>Wallpaper-uri relevante pentru locația ta</Text>
          </View>
          <Switch
            value={settings.locationBased}
            onValueChange={() => toggleSetting('locationBased')}
            trackColor={{ false: COLORS.textLight, true: COLORS.primary }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Recomandări AI</Text>
            <Text style={styles.settingDescription}>Inteligența artificială îți recomandă wallpaper-uri</Text>
          </View>
          <Switch
            value={settings.aiRecommendations}
            onValueChange={() => toggleSetting('aiRecommendations')}
            trackColor={{ false: COLORS.textLight, true: COLORS.primary }}
          />
        </View>
      </View>

      {weather && (
        <View style={styles.weatherInfo}>
          <Text style={styles.weatherTitle}>Vreme Curentă</Text>
          <View style={styles.weatherDetails}>
            <Text style={styles.weatherText}>{weather.description}</Text>
            <Text style={styles.weatherTemp}>{weather.temperature}°C</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'current' && styles.activeTab]}
        onPress={() => setActiveTab('current')}
      >
        <Ionicons 
          name="home" 
          size={24} 
          color={activeTab === 'current' ? COLORS.primary : COLORS.textSecondary} 
        />
        <Text style={[styles.tabText, activeTab === 'current' && styles.activeTabText]}>
          Curent
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'gallery' && styles.activeTab]}
        onPress={() => setActiveTab('gallery')}
      >
        <Ionicons 
          name="grid" 
          size={24} 
          color={activeTab === 'gallery' ? COLORS.primary : COLORS.textSecondary} 
        />
        <Text style={[styles.tabText, activeTab === 'gallery' && styles.activeTabText]}>
          Galerie
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
        onPress={() => setActiveTab('settings')}
      >
        <Ionicons 
          name="settings" 
          size={24} 
          color={activeTab === 'settings' ? COLORS.primary : COLORS.textSecondary} 
        />
        <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
          Setări
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.background} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallpaper Inteligent</Text>
        <TouchableOpacity onPress={updateWallpaperIntelligent}>
          <Ionicons name="refresh" size={24} color={COLORS.background} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'current' && renderCurrentWallpaper()}
        {activeTab === 'gallery' && renderGallery()}
        {activeTab === 'settings' && renderSettings()}
      </View>

      {/* Bottom Tabs */}
      {renderTabs()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.spacing.medium,
    paddingVertical: SIZES.spacing.small,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: SIZES.font.xlarge,
    fontWeight: 'bold',
    color: COLORS.background,
    fontFamily: FONTS.bold,
  },
  content: {
    flex: 1,
  },
  currentWallpaperContainer: {
    flex: 1,
    padding: SIZES.spacing.medium,
  },
  wallpaperPreview: {
    flex: 1,
    borderRadius: SIZES.radius.large,
    overflow: 'hidden',
    marginBottom: SIZES.spacing.medium,
  },
  wallpaperImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gradient: {
    paddingHorizontal: SIZES.spacing.medium,
    paddingVertical: SIZES.spacing.large,
  },
  wallpaperInfo: {
    alignItems: 'flex-start',
  },
  wallpaperCategory: {
    fontSize: SIZES.font.large,
    fontWeight: 'bold',
    color: COLORS.background,
    marginBottom: SIZES.spacing.tiny,
  },
  wallpaperTags: {
    fontSize: SIZES.font.medium,
    color: COLORS.background,
    opacity: 0.8,
    marginBottom: SIZES.spacing.small,
  },
  aiScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiScore: {
    fontSize: SIZES.font.small,
    color: COLORS.secondary,
    marginLeft: SIZES.spacing.tiny,
    fontWeight: 'bold',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  placeholderText: {
    fontSize: SIZES.font.medium,
    color: COLORS.textSecondary,
    marginTop: SIZES.spacing.small,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SIZES.spacing.medium,
  },
  actionButton: {
    alignItems: 'center',
    padding: SIZES.spacing.medium,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.large,
    minWidth: 80,
  },
  actionButtonText: {
    fontSize: SIZES.font.small,
    color: COLORS.text,
    marginTop: SIZES.spacing.tiny,
    fontWeight: '500',
  },
  galleryContainer: {
    flex: 1,
    padding: SIZES.spacing.medium,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryItem: {
    width: (width - SIZES.spacing.medium * 3) / 2,
    height: 200,
    marginBottom: SIZES.spacing.medium,
    borderRadius: SIZES.radius.medium,
    overflow: 'hidden',
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  galleryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: SIZES.spacing.small,
  },
  galleryCategory: {
    fontSize: SIZES.font.small,
    color: COLORS.background,
    fontWeight: 'bold',
  },
  galleryAiScore: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.spacing.tiny,
  },
  galleryAiScoreText: {
    fontSize: SIZES.font.tiny,
    color: COLORS.secondary,
    marginLeft: SIZES.spacing.tiny,
  },
  settingsContainer: {
    flex: 1,
    padding: SIZES.spacing.medium,
  },
  settingsSection: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius.medium,
    padding: SIZES.spacing.medium,
    marginBottom: SIZES.spacing.medium,
  },
  settingsTitle: {
    fontSize: SIZES.font.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.spacing.medium,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  settingInfo: {
    flex: 1,
    marginRight: SIZES.spacing.medium,
  },
  settingLabel: {
    fontSize: SIZES.font.medium,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SIZES.spacing.tiny,
  },
  settingDescription: {
    fontSize: SIZES.font.small,
    color: COLORS.textSecondary,
  },
  weatherInfo: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius.medium,
    padding: SIZES.spacing.medium,
  },
  weatherTitle: {
    fontSize: SIZES.font.medium,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.spacing.small,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherText: {
    fontSize: SIZES.font.medium,
    color: COLORS.textSecondary,
  },
  weatherTemp: {
    fontSize: SIZES.font.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingVertical: SIZES.spacing.small,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.spacing.small,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.font.small,
    color: COLORS.textSecondary,
    marginTop: SIZES.spacing.tiny,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default IntelligentWallpaperScreen;