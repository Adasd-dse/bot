// Tipuri pentru utilizatori
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  cars: Car[];
  badges: Badge[];
  points: number;
  joinDate: Date;
  isPremium: boolean;
}

// Tipuri pentru mașini
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  engine: string;
  modifications: Modification[];
  photos: string[];
  description?: string;
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
}

export interface Modification {
  id: string;
  name: string;
  description: string;
  date: Date;
  cost: number;
  photos?: string[];
}

// Tipuri pentru comunități
export interface Community {
  id: string;
  name: string;
  description: string;
  type: 'tuning' | 'motorsport' | 'classic' | 'offroad' | 'electric' | 'drifting';
  isPublic: boolean;
  members: CommunityMember[];
  posts: Post[];
  events: Event[];
  avatar?: string;
  coverPhoto?: string;
  rules: string[];
  createdAt: Date;
}

export interface CommunityMember {
  userId: string;
  role: 'admin' | 'moderator' | 'member';
  joinDate: Date;
  postsCount: number;
}

// Tipuri pentru postări
export interface Post {
  id: string;
  authorId: string;
  communityId?: string;
  type: 'text' | 'photo' | 'video' | 'poll';
  content: string;
  media?: string[];
  likes: string[];
  comments: Comment[];
  tags: string[];
  createdAt: Date;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  likes: string[];
  createdAt: Date;
  replies?: Comment[];
}

// Tipuri pentru evenimente
export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'trackday' | 'drift' | 'retro' | 'exhibition' | 'competition' | 'meetup';
  startDate: Date;
  endDate: Date;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    venue: string;
  };
  organizer: string;
  participants: EventParticipant[];
  maxParticipants?: number;
  price: number;
  photos: string[];
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface EventParticipant {
  userId: string;
  status: 'registered' | 'confirmed' | 'attended' | 'cancelled';
  registrationDate: Date;
  paymentStatus: 'pending' | 'completed' | 'refunded';
}

// Tipuri pentru marketplace
export interface MarketplaceItem {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: 'parts' | 'accessories' | 'tires' | 'oils' | 'vehicles';
  price: number;
  currency: string;
  condition: 'new' | 'used' | 'refurbished';
  brand?: string;
  model?: string;
  year?: number;
  compatibility?: string[];
  photos: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  isAvailable: boolean;
  createdAt: Date;
  views: number;
  favorites: string[];
}

// Tipuri pentru AutoHelp
export interface HelpRequest {
  id: string;
  requesterId: string;
  type: 'flat_tire' | 'dead_battery' | 'out_of_fuel' | 'towing' | 'other';
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  helpers: string[];
  assignedHelperId?: string;
  createdAt: Date;
  completedAt?: Date;
  rating?: number;
  review?: string;
}

// Tipuri pentru badge-uri și gamificare
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'community' | 'events' | 'help' | 'marketplace' | 'achievement';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: Date;
}

// Tipuri pentru uniuni și cluburi
export interface AutoClub {
  id: string;
  name: string;
  description: string;
  type: 'official' | 'unofficial' | 'brand' | 'dealer';
  logo?: string;
  coverPhoto?: string;
  website?: string;
  contact: {
    email: string;
    phone?: string;
    address: string;
  };
  members: string[];
  events: string[];
  partnerships: string[];
  founded: Date;
  isVerified: boolean;
}

// Tipuri pentru blog și știri
export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: 'news' | 'guides' | 'technology' | 'events' | 'interviews';
  tags: string[];
  coverImage: string;
  images: string[];
  publishedAt: Date;
  updatedAt: Date;
  views: number;
  likes: string[];
  comments: Comment[];
  isFeatured: boolean;
}

// Tipuri pentru mesaje
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'voice' | 'video';
  media?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Tipuri pentru harta inteligentă
export interface MapMarker {
  id: string;
  type: 'event' | 'community' | 'marketplace' | 'help' | 'spot' | 'route';
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  data: Event | Community | MarketplaceItem | HelpRequest | any;
  icon: string;
  color: string;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  waypoints: {
    latitude: number;
    longitude: number;
    name: string;
    type: 'start' | 'waypoint' | 'end';
  }[];
  distance: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdBy: string;
  isPublic: boolean;
  rating: number;
  reviews: number;
  createdAt: Date;
}

// Tipuri pentru notificări
export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'event' | 'community' | 'marketplace' | 'help' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

// Tipuri pentru filtre
export interface MapFilters {
  events: boolean;
  communities: boolean;
  marketplace: boolean;
  help: boolean;
  spots: boolean;
  routes: boolean;
  distance: number;
  categories: string[];
}

// Tipuri pentru setări
export interface UserSettings {
  notifications: {
    messages: boolean;
    events: boolean;
    community: boolean;
    marketplace: boolean;
    help: boolean;
  };
  privacy: {
    showLocation: boolean;
    showProfile: boolean;
    allowMessages: boolean;
  };
  map: {
    defaultZoom: number;
    defaultCenter: {
      latitude: number;
      longitude: number;
    };
    showTraffic: boolean;
    showSatellite: boolean;
  };
}

// Wallpaper Types
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

export interface WallpaperSettings {
  autoChange: boolean;
  timeBased: boolean;
  weatherBased: boolean;
  locationBased: boolean;
  moodBased: boolean;
  aiRecommendations: boolean;
  changeInterval: number;
  categories: string[];
}

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

export interface AIRecommendation {
  wallpaper: WallpaperData;
  confidence: number;
  reasons: string[];
  score: number;
  factors: {
    timeOfDay: number;
    weather: number;
    userHistory: number;
    category: number;
    mood: number;
    novelty: number;
  };
}

export type RootStackParamList = {
  Home: undefined;
  Communities: undefined;
  Map: undefined;
  Marketplace: undefined;
  Events: undefined;
  Profile: undefined;
  IntelligentWallpaper: undefined;
  Messenger: undefined;
  Chat: undefined;
  AutoHelp: undefined;
  Blog: undefined;
  Clubs: undefined;
  ClubDetail: { clubId: string };
  ArticleDetail: { articleId: string };
  CommunityDetail: { communityId: string };
  EventDetail: { eventId: string };
  MarketplaceItemDetail: { itemId: string };
  HelpRequestDetail: { requestId: string };
};