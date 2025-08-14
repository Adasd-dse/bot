import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Culori
export const COLORS = {
  // Culori principale
  primary: '#1E3A8A', // Albastru închis
  secondary: '#F59E0B', // Auriu
  accent: '#EF4444', // Roșu
  
  // Culori de fundal
  background: '#FFFFFF',
  surface: '#F8FAFC',
  card: '#FFFFFF',
  
  // Culori de text
  text: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  
  // Culori de stare
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Culori pentru comunități
  tuning: '#8B5CF6',
  motorsport: '#EF4444',
  classic: '#F59E0B',
  offroad: '#10B981',
  electric: '#06B6D4',
  drifting: '#EC4899',
  
  // Culori pentru evenimente
  trackday: '#3B82F6',
  drift: '#EC4899',
  retro: '#F59E0B',
  exhibition: '#8B5CF6',
  competition: '#EF4444',
  meetup: '#10B981',
  
  // Culori pentru marketplace
  parts: '#6B7280',
  accessories: '#8B5CF6',
  tires: '#10B981',
  oils: '#F59E0B',
  vehicles: '#3B82F6',
  
  // Culori pentru AutoHelp
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
  emergency: '#DC2626',
  
  // Culori pentru badge-uri
  common: '#6B7280',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
  
  // Culori pentru harta
  mapPrimary: '#1E3A8A',
  mapSecondary: '#F59E0B',
  mapAccent: '#EF4444',
  mapSuccess: '#10B981',
  mapWarning: '#F59E0B',
  mapError: '#EF4444',
};

// Dimensiuni
export const SIZES = {
  // Dimensiuni de bază
  base: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  
  // Dimensiuni de font
  font: {
    tiny: 10,
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 18,
    xxlarge: 20,
    title: 24,
    bigTitle: 32,
  },
  
  // Dimensiuni de spacing
  spacing: {
    tiny: 4,
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
    xxlarge: 48,
  },
  
  // Dimensiuni de border radius
  radius: {
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 16,
    xxlarge: 24,
    round: 50,
  },
  
  // Dimensiuni de ecran
  width,
  height,
  
  // Dimensiuni de header
  headerHeight: 60,
  tabBarHeight: 80,
  
  // Dimensiuni de card
  cardPadding: 16,
  cardMargin: 8,
  cardRadius: 12,
};

// Fonturi
export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

// Configurații pentru harta
export const MAP_CONFIG = {
  defaultZoom: 15,
  defaultCenter: {
    latitude: 44.4268, // București
    longitude: 26.1025,
  },
  maxZoom: 20,
  minZoom: 10,
  clusterRadius: 50,
  animationDuration: 300,
};

// Configurații pentru notificări
export const NOTIFICATION_CONFIG = {
  sound: true,
  vibration: true,
  badge: true,
  alert: true,
};

// Configurații pentru cache
export const CACHE_CONFIG = {
  maxAge: 24 * 60 * 60 * 1000, // 24 ore
  maxSize: 50 * 1024 * 1024, // 50MB
};

// Configurații pentru API
export const API_CONFIG = {
  baseURL: 'https://api.autoworld.com',
  timeout: 30000,
  retryAttempts: 3,
};

// Configurații pentru paginare
export const PAGINATION_CONFIG = {
  pageSize: 20,
  maxPages: 100,
};

// Configurații pentru search
export const SEARCH_CONFIG = {
  minQueryLength: 2,
  maxResults: 50,
  debounceDelay: 300,
};

// Configurații pentru upload
export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFiles: 10,
};

// Configurații pentru AutoHelp
export const AUTOHELP_CONFIG = {
  maxDistance: 50, // km
  responseTimeout: 5 * 60 * 1000, // 5 minute
  maxHelpers: 5,
};

// Configurații pentru marketplace
export const MARKETPLACE_CONFIG = {
  maxPrice: 1000000,
  minPrice: 1,
  maxTitleLength: 100,
  maxDescriptionLength: 1000,
};

// Configurații pentru comunități
export const COMMUNITY_CONFIG = {
  maxMembers: 10000,
  maxPostsPerDay: 50,
  maxRules: 20,
};

// Configurații pentru evenimente
export const EVENT_CONFIG = {
  maxParticipants: 1000,
  maxDuration: 7 * 24 * 60 * 60 * 1000, // 7 zile
  minAdvanceNotice: 24 * 60 * 60 * 1000, // 24 ore
};

// Configurații pentru mesaje
export const MESSAGE_CONFIG = {
  maxLength: 1000,
  maxMediaSize: 5 * 1024 * 1024, // 5MB
  maxAttachments: 5,
};

// Configurații pentru profil
export const PROFILE_CONFIG = {
  maxCars: 10,
  maxPhotosPerCar: 20,
  maxBioLength: 500,
};

// Configurații pentru gamificare
export const GAMIFICATION_CONFIG = {
  pointsPerPost: 10,
  pointsPerComment: 5,
  pointsPerLike: 1,
  pointsPerEvent: 50,
  pointsPerHelp: 100,
  pointsPerMarketplace: 25,
  
  badgeThresholds: {
    community: 100,
    events: 500,
    help: 1000,
    marketplace: 250,
    achievement: 5000,
  },
};

// Configurații pentru securitate
export const SECURITY_CONFIG = {
  passwordMinLength: 8,
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minute
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 ore
};

// Configurații pentru localizare
export const LOCALE_CONFIG = {
  default: 'ro',
  supported: ['ro', 'en'],
  fallback: 'en',
};

// Configurații pentru tema
export const THEME_CONFIG = {
  light: {
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1F2937',
    textSecondary: '#6B7280',
  },
  dark: {
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
  },
};