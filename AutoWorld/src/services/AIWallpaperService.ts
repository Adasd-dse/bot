import AsyncStorage from '@react-native-async-storage/async-storage';
import { WallpaperData, WallpaperService } from './WallpaperService';
import { WeatherData, WeatherService } from './WeatherService';
import * as Location from 'expo-location';

export interface AIContext {
  timeOfDay: string;
  weather: WeatherData | null;
  userPreferences: {
    autoChange: boolean;
    timeBased: boolean;
    weatherBased: boolean;
    locationBased: boolean;
    moodBased: boolean;
    aiRecommendations: boolean;
    changeInterval: number;
    categories: string[];
  };
  location: Location.LocationObject | null;
  userActivity?: string;
  mood?: string;
  previousWallpapers?: string[];
}

export interface UserBehaviorData {
  preferredCategories: Record<string, number>; // category -> preference score
  timeBasedPreferences: Record<string, string[]>; // timeOfDay -> preferred categories
  weatherBasedPreferences: Record<string, string[]>; // weather -> preferred categories
  interactionHistory: WallpaperInteraction[];
  averageSessionDuration: number;
  totalWallpapersViewed: number;
  customWallpapersAdded: number;
  lastActiveTime: Date;
}

export interface WallpaperInteraction {
  wallpaperId: string;
  action: 'view' | 'like' | 'dislike' | 'set' | 'skip' | 'share' | 'download';
  timestamp: Date;
  context: {
    timeOfDay: string;
    weather?: string;
    category: string;
  };
  duration?: number; // time spent viewing in seconds
}

export interface AIRecommendation {
  wallpaper: WallpaperData;
  confidence: number; // 0-1
  reasons: string[];
  score: number; // 0-100
  factors: {
    timeOfDay: number;
    weather: number;
    userHistory: number;
    category: number;
    mood: number;
    novelty: number;
  };
}

export class AIWallpaperService {
  private static readonly BEHAVIOR_KEY = '@ai_behavior_data';
  private static readonly INTERACTIONS_KEY = '@wallpaper_interactions';
  private static readonly PREFERENCES_KEY = '@ai_preferences';
  private static readonly MAX_INTERACTIONS = 1000; // Keep last 1000 interactions

  // AI scoring weights for different factors
  private static readonly SCORING_WEIGHTS = {
    timeOfDay: 0.25,
    weather: 0.20,
    userHistory: 0.30,
    category: 0.15,
    mood: 0.10,
  };

  // Time-based preferences mapping
  private static readonly TIME_PREFERENCES = {
    morning: {
      preferredTags: ['bright', 'energetic', 'fresh', 'sunrise', 'nature'],
      preferredCategories: ['Natura', 'Auto'],
      mood: 'energetic',
    },
    afternoon: {
      preferredTags: ['vibrant', 'dynamic', 'clear', 'urban', 'modern'],
      preferredCategories: ['Urban', 'Auto'],
      mood: 'dynamic',
    },
    evening: {
      preferredTags: ['warm', 'sunset', 'golden', 'relaxing', 'atmospheric'],
      preferredCategories: ['Natura', 'Abstract'],
      mood: 'calm',
    },
    night: {
      preferredTags: ['dark', 'moody', 'elegant', 'mysterious', 'peaceful'],
      preferredCategories: ['Abstract', 'Urban'],
      mood: 'peaceful',
    },
  };

  /**
   * Get AI-powered wallpaper recommendation
   */
  static async getRecommendation(context: AIContext): Promise<WallpaperData | null> {
    try {
      const availableWallpapers = await WallpaperService.getDefaultWallpapers();
      if (availableWallpapers.length === 0) return null;

      const userBehavior = await this.getUserBehaviorData();
      const recommendations = await this.scoreWallpapers(availableWallpapers, context, userBehavior);
      
      if (recommendations.length === 0) return null;

      // Select best recommendation with some randomness to avoid monotony
      const topRecommendations = recommendations.slice(0, Math.min(3, recommendations.length));
      const selectedRecommendation = this.selectFromTopRecommendations(topRecommendations);
      
      // Log the interaction
      await this.logInteraction({
        wallpaperId: selectedRecommendation.wallpaper.id,
        action: 'view',
        timestamp: new Date(),
        context: {
          timeOfDay: context.timeOfDay,
          weather: context.weather?.condition,
          category: selectedRecommendation.wallpaper.category,
        },
      });

      return selectedRecommendation.wallpaper;
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      return await WallpaperService.getRandomWallpaper();
    }
  }

  /**
   * Score all wallpapers based on AI factors
   */
  private static async scoreWallpapers(
    wallpapers: WallpaperData[],
    context: AIContext,
    userBehavior: UserBehaviorData
  ): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    for (const wallpaper of wallpapers) {
      const score = await this.calculateWallpaperScore(wallpaper, context, userBehavior);
      if (score.score > 30) { // Only consider wallpapers with decent scores
        recommendations.push(score);
      }
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate comprehensive score for a wallpaper
   */
  private static async calculateWallpaperScore(
    wallpaper: WallpaperData,
    context: AIContext,
    userBehavior: UserBehaviorData
  ): Promise<AIRecommendation> {
    const factors = {
      timeOfDay: this.calculateTimeOfDayScore(wallpaper, context.timeOfDay),
      weather: this.calculateWeatherScore(wallpaper, context.weather),
      userHistory: this.calculateUserHistoryScore(wallpaper, userBehavior),
      category: this.calculateCategoryScore(wallpaper, context.userPreferences),
      mood: this.calculateMoodScore(wallpaper, context),
      novelty: this.calculateNoveltyScore(wallpaper, userBehavior),
    };

    const score = Object.entries(factors).reduce((total, [key, value]) => {
      const weight = this.SCORING_WEIGHTS[key as keyof typeof this.SCORING_WEIGHTS] || 0;
      return total + (value * weight * 100);
    }, 0);

    const confidence = Math.min(score / 100, 1);
    const reasons = this.generateRecommendationReasons(wallpaper, context, factors);

    return {
      wallpaper: {
        ...wallpaper,
        aiScore: Math.round(score),
      },
      confidence,
      reasons,
      score: Math.round(score),
      factors,
    };
  }

  /**
   * Calculate time of day relevance score
   */
  private static calculateTimeOfDayScore(wallpaper: WallpaperData, timeOfDay: string): number {
    if (!timeOfDay) return 0.5;

    const timePrefs = this.TIME_PREFERENCES[timeOfDay as keyof typeof this.TIME_PREFERENCES];
    if (!timePrefs) return 0.5;

    let score = 0;

    // Check if wallpaper matches time-specific preferences
    if (wallpaper.timeOfDay === timeOfDay) {
      score += 0.4;
    }

    // Check preferred categories for this time
    if (timePrefs.preferredCategories.includes(wallpaper.category)) {
      score += 0.3;
    }

    // Check preferred tags for this time
    const tagMatches = wallpaper.tags.filter(tag => 
      timePrefs.preferredTags.some(prefTag => tag.toLowerCase().includes(prefTag.toLowerCase()))
    ).length;
    score += (tagMatches / timePrefs.preferredTags.length) * 0.3;

    return Math.min(score, 1);
  }

  /**
   * Calculate weather relevance score
   */
  private static calculateWeatherScore(wallpaper: WallpaperData, weather: WeatherData | null): number {
    if (!weather) return 0.5;

    let score = 0;

    // Direct weather match
    if (wallpaper.weather === weather.condition.toLowerCase()) {
      score += 0.4;
    }

    // Weather-based tags match
    const weatherTags = WeatherService.getWeatherWallpaperTags(weather);
    const tagMatches = wallpaper.tags.filter(tag => 
      weatherTags.some(weatherTag => tag.toLowerCase().includes(weatherTag.toLowerCase()))
    ).length;
    
    if (weatherTags.length > 0) {
      score += (tagMatches / weatherTags.length) * 0.4;
    }

    // Mood match based on weather
    const weatherMood = WeatherService.getWeatherMood(weather);
    if (wallpaper.mood === weatherMood) {
      score += 0.2;
    }

    return Math.min(score, 1);
  }

  /**
   * Calculate user history relevance score
   */
  private static calculateUserHistoryScore(wallpaper: WallpaperData, userBehavior: UserBehaviorData): number {
    let score = 0;

    // Category preference based on history
    const categoryPreference = userBehavior.preferredCategories[wallpaper.category] || 0;
    score += categoryPreference * 0.4;

    // Penalize recently viewed wallpapers
    const recentInteractions = userBehavior.interactionHistory
      .filter(interaction => {
        const daysSince = (Date.now() - interaction.timestamp.getTime()) / (1000 * 60 * 60 * 24);
        return daysSince < 7; // Last week
      })
      .filter(interaction => interaction.wallpaperId === wallpaper.id);

    if (recentInteractions.length > 0) {
      score -= 0.3; // Reduce score for recently viewed wallpapers
    }

    // Boost score for categories user frequently likes
    const positiveInteractions = userBehavior.interactionHistory.filter(
      interaction => ['like', 'set', 'download'].includes(interaction.action) &&
      interaction.context.category === wallpaper.category
    ).length;

    score += Math.min(positiveInteractions / 10, 0.3);

    return Math.max(0, Math.min(score, 1));
  }

  /**
   * Calculate category preference score
   */
  private static calculateCategoryScore(wallpaper: WallpaperData, userPreferences: AIContext['userPreferences']): number {
    if (!userPreferences.categories.includes(wallpaper.category)) {
      return 0.2; // Low score for non-preferred categories
    }

    const categoryIndex = userPreferences.categories.indexOf(wallpaper.category);
    return 1 - (categoryIndex / userPreferences.categories.length);
  }

  /**
   * Calculate mood relevance score
   */
  private static calculateMoodScore(wallpaper: WallpaperData, context: AIContext): number {
    if (!context.mood && !wallpaper.mood) return 0.5;

    if (context.mood === wallpaper.mood) {
      return 1;
    }

    // Fallback to time-based mood
    const timePrefs = this.TIME_PREFERENCES[context.timeOfDay as keyof typeof this.TIME_PREFERENCES];
    if (timePrefs && wallpaper.mood === timePrefs.mood) {
      return 0.7;
    }

    return 0.3;
  }

  /**
   * Calculate novelty score to avoid monotony
   */
  private static calculateNoveltyScore(wallpaper: WallpaperData, userBehavior: UserBehaviorData): number {
    const totalInteractions = userBehavior.interactionHistory.length;
    if (totalInteractions === 0) return 1;

    const wallpaperInteractions = userBehavior.interactionHistory.filter(
      interaction => interaction.wallpaperId === wallpaper.id
    ).length;

    // Higher novelty score for less viewed wallpapers
    return 1 - (wallpaperInteractions / Math.max(totalInteractions, 10));
  }

  /**
   * Generate human-readable reasons for recommendation
   */
  private static generateRecommendationReasons(
    wallpaper: WallpaperData,
    context: AIContext,
    factors: AIRecommendation['factors']
  ): string[] {
    const reasons: string[] = [];

    if (factors.timeOfDay > 0.7) {
      reasons.push(`Perfect pentru ${context.timeOfDay === 'morning' ? 'dimineață' : 
                   context.timeOfDay === 'afternoon' ? 'după-amiază' : 
                   context.timeOfDay === 'evening' ? 'seară' : 'noapte'}`);
    }

    if (factors.weather > 0.7 && context.weather) {
      reasons.push(`Se potrivește cu vremea: ${context.weather.description}`);
    }

    if (factors.userHistory > 0.7) {
      reasons.push('Bazat pe preferințele tale anterioare');
    }

    if (factors.category > 0.8) {
      reasons.push(`Categoria preferată: ${wallpaper.category}`);
    }

    if (wallpaper.aiScore && wallpaper.aiScore > 90) {
      reasons.push('Recomandat de AI cu încredere mare');
    }

    if (factors.novelty > 0.8) {
      reasons.push('Wallpaper nou pentru tine');
    }

    return reasons.length > 0 ? reasons : ['Recomandare generală AI'];
  }

  /**
   * Select from top recommendations with some randomness
   */
  private static selectFromTopRecommendations(recommendations: AIRecommendation[]): AIRecommendation {
    if (recommendations.length === 1) return recommendations[0];

    // Weighted random selection favoring higher scores
    const weights = recommendations.map((rec, index) => 
      Math.pow(recommendations.length - index, 2)
    );
    
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const random = Math.random() * totalWeight;
    
    let currentWeight = 0;
    for (let i = 0; i < recommendations.length; i++) {
      currentWeight += weights[i];
      if (random <= currentWeight) {
        return recommendations[i];
      }
    }

    return recommendations[0];
  }

  /**
   * Log user interaction with wallpaper
   */
  static async logInteraction(interaction: WallpaperInteraction): Promise<void> {
    try {
      const interactions = await this.getInteractionHistory();
      interactions.push(interaction);

      // Keep only recent interactions
      const recentInteractions = interactions
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, this.MAX_INTERACTIONS);

      await AsyncStorage.setItem(this.INTERACTIONS_KEY, JSON.stringify(recentInteractions));
      
      // Update user behavior data
      await this.updateUserBehaviorData(interaction);
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  }

  /**
   * Get interaction history
   */
  private static async getInteractionHistory(): Promise<WallpaperInteraction[]> {
    try {
      const stored = await AsyncStorage.getItem(this.INTERACTIONS_KEY);
      if (stored) {
        const interactions = JSON.parse(stored);
        return interactions.map((interaction: any) => ({
          ...interaction,
          timestamp: new Date(interaction.timestamp),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting interaction history:', error);
      return [];
    }
  }

  /**
   * Update user behavior data based on interaction
   */
  private static async updateUserBehaviorData(interaction: WallpaperInteraction): Promise<void> {
    try {
      const behaviorData = await this.getUserBehaviorData();
      
      // Update category preferences
      const category = interaction.context.category;
      if (!behaviorData.preferredCategories[category]) {
        behaviorData.preferredCategories[category] = 0;
      }

      // Positive actions increase preference
      if (['like', 'set', 'download', 'share'].includes(interaction.action)) {
        behaviorData.preferredCategories[category] += 0.1;
      }
      // Negative actions decrease preference
      else if (['dislike', 'skip'].includes(interaction.action)) {
        behaviorData.preferredCategories[category] -= 0.05;
      }

      // Normalize preferences
      behaviorData.preferredCategories[category] = Math.max(0, Math.min(1, behaviorData.preferredCategories[category]));

      // Update time-based preferences
      const timeOfDay = interaction.context.timeOfDay;
      if (!behaviorData.timeBasedPreferences[timeOfDay]) {
        behaviorData.timeBasedPreferences[timeOfDay] = [];
      }
      
      if (['like', 'set'].includes(interaction.action) && !behaviorData.timeBasedPreferences[timeOfDay].includes(category)) {
        behaviorData.timeBasedPreferences[timeOfDay].push(category);
      }

      // Update weather-based preferences
      if (interaction.context.weather) {
        const weather = interaction.context.weather;
        if (!behaviorData.weatherBasedPreferences[weather]) {
          behaviorData.weatherBasedPreferences[weather] = [];
        }
        
        if (['like', 'set'].includes(interaction.action) && !behaviorData.weatherBasedPreferences[weather].includes(category)) {
          behaviorData.weatherBasedPreferences[weather].push(category);
        }
      }

      // Update statistics
      behaviorData.totalWallpapersViewed++;
      behaviorData.lastActiveTime = new Date();
      
      // Add to interaction history
      behaviorData.interactionHistory.push(interaction);

      await AsyncStorage.setItem(this.BEHAVIOR_KEY, JSON.stringify(behaviorData));
    } catch (error) {
      console.error('Error updating user behavior data:', error);
    }
  }

  /**
   * Get user behavior data
   */
  private static async getUserBehaviorData(): Promise<UserBehaviorData> {
    try {
      const stored = await AsyncStorage.getItem(this.BEHAVIOR_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return {
          ...data,
          lastActiveTime: new Date(data.lastActiveTime),
          interactionHistory: data.interactionHistory.map((interaction: any) => ({
            ...interaction,
            timestamp: new Date(interaction.timestamp),
          })),
        };
      }
      
      return this.getDefaultBehaviorData();
    } catch (error) {
      console.error('Error getting user behavior data:', error);
      return this.getDefaultBehaviorData();
    }
  }

  /**
   * Get default behavior data for new users
   */
  private static getDefaultBehaviorData(): UserBehaviorData {
    return {
      preferredCategories: {
        'Auto': 0.7,
        'Natura': 0.6,
        'Urban': 0.5,
        'Abstract': 0.4,
      },
      timeBasedPreferences: {},
      weatherBasedPreferences: {},
      interactionHistory: [],
      averageSessionDuration: 0,
      totalWallpapersViewed: 0,
      customWallpapersAdded: 0,
      lastActiveTime: new Date(),
    };
  }

  /**
   * Get AI insights about user preferences
   */
  static async getUserInsights(): Promise<{
    favoriteCategory: string;
    favoriteTimeForChange: string;
    preferredWeather: string;
    activityLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
  }> {
    try {
      const behaviorData = await this.getUserBehaviorData();
      
      const favoriteCategory = Object.entries(behaviorData.preferredCategories)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Auto';

      const favoriteTimeForChange = Object.entries(behaviorData.timeBasedPreferences)
        .sort(([,a], [,b]) => b.length - a.length)[0]?.[0] || 'morning';

      const preferredWeather = Object.entries(behaviorData.weatherBasedPreferences)
        .sort(([,a], [,b]) => b.length - a.length)[0]?.[0] || 'clear';

      const recentInteractions = behaviorData.interactionHistory.filter(interaction => {
        const daysSince = (Date.now() - interaction.timestamp.getTime()) / (1000 * 60 * 60 * 24);
        return daysSince < 7;
      });

      const activityLevel: 'low' | 'medium' | 'high' = 
        recentInteractions.length < 5 ? 'low' :
        recentInteractions.length < 20 ? 'medium' : 'high';

      const recommendations = [
        `Îți plac wallpaper-urile din categoria ${favoriteCategory}`,
        `Schimbi wallpaper-ul cel mai des ${favoriteTimeForChange === 'morning' ? 'dimineața' : 
          favoriteTimeForChange === 'afternoon' ? 'după-amiaza' : 
          favoriteTimeForChange === 'evening' ? 'seara' : 'noaptea'}`,
        `Preferi vremea ${preferredWeather === 'clear' ? 'însorită' : 
          preferredWeather === 'rain' ? 'ploioasă' : 
          preferredWeather === 'clouds' ? 'înorată' : preferredWeather}`,
      ];

      return {
        favoriteCategory,
        favoriteTimeForChange,
        preferredWeather,
        activityLevel,
        recommendations,
      };
    } catch (error) {
      console.error('Error getting user insights:', error);
      return {
        favoriteCategory: 'Auto',
        favoriteTimeForChange: 'morning',
        preferredWeather: 'clear',
        activityLevel: 'low',
        recommendations: ['Începe să explorezi wallpaper-urile pentru a primi recomandări personalizate!'],
      };
    }
  }

  /**
   * Reset AI learning data
   */
  static async resetLearningData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.BEHAVIOR_KEY,
        this.INTERACTIONS_KEY,
        this.PREFERENCES_KEY,
      ]);
    } catch (error) {
      console.error('Error resetting learning data:', error);
    }
  }

  /**
   * Export user data for privacy/debugging
   */
  static async exportUserData(): Promise<{
    behaviorData: UserBehaviorData;
    interactionHistory: WallpaperInteraction[];
  }> {
    try {
      const behaviorData = await this.getUserBehaviorData();
      const interactionHistory = await this.getInteractionHistory();
      
      return {
        behaviorData,
        interactionHistory,
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      return {
        behaviorData: this.getDefaultBehaviorData(),
        interactionHistory: [],
      };
    }
  }

  /**
   * Get wallpaper change recommendation timing
   */
  static async getOptimalChangeTime(): Promise<Date> {
    try {
      const behaviorData = await this.getUserBehaviorData();
      const now = new Date();
      
      // Analyze when user is most active
      const hourlyActivity = new Array(24).fill(0);
      
      behaviorData.interactionHistory.forEach(interaction => {
        const hour = interaction.timestamp.getHours();
        hourlyActivity[hour]++;
      });
      
      // Find peak activity hour
      const peakHour = hourlyActivity.indexOf(Math.max(...hourlyActivity));
      
      const nextChange = new Date(now);
      nextChange.setHours(peakHour, 0, 0, 0);
      
      // If peak hour has passed today, schedule for tomorrow
      if (nextChange <= now) {
        nextChange.setDate(nextChange.getDate() + 1);
      }
      
      return nextChange;
    } catch (error) {
      console.error('Error getting optimal change time:', error);
      const defaultTime = new Date();
      defaultTime.setHours(defaultTime.getHours() + 1);
      return defaultTime;
    }
  }
}