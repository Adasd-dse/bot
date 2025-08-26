import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  icon: string;
  location: {
    city: string;
    country: string;
    lat: number;
    lon: number;
  };
  sunrise: Date;
  sunset: Date;
  lastUpdated: Date;
}

export interface WeatherCondition {
  id: string;
  main: string;
  description: string;
  icon: string;
  wallpaperTags: string[];
  mood: 'energetic' | 'calm' | 'dramatic' | 'peaceful' | 'dynamic';
}

export class WeatherService {
  private static readonly API_KEY = 'demo_key'; // In production, use environment variable
  private static readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';
  private static readonly CACHE_KEY = '@weather_cache';
  private static readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  // Weather condition mappings for wallpaper recommendations
  private static readonly WEATHER_CONDITIONS: Record<string, WeatherCondition> = {
    'clear': {
      id: 'clear',
      main: 'Clear',
      description: 'Clear sky',
      icon: 'sunny',
      wallpaperTags: ['bright', 'sunny', 'clear', 'vibrant'],
      mood: 'energetic',
    },
    'clouds': {
      id: 'clouds',
      main: 'Clouds',
      description: 'Cloudy',
      icon: 'cloudy',
      wallpaperTags: ['cloudy', 'soft', 'gentle', 'muted'],
      mood: 'calm',
    },
    'rain': {
      id: 'rain',
      main: 'Rain',
      description: 'Rainy',
      icon: 'rainy',
      wallpaperTags: ['rain', 'moody', 'dramatic', 'water'],
      mood: 'dramatic',
    },
    'snow': {
      id: 'snow',
      main: 'Snow',
      description: 'Snowy',
      icon: 'snow',
      wallpaperTags: ['snow', 'winter', 'cold', 'peaceful', 'white'],
      mood: 'peaceful',
    },
    'thunderstorm': {
      id: 'thunderstorm',
      main: 'Thunderstorm',
      description: 'Thunderstorm',
      icon: 'thunderstorm',
      wallpaperTags: ['storm', 'dramatic', 'powerful', 'dark'],
      mood: 'dramatic',
    },
    'fog': {
      id: 'fog',
      main: 'Fog',
      description: 'Foggy',
      icon: 'fog',
      wallpaperTags: ['misty', 'mysterious', 'soft', 'atmospheric'],
      mood: 'calm',
    },
    'wind': {
      id: 'wind',
      main: 'Wind',
      description: 'Windy',
      icon: 'windy',
      wallpaperTags: ['dynamic', 'movement', 'energetic', 'flowing'],
      mood: 'dynamic',
    },
  };

  /**
   * Get current weather data
   */
  static async getCurrentWeather(): Promise<WeatherData | null> {
    try {
      // Check cache first
      const cached = await this.getCachedWeather();
      if (cached && this.isCacheValid(cached.lastUpdated)) {
        return cached;
      }

      // Get location
      const location = await this.getCurrentLocation();
      if (!location) {
        return this.getMockWeatherData();
      }

      // Fetch weather data
      const weatherData = await this.fetchWeatherData(location.latitude, location.longitude);
      
      if (weatherData) {
        await this.cacheWeatherData(weatherData);
      }

      return weatherData || this.getMockWeatherData();
    } catch (error) {
      console.error('Error getting current weather:', error);
      return this.getMockWeatherData();
    }
  }

  /**
   * Get current location
   */
  private static async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission denied');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  }

  /**
   * Fetch weather data from API
   */
  private static async fetchWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
    try {
      // In a real implementation, you would use a proper API key
      // For demo purposes, we'll return mock data based on location
      return this.getMockWeatherData();
      
      /* Real API implementation would look like this:
      const response = await fetch(
        `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather API request failed');
      }

      const data = await response.json();
      return this.parseWeatherResponse(data);
      */
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  /**
   * Parse weather API response
   */
  private static parseWeatherResponse(data: any): WeatherData {
    const condition = data.weather[0].main.toLowerCase();
    const weatherCondition = this.WEATHER_CONDITIONS[condition] || this.WEATHER_CONDITIONS['clear'];

    return {
      temperature: Math.round(data.main.temp),
      condition: weatherCondition.main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind?.speed || 0,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      uvIndex: 0, // Would need separate API call
      icon: weatherCondition.icon,
      location: {
        city: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      lastUpdated: new Date(),
    };
  }

  /**
   * Get mock weather data for demo purposes
   */
  private static getMockWeatherData(): WeatherData {
    const conditions = Object.keys(this.WEATHER_CONDITIONS);
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const weatherCondition = this.WEATHER_CONDITIONS[randomCondition];
    
    const now = new Date();
    const sunrise = new Date(now);
    sunrise.setHours(6, 30, 0, 0);
    const sunset = new Date(now);
    sunset.setHours(19, 45, 0, 0);

    return {
      temperature: Math.floor(Math.random() * 30) + 5, // 5-35°C
      condition: weatherCondition.main,
      description: weatherCondition.description,
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.random() * 20, // 0-20 m/s
      pressure: Math.floor(Math.random() * 100) + 1000, // 1000-1100 hPa
      visibility: Math.random() * 10 + 5, // 5-15 km
      uvIndex: Math.floor(Math.random() * 11), // 0-10
      icon: weatherCondition.icon,
      location: {
        city: 'București',
        country: 'RO',
        lat: 44.4268,
        lon: 26.1025,
      },
      sunrise,
      sunset,
      lastUpdated: new Date(),
    };
  }

  /**
   * Get weather condition details
   */
  static getWeatherCondition(conditionName: string): WeatherCondition | null {
    const condition = conditionName.toLowerCase();
    return this.WEATHER_CONDITIONS[condition] || null;
  }

  /**
   * Get wallpaper tags based on weather
   */
  static getWeatherWallpaperTags(weather: WeatherData): string[] {
    const condition = this.getWeatherCondition(weather.condition);
    if (!condition) return [];

    const baseTags = condition.wallpaperTags;
    const additionalTags: string[] = [];

    // Add temperature-based tags
    if (weather.temperature < 5) {
      additionalTags.push('cold', 'winter');
    } else if (weather.temperature > 25) {
      additionalTags.push('warm', 'summer');
    }

    // Add time-based tags
    const now = new Date();
    if (now < weather.sunrise || now > weather.sunset) {
      additionalTags.push('night', 'dark');
    } else {
      additionalTags.push('day', 'bright');
    }

    // Add humidity-based tags
    if (weather.humidity > 70) {
      additionalTags.push('humid', 'tropical');
    } else if (weather.humidity < 30) {
      additionalTags.push('dry', 'arid');
    }

    return [...baseTags, ...additionalTags];
  }

  /**
   * Get weather mood for wallpaper selection
   */
  static getWeatherMood(weather: WeatherData): string {
    const condition = this.getWeatherCondition(weather.condition);
    return condition?.mood || 'calm';
  }

  /**
   * Check if weather is suitable for outdoor automotive activities
   */
  static isGoodForAutomotiveActivities(weather: WeatherData): boolean {
    const badConditions = ['rain', 'thunderstorm', 'snow'];
    return !badConditions.includes(weather.condition.toLowerCase()) &&
           weather.temperature > 0 &&
           weather.windSpeed < 15;
  }

  /**
   * Get weather forecast (mock implementation)
   */
  static async getWeatherForecast(days: number = 5): Promise<WeatherData[]> {
    try {
      const forecast: WeatherData[] = [];
      const currentWeather = await this.getCurrentWeather();
      
      if (!currentWeather) return [];

      for (let i = 0; i < days; i++) {
        const forecastDate = new Date();
        forecastDate.setDate(forecastDate.getDate() + i);
        
        // Generate slight variations for forecast
        const tempVariation = (Math.random() - 0.5) * 10;
        const weatherData: WeatherData = {
          ...currentWeather,
          temperature: Math.round(currentWeather.temperature + tempVariation),
          lastUpdated: forecastDate,
        };
        
        // Randomize conditions for variety
        if (Math.random() > 0.7) {
          const conditions = Object.keys(this.WEATHER_CONDITIONS);
          const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
          const condition = this.WEATHER_CONDITIONS[randomCondition];
          weatherData.condition = condition.main;
          weatherData.description = condition.description;
          weatherData.icon = condition.icon;
        }
        
        forecast.push(weatherData);
      }
      
      return forecast;
    } catch (error) {
      console.error('Error getting weather forecast:', error);
      return [];
    }
  }

  /**
   * Cache weather data
   */
  private static async cacheWeatherData(weather: WeatherData): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(weather));
    } catch (error) {
      console.error('Error caching weather data:', error);
    }
  }

  /**
   * Get cached weather data
   */
  private static async getCachedWeather(): Promise<WeatherData | null> {
    try {
      const cached = await AsyncStorage.getItem(this.CACHE_KEY);
      if (cached) {
        const weatherData = JSON.parse(cached);
        // Convert date strings back to Date objects
        weatherData.sunrise = new Date(weatherData.sunrise);
        weatherData.sunset = new Date(weatherData.sunset);
        weatherData.lastUpdated = new Date(weatherData.lastUpdated);
        return weatherData;
      }
      return null;
    } catch (error) {
      console.error('Error getting cached weather:', error);
      return null;
    }
  }

  /**
   * Check if cached data is still valid
   */
  private static isCacheValid(lastUpdated: Date): boolean {
    const now = new Date();
    return (now.getTime() - lastUpdated.getTime()) < this.CACHE_DURATION;
  }

  /**
   * Clear weather cache
   */
  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.error('Error clearing weather cache:', error);
    }
  }

  /**
   * Get weather icon name for UI
   */
  static getWeatherIconName(condition: string): string {
    const weather = this.getWeatherCondition(condition);
    return weather?.icon || 'sunny';
  }

  /**
   * Get weather-appropriate time for wallpaper change
   */
  static getOptimalWallpaperChangeTime(weather: WeatherData): Date {
    const now = new Date();
    const changeTime = new Date(now);
    
    // For dramatic weather, change more frequently
    if (['thunderstorm', 'rain'].includes(weather.condition.toLowerCase())) {
      changeTime.setMinutes(changeTime.getMinutes() + 30);
    } else {
      changeTime.setHours(changeTime.getHours() + 2);
    }
    
    return changeTime;
  }

  /**
   * Get weather summary for display
   */
  static getWeatherSummary(weather: WeatherData): string {
    const temp = `${weather.temperature}°C`;
    const condition = weather.description;
    const location = weather.location.city;
    
    return `${temp} • ${condition} • ${location}`;
  }
}