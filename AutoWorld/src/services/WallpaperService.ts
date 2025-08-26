import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export interface WallpaperData {
  id: string;
  uri: string;
  category: string;
  tags: string[];
  timeOfDay?: string;
  weather?: string;
  mood?: string;
  aiScore?: number;
  downloadUrl?: string;
  thumbnailUrl?: string;
  resolution?: string;
  size?: number;
  createdAt?: Date;
}

export interface WallpaperCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  wallpapers: WallpaperData[];
}

export class WallpaperService {
  private static readonly STORAGE_KEY = '@wallpaper_service';
  private static readonly DEFAULT_WALLPAPERS_KEY = '@default_wallpapers';
  private static readonly USER_WALLPAPERS_KEY = '@user_wallpapers';

  // Default wallpaper collections with automotive and general themes
  private static readonly DEFAULT_WALLPAPER_COLLECTIONS: WallpaperCategory[] = [
    {
      id: 'auto',
      name: 'Auto',
      icon: 'car-sport',
      color: '#1E3A8A',
      wallpapers: [
        {
          id: 'auto_1',
          uri: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1080&h=1920&fit=crop',
          category: 'Auto',
          tags: ['super car', 'luxury', 'speed'],
          timeOfDay: 'evening',
          aiScore: 95,
          resolution: '1080x1920',
        },
        {
          id: 'auto_2',
          uri: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1080&h=1920&fit=crop',
          category: 'Auto',
          tags: ['classic', 'vintage', 'style'],
          timeOfDay: 'afternoon',
          aiScore: 88,
          resolution: '1080x1920',
        },
        {
          id: 'auto_3',
          uri: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1080&h=1920&fit=crop',
          category: 'Auto',
          tags: ['sports car', 'modern', 'dynamic'],
          timeOfDay: 'morning',
          aiScore: 92,
          resolution: '1080x1920',
        },
      ],
    },
    {
      id: 'natura',
      name: 'Natura',
      icon: 'leaf',
      color: '#10B981',
      wallpapers: [
        {
          id: 'nature_1',
          uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1920&fit=crop',
          category: 'Natura',
          tags: ['mountains', 'landscape', 'serene'],
          timeOfDay: 'morning',
          weather: 'clear',
          aiScore: 90,
          resolution: '1080x1920',
        },
        {
          id: 'nature_2',
          uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080&h=1920&fit=crop',
          category: 'Natura',
          tags: ['forest', 'trees', 'peaceful'],
          timeOfDay: 'afternoon',
          weather: 'cloudy',
          aiScore: 85,
          resolution: '1080x1920',
        },
        {
          id: 'nature_3',
          uri: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1080&h=1920&fit=crop',
          category: 'Natura',
          tags: ['ocean', 'waves', 'sunset'],
          timeOfDay: 'evening',
          weather: 'clear',
          aiScore: 93,
          resolution: '1080x1920',
        },
      ],
    },
    {
      id: 'urban',
      name: 'Urban',
      icon: 'business',
      color: '#6B7280',
      wallpapers: [
        {
          id: 'urban_1',
          uri: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1080&h=1920&fit=crop',
          category: 'Urban',
          tags: ['city', 'skyline', 'modern'],
          timeOfDay: 'night',
          aiScore: 87,
          resolution: '1080x1920',
        },
        {
          id: 'urban_2',
          uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1080&h=1920&fit=crop',
          category: 'Urban',
          tags: ['architecture', 'buildings', 'perspective'],
          timeOfDay: 'afternoon',
          aiScore: 82,
          resolution: '1080x1920',
        },
        {
          id: 'urban_3',
          uri: 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=1080&h=1920&fit=crop',
          category: 'Urban',
          tags: ['street', 'lights', 'atmosphere'],
          timeOfDay: 'evening',
          aiScore: 89,
          resolution: '1080x1920',
        },
      ],
    },
    {
      id: 'abstract',
      name: 'Abstract',
      icon: 'color-palette',
      color: '#8B5CF6',
      wallpapers: [
        {
          id: 'abstract_1',
          uri: 'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=1080&h=1920&fit=crop',
          category: 'Abstract',
          tags: ['geometric', 'colorful', 'modern'],
          aiScore: 78,
          resolution: '1080x1920',
        },
        {
          id: 'abstract_2',
          uri: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1080&h=1920&fit=crop',
          category: 'Abstract',
          tags: ['gradient', 'smooth', 'minimal'],
          aiScore: 83,
          resolution: '1080x1920',
        },
        {
          id: 'abstract_3',
          uri: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1080&h=1920&fit=crop',
          category: 'Abstract',
          tags: ['pattern', 'artistic', 'unique'],
          aiScore: 80,
          resolution: '1080x1920',
        },
      ],
    },
  ];

  /**
   * Initialize the wallpaper service
   */
  static async initialize(): Promise<void> {
    try {
      const defaultWallpapers = await AsyncStorage.getItem(this.DEFAULT_WALLPAPERS_KEY);
      if (!defaultWallpapers) {
        await AsyncStorage.setItem(
          this.DEFAULT_WALLPAPERS_KEY,
          JSON.stringify(this.DEFAULT_WALLPAPER_COLLECTIONS)
        );
      }
    } catch (error) {
      console.error('Error initializing wallpaper service:', error);
    }
  }

  /**
   * Get default wallpapers collection
   */
  static async getDefaultWallpapers(): Promise<WallpaperData[]> {
    try {
      const stored = await AsyncStorage.getItem(this.DEFAULT_WALLPAPERS_KEY);
      if (stored) {
        const collections: WallpaperCategory[] = JSON.parse(stored);
        return collections.flatMap(category => category.wallpapers);
      }
      return this.DEFAULT_WALLPAPER_COLLECTIONS.flatMap(category => category.wallpapers);
    } catch (error) {
      console.error('Error getting default wallpapers:', error);
      return this.DEFAULT_WALLPAPER_COLLECTIONS.flatMap(category => category.wallpapers);
    }
  }

  /**
   * Get wallpapers by category
   */
  static async getWallpapersByCategory(categoryId: string): Promise<WallpaperData[]> {
    try {
      const wallpapers = await this.getDefaultWallpapers();
      return wallpapers.filter(wallpaper => 
        wallpaper.category.toLowerCase() === categoryId.toLowerCase()
      );
    } catch (error) {
      console.error('Error getting wallpapers by category:', error);
      return [];
    }
  }

  /**
   * Get wallpapers by time of day
   */
  static async getWallpapersByTimeOfDay(timeOfDay: string): Promise<WallpaperData[]> {
    try {
      const wallpapers = await this.getDefaultWallpapers();
      return wallpapers.filter(wallpaper => 
        wallpaper.timeOfDay === timeOfDay
      );
    } catch (error) {
      console.error('Error getting wallpapers by time of day:', error);
      return [];
    }
  }

  /**
   * Get wallpapers by weather condition
   */
  static async getWallpapersByWeather(weather: string): Promise<WallpaperData[]> {
    try {
      const wallpapers = await this.getDefaultWallpapers();
      return wallpapers.filter(wallpaper => 
        wallpaper.weather === weather
      );
    } catch (error) {
      console.error('Error getting wallpapers by weather:', error);
      return [];
    }
  }

  /**
   * Search wallpapers by tags
   */
  static async searchWallpapers(searchTerm: string): Promise<WallpaperData[]> {
    try {
      const wallpapers = await this.getDefaultWallpapers();
      const lowercaseSearch = searchTerm.toLowerCase();
      
      return wallpapers.filter(wallpaper => 
        wallpaper.tags.some(tag => tag.toLowerCase().includes(lowercaseSearch)) ||
        wallpaper.category.toLowerCase().includes(lowercaseSearch)
      );
    } catch (error) {
      console.error('Error searching wallpapers:', error);
      return [];
    }
  }

  /**
   * Get random wallpaper
   */
  static async getRandomWallpaper(): Promise<WallpaperData | null> {
    try {
      const wallpapers = await this.getDefaultWallpapers();
      if (wallpapers.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * wallpapers.length);
      return wallpapers[randomIndex];
    } catch (error) {
      console.error('Error getting random wallpaper:', error);
      return null;
    }
  }

  /**
   * Save user's custom wallpaper
   */
  static async saveCustomWallpaper(wallpaper: WallpaperData): Promise<boolean> {
    try {
      const userWallpapers = await this.getUserWallpapers();
      userWallpapers.push({
        ...wallpaper,
        createdAt: new Date(),
      });
      
      await AsyncStorage.setItem(
        this.USER_WALLPAPERS_KEY,
        JSON.stringify(userWallpapers)
      );
      
      return true;
    } catch (error) {
      console.error('Error saving custom wallpaper:', error);
      return false;
    }
  }

  /**
   * Get user's custom wallpapers
   */
  static async getUserWallpapers(): Promise<WallpaperData[]> {
    try {
      const stored = await AsyncStorage.getItem(this.USER_WALLPAPERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting user wallpapers:', error);
      return [];
    }
  }

  /**
   * Delete user wallpaper
   */
  static async deleteUserWallpaper(wallpaperId: string): Promise<boolean> {
    try {
      const userWallpapers = await this.getUserWallpapers();
      const filteredWallpapers = userWallpapers.filter(w => w.id !== wallpaperId);
      
      await AsyncStorage.setItem(
        this.USER_WALLPAPERS_KEY,
        JSON.stringify(filteredWallpapers)
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting user wallpaper:', error);
      return false;
    }
  }

  /**
   * Download wallpaper to device
   */
  static async downloadWallpaper(wallpaper: WallpaperData): Promise<string | null> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Media library permission denied');
      }

      const fileName = `wallpaper_${wallpaper.id}_${Date.now()}.jpg`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      const downloadResult = await FileSystem.downloadAsync(wallpaper.uri, fileUri);
      
      if (downloadResult.status === 200) {
        // Save to media library
        await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
        return downloadResult.uri;
      }
      
      return null;
    } catch (error) {
      console.error('Error downloading wallpaper:', error);
      return null;
    }
  }

  /**
   * Get wallpaper categories
   */
  static async getCategories(): Promise<WallpaperCategory[]> {
    try {
      const stored = await AsyncStorage.getItem(this.DEFAULT_WALLPAPERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return this.DEFAULT_WALLPAPER_COLLECTIONS;
    } catch (error) {
      console.error('Error getting categories:', error);
      return this.DEFAULT_WALLPAPER_COLLECTIONS;
    }
  }

  /**
   * Get wallpaper by ID
   */
  static async getWallpaperById(id: string): Promise<WallpaperData | null> {
    try {
      const allWallpapers = await this.getDefaultWallpapers();
      const userWallpapers = await this.getUserWallpapers();
      
      const combined = [...allWallpapers, ...userWallpapers];
      return combined.find(w => w.id === id) || null;
    } catch (error) {
      console.error('Error getting wallpaper by ID:', error);
      return null;
    }
  }

  /**
   * Get high-scoring wallpapers (AI recommended)
   */
  static async getHighScoringWallpapers(minScore: number = 85): Promise<WallpaperData[]> {
    try {
      const wallpapers = await this.getDefaultWallpapers();
      return wallpapers
        .filter(wallpaper => wallpaper.aiScore && wallpaper.aiScore >= minScore)
        .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
    } catch (error) {
      console.error('Error getting high-scoring wallpapers:', error);
      return [];
    }
  }

  /**
   * Clear all cached wallpapers
   */
  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.DEFAULT_WALLPAPERS_KEY,
        this.USER_WALLPAPERS_KEY,
        this.STORAGE_KEY,
      ]);
    } catch (error) {
      console.error('Error clearing wallpaper cache:', error);
    }
  }

  /**
   * Get wallpaper statistics
   */
  static async getStatistics(): Promise<{
    totalWallpapers: number;
    userWallpapers: number;
    categories: number;
    averageAiScore: number;
  }> {
    try {
      const defaultWallpapers = await this.getDefaultWallpapers();
      const userWallpapers = await this.getUserWallpapers();
      const categories = await this.getCategories();
      
      const totalAiScore = defaultWallpapers.reduce((sum, w) => sum + (w.aiScore || 0), 0);
      const averageAiScore = totalAiScore / defaultWallpapers.length;
      
      return {
        totalWallpapers: defaultWallpapers.length + userWallpapers.length,
        userWallpapers: userWallpapers.length,
        categories: categories.length,
        averageAiScore: Math.round(averageAiScore),
      };
    } catch (error) {
      console.error('Error getting wallpaper statistics:', error);
      return {
        totalWallpapers: 0,
        userWallpapers: 0,
        categories: 0,
        averageAiScore: 0,
      };
    }
  }
}