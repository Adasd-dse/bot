import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { COLORS, SIZES, FONTS } from '../constants';
import { Article, Event, Community, User } from '../types';

// Date mock pentru demonstrație
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Noutăți în lumea auto: Tesla Model S Plaid',
    excerpt: 'Descoperă cele mai noi tehnologii din industria auto...',
    content: 'Conținut complet al articolului...',
    author: 'Redacția AutoWorld',
    category: 'news',
    tags: ['tesla', 'electric', 'technology'],
    coverImage: 'https://via.placeholder.com/300x200',
    images: [],
    publishedAt: new Date(),
    updatedAt: new Date(),
    views: 1250,
    likes: ['user1', 'user2'],
    comments: [],
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Ghid complet: Cum să îți întreții mașina',
    excerpt: 'Sfaturi practice pentru întreținerea optimă...',
    content: 'Conținut complet al ghidului...',
    author: 'Mecanic Expert',
    category: 'guides',
    tags: ['maintenance', 'tips', 'care'],
    coverImage: 'https://via.placeholder.com/300x200',
    images: [],
    publishedAt: new Date(),
    updatedAt: new Date(),
    views: 890,
    likes: ['user1'],
    comments: [],
    isFeatured: false,
  },
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Track Day Băneasa',
    description: 'Ziua de track pentru pasionații de viteză',
    type: 'trackday',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
    location: {
      latitude: 44.4268,
      longitude: 26.1025,
      address: 'Băneasa, București',
      venue: 'Circuit Băneasa',
    },
    organizer: 'AutoSport Club',
    participants: [],
    price: 150,
    photos: ['https://via.placeholder.com/300x200'],
    tags: ['track', 'speed', 'racing'],
    status: 'upcoming',
  },
];

const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Tuning Romania',
    description: 'Comunitatea pentru pasionații de tuning',
    type: 'tuning',
    isPublic: true,
    members: [],
    posts: [],
    events: [],
    rules: ['Respectă regulile comunității', 'Nu spam'],
    createdAt: new Date(),
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulează încărcarea datelor utilizatorului
    loadUserData();
  }, []);

  const loadUserData = async () => {
    // Mock user data
    setUser({
      id: '1',
      username: 'car_lover',
      email: 'user@example.com',
      fullName: 'Ion Popescu',
      avatar: 'https://via.placeholder.com/100x100',
      cars: [],
      badges: [],
      points: 1250,
      joinDate: new Date(),
      isPremium: false,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Acces Rapid</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('AutoHelp' as never)}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: COLORS.error }]}>
            <Ionicons name="help-circle" size={24} color={COLORS.background} />
          </View>
          <Text style={styles.quickActionText}>AutoHelp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('Map' as never)}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: COLORS.primary }]}>
            <Ionicons name="map" size={24} color={COLORS.background} />
          </View>
          <Text style={styles.quickActionText}>Hartă</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('Marketplace' as never)}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: COLORS.secondary }]}>
            <Ionicons name="bag" size={24} color={COLORS.background} />
          </View>
          <Text style={styles.quickActionText}>Magazin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('Events' as never)}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: COLORS.success }]}>
            <Ionicons name="calendar" size={24} color={COLORS.background} />
          </View>
          <Text style={styles.quickActionText}>Evenimente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFeaturedArticle = () => (
    <View style={styles.featuredSection}>
      <Text style={styles.sectionTitle}>Articol Recomandat</Text>
      <Card style={styles.featuredCard}>
        <Image
          source={{ uri: mockArticles[0].coverImage }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {mockArticles[0].title}
          </Text>
          <Text style={styles.featuredExcerpt} numberOfLines={3}>
            {mockArticles[0].excerpt}
          </Text>
          <View style={styles.featuredMeta}>
            <Text style={styles.featuredAuthor}>{mockArticles[0].author}</Text>
            <Text style={styles.featuredViews}>{mockArticles[0].views} vizualizări</Text>
          </View>
          <Button
            title="Citește mai mult"
            onPress={() => navigation.navigate('BlogDetail' as never, { article: mockArticles[0] } as never)}
            variant="outline"
            size="small"
            style={styles.readMoreButton}
          />
        </View>
      </Card>
    </View>
  );

  const renderUpcomingEvents = () => (
    <View style={styles.eventsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Evenimente Apropiate</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Events' as never)}>
          <Text style={styles.seeAllText}>Vezi toate</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={mockEvents}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card style={styles.eventCard}>
            <Image
              source={{ uri: item.photos[0] }}
              style={styles.eventImage}
              resizeMode="cover"
            />
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.eventDate}>
                {item.startDate.toLocaleDateString('ro-RO')}
              </Text>
              <Text style={styles.eventLocation} numberOfLines={1}>
                {item.location.venue}
              </Text>
              <Button
                title="Detalii"
                onPress={() => navigation.navigate('EventDetail' as never, { event: item } as never)}
                variant="outline"
                size="small"
                style={styles.eventButton}
              />
            </View>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.eventsList}
      />
    </View>
  );

  const renderCommunities = () => (
    <View style={styles.communitiesSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Comunități Recomandate</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Communities' as never)}>
          <Text style={styles.seeAllText}>Vezi toate</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={mockCommunities}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card style={styles.communityCard}>
            <View style={styles.communityContent}>
              <View style={[styles.communityIcon, { backgroundColor: COLORS[item.type] }]}>
                <Ionicons name="people" size={24} color={COLORS.background} />
              </View>
              <Text style={styles.communityName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.communityDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <Button
                title="Alătură-te"
                onPress={() => navigation.navigate('CommunityDetail' as never, { community: item } as never)}
                variant="primary"
                size="small"
                style={styles.joinButton}
              />
            </View>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.communitiesList}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="AutoWorld"
        subtitle="Totul despre mașini, într-un singur loc"
        backgroundColor={COLORS.primary}
        textColor={COLORS.background}
        elevation={4}
      />
      
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderQuickActions()}
        {renderFeaturedArticle()}
        {renderUpcomingEvents()}
        {renderCommunities()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  quickActionsContainer: {
    padding: SIZES.spacing.medium,
  },
  sectionTitle: {
    fontSize: SIZES.font.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.spacing.medium,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    alignItems: 'center',
    marginBottom: SIZES.spacing.medium,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacing.small,
  },
  quickActionText: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    textAlign: 'center',
  },
  featuredSection: {
    padding: SIZES.spacing.medium,
  },
  featuredCard: {
    margin: 0,
  },
  featuredImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: SIZES.cardRadius,
    borderTopRightRadius: SIZES.cardRadius,
  },
  featuredContent: {
    padding: SIZES.spacing.medium,
  },
  featuredTitle: {
    fontSize: SIZES.font.xlarge,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.spacing.small,
  },
  featuredExcerpt: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacing.medium,
    lineHeight: 22,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacing.medium,
  },
  featuredAuthor: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  featuredViews: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
  },
  eventsSection: {
    padding: SIZES.spacing.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing.medium,
  },
  seeAllText: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  eventsList: {
    paddingRight: SIZES.spacing.medium,
  },
  eventCard: {
    width: 280,
    marginRight: SIZES.spacing.medium,
    margin: 0,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: SIZES.cardRadius,
    borderTopRightRadius: SIZES.cardRadius,
  },
  eventContent: {
    padding: SIZES.spacing.medium,
  },
  eventTitle: {
    fontSize: SIZES.font.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.spacing.small,
  },
  eventDate: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.medium,
    color: COLORS.secondary,
    marginBottom: SIZES.spacing.small,
  },
  eventLocation: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacing.medium,
  },
  eventButton: {
    alignSelf: 'flex-start',
  },
  communitiesSection: {
    padding: SIZES.spacing.medium,
    paddingBottom: SIZES.spacing.xlarge,
  },
  communitiesList: {
    paddingRight: SIZES.spacing.medium,
  },
  communityCard: {
    width: 250,
    marginRight: SIZES.spacing.medium,
    margin: 0,
  },
  communityContent: {
    alignItems: 'center',
    padding: SIZES.spacing.medium,
  },
  communityIcon: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacing.medium,
  },
  communityName: {
    fontSize: SIZES.font.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.spacing.small,
  },
  communityDescription: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.spacing.medium,
    lineHeight: 18,
  },
  joinButton: {
    alignSelf: 'stretch',
  },
});

export default HomeScreen;