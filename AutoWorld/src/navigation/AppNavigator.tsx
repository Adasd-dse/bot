import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

// Import ecranele
import HomeScreen from '../screens/HomeScreen';
import CommunitiesScreen from '../screens/CommunitiesScreen';
import MapScreen from '../screens/MapScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import EventsScreen from '../screens/EventsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessengerScreen from '../screens/MessengerScreen';
import AutoHelpScreen from '../screens/AutoHelpScreen';
import BlogScreen from '../screens/BlogScreen';
import ClubsScreen from '../screens/ClubsScreen';

// Import ecranele de detalii
import CommunityDetailScreen from '../screens/CommunityDetailScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import MarketplaceItemDetailScreen from '../screens/MarketplaceItemDetailScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import ClubDetailScreen from '../screens/ClubDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import HelpRequestDetailScreen from '../screens/HelpRequestDetailScreen';
import IntelligentWallpaperScreen from '../screens/IntelligentWallpaperScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator pentru Home
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="BlogDetail" component={ArticleDetailScreen} />
    <Stack.Screen name="EventDetail" component={EventDetailScreen} />
  </Stack.Navigator>
);

// Stack navigator pentru Communities
const CommunitiesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="CommunitiesMain" component={CommunitiesScreen} />
    <Stack.Screen name="CommunityDetail" component={CommunityDetailScreen} />
    <Stack.Screen name="EventDetail" component={EventDetailScreen} />
  </Stack.Navigator>
);

// Stack navigator pentru Map
const MapStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="MapMain" component={MapScreen} />
    <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    <Stack.Screen name="CommunityDetail" component={CommunityDetailScreen} />
    <Stack.Screen name="MarketplaceItemDetail" component={MarketplaceItemDetailScreen} />
    <Stack.Screen name="HelpRequestDetail" component={HelpRequestDetailScreen} />
  </Stack.Navigator>
);

// Stack navigator pentru Marketplace
const MarketplaceStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="MarketplaceMain" component={MarketplaceScreen} />
    <Stack.Screen name="MarketplaceItemDetail" component={MarketplaceItemDetailScreen} />
  </Stack.Navigator>
);

// Stack navigator pentru Events
const EventsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="EventsMain" component={EventsScreen} />
    <Stack.Screen name="EventDetail" component={EventDetailScreen} />
  </Stack.Navigator>
);

// Stack navigator pentru Profile
const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="Messenger" component={MessengerScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="AutoHelp" component={AutoHelpScreen} />
    <Stack.Screen name="Blog" component={BlogScreen} />
    <Stack.Screen name="Clubs" component={ClubsScreen} />
    <Stack.Screen name="ClubDetail" component={ClubDetailScreen} />
    <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
    <Stack.Screen name="IntelligentWallpaper" component={IntelligentWallpaperScreen} />
  </Stack.Navigator>
);

// Tab Navigator principal
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Communities':
            iconName = focused ? 'people' : 'people-outline';
            break;
          case 'Map':
            iconName = focused ? 'map' : 'map-outline';
            break;
          case 'Marketplace':
            iconName = focused ? 'bag' : 'bag-outline';
            break;
          case 'Events':
            iconName = focused ? 'calendar' : 'calendar-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'help-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: {
        backgroundColor: COLORS.background,
        borderTopColor: COLORS.surface,
        borderTopWidth: 1,
        height: SIZES.tabBarHeight,
        paddingBottom: SIZES.spacing.medium,
        paddingTop: SIZES.spacing.small,
      },
      tabBarLabelStyle: {
        fontSize: SIZES.font.small,
        fontFamily: 'System',
      },
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeStack}
      options={{
        tabBarLabel: 'Acasă',
      }}
    />
    <Tab.Screen 
      name="Communities" 
      component={CommunitiesStack}
      options={{
        tabBarLabel: 'Comunități',
      }}
    />
    <Tab.Screen 
      name="Map" 
      component={MapStack}
      options={{
        tabBarLabel: 'Hartă',
      }}
    />
    <Tab.Screen 
      name="Marketplace" 
      component={MarketplaceStack}
      options={{
        tabBarLabel: 'Magazin',
      }}
    />
    <Tab.Screen 
      name="Events" 
      component={EventsStack}
      options={{
        tabBarLabel: 'Evenimente',
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileStack}
      options={{
        tabBarLabel: 'Profil',
      }}
    />
  </Tab.Navigator>
);

// Navigator principal al aplicației
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;