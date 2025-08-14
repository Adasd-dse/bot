import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { COLORS, SIZES, FONTS } from '../constants';
import { Community } from '../types';

// Date mock pentru demonstrație
const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Tuning Romania',
    description: 'Comunitatea pentru pasionații de tuning. Împărtășim proiecte, sfaturi și organizăm întâlniri.',
    type: 'tuning',
    isPublic: true,
    members: [],
    posts: [],
    events: [],
    rules: ['Respectă regulile comunității', 'Nu spam', 'Fii constructiv'],
    createdAt: new Date(),
    avatar: 'https://via.placeholder.com/100x100',
    coverPhoto: 'https://via.placeholder.com/300x150',
  },
  {
    id: '2',
    name: 'Motorsport Club',
    description: 'Pentru pasionații de curse și performanță. Track days, drift și competiții.',
    type: 'motorsport',
    isPublic: true,
    members: [],
    posts: [],
    events: [],
    rules: ['Respectă regulile de siguranță', 'Participă activ', 'Ajută începătorii'],
    createdAt: new Date(),
    avatar: 'https://via.placeholder.com/100x100',
    coverPhoto: 'https://via.placeholder.com/300x150',
  },
  {
    id: '3',
    name: 'Classic Cars Romania',
    description: 'Comunitatea pentru mașini clasice și istoria auto. Restaurări, parade și expoziții.',
    type: 'classic',
    isPublic: true,
    members: [],
    posts: [],
    events: [],
    rules: ['Respectă istoria', 'Împărtășește cunoștințele', 'Mentorat'],
    createdAt: new Date(),
    avatar: 'https://via.placeholder.com/100x100',
    coverPhoto: 'https://via.placeholder.com/300x150',
  },
  {
    id: '4',
    name: 'Off-Road Adventures',
    description: 'Pentru pasionații de aventuri off-road. Expediiții, trail riding și 4x4.',
    type: 'offroad',
    isPublic: true,
    members: [],
    posts: [],
    events: [],
    rules: ['Respectă natura', 'Siguranța în primul rând', 'Ajută comunitatea'],
    createdAt: new Date(),
    avatar: 'https://via.placeholder.com/100x100',
    coverPhoto: 'https://via.placeholder.com/300x150',
  },
  {
    id: '5',
    name: 'Electric Vehicle Enthusiasts',
    description: 'Viitorul auto este electric. Tehnologie, eficiență și sustenabilitate.',
    type: 'electric',
    isPublic: true,
    members: [],
    posts: [],
    events: [],
    rules: ['Promovează sustenabilitatea', 'Împărtășește tehnologia', 'Fii deschis la nou'],
    createdAt: new Date(),
    avatar: 'https://via.placeholder.com/100x100',
    coverPhoto: 'https://via.placeholder.com/300x150',
  },
  {
    id: '6',
    name: 'Drift Masters',
    description: 'Arta drift-ului. Tehnici, evenimente și pasiune pentru controlul perfect.',
    type: 'drifting',
    isPublic: true,
    members: [],
    posts: [],
    events: [],
    rules: ['Practică sigur', 'Învață continuu', 'Respectă alții'],
    createdAt: new Date(),
    avatar: 'https://via.placeholder.com/100x100',
    coverPhoto: 'https://via.placeholder.com/300x150',
  },
];

const CommunitiesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [communities, setCommunities] = useState<Community[]>(mockCommunities);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>(mockCommunities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    filterCommunities();
  }, [searchQuery, selectedType]);

  const filterCommunities = () => {
    let filtered = communities;

    // Filtrare după tip
    if (selectedType) {
      filtered = filtered.filter(community => community.type === selectedType);
    }

    // Filtrare după căutare
    if (searchQuery.trim()) {
      filtered = filtered.filter(community =>
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCommunities(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulează reîncărcarea datelor
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getTypeColor = (type: string) => {
    return COLORS[type as keyof typeof COLORS] || COLORS.primary;
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'tuning':
        return 'Tuning';
      case 'motorsport':
        return 'Motorsport';
      case 'classic':
        return 'Clasice';
      case 'offroad':
        return 'Off-Road';
      case 'electric':
        return 'Electrice';
      case 'drifting':
        return 'Drift';
      default:
        return 'Altele';
    }
  };

  const renderCommunityCard = ({ item }: { item: Community }) => (
    <Card
      style={styles.communityCard}
      onPress={() => navigation.navigate('CommunityDetail' as never, { community: item } as never)}
    >
      <View style={styles.communityHeader}>
        <View style={styles.communityAvatar}>
          <Text style={styles.communityAvatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.communityInfo}>
          <Text style={styles.communityName}>{item.name}</Text>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
            <Text style={styles.typeBadgeText}>{getTypeText(item.type)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.joinButton}>
          <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.communityDescription} numberOfLines={3}>
        {item.description}
      </Text>

      <View style={styles.communityStats}>
        <View style={styles.statItem}>
          <Ionicons name="people" size={16} color={COLORS.textSecondary} />
          <Text style={styles.statText}>{item.members.length} membri</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="document-text" size={16} color={COLORS.textSecondary} />
          <Text style={styles.statText}>{item.posts.length} postări</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="calendar" size={16} color={COLORS.textSecondary} />
          <Text style={styles.statText}>{item.events.length} evenimente</Text>
        </View>
      </View>

      <View style={styles.communityRules}>
        <Text style={styles.rulesTitle}>Reguli principale:</Text>
        {item.rules.slice(0, 2).map((rule, index) => (
          <Text key={index} style={styles.ruleText}>• {rule}</Text>
        ))}
      </View>
    </Card>
  );

  const renderTypeFilter = () => (
    <View style={styles.typeFilterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.typeFilterScroll}
      >
        <TouchableOpacity
          style={[
            styles.typeFilterButton,
            !selectedType && styles.typeFilterButtonActive,
          ]}
          onPress={() => setSelectedType(null)}
        >
          <Text style={[
            styles.typeFilterText,
            !selectedType && styles.typeFilterTextActive,
          ]}>
            Toate
          </Text>
        </TouchableOpacity>

        {(['tuning', 'motorsport', 'classic', 'offroad', 'electric', 'drifting'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeFilterButton,
              selectedType === type && styles.typeFilterButtonActive,
            ]}
            onPress={() => setSelectedType(selectedType === type ? null : type)}
          >
            <Text style={[
              styles.typeFilterText,
              selectedType === type && styles.typeFilterTextActive,
            ]}>
              {getTypeText(type)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Comunități"
        subtitle="Conectează-te cu pasionații de mașini"
        backgroundColor={COLORS.background}
        textColor={COLORS.text}
        rightIcon="add"
        onRightPress={() => {
          // Navigare la crearea unei comunități noi
          Alert.alert('În curând', 'Funcționalitatea de creare comunitate va fi disponibilă în curând!');
        }}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Caută comunități..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textLight}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {renderTypeFilter()}

      <FlatList
        data={filteredCommunities}
        renderItem={renderCommunityCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.communitiesList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyTitle}>Nu s-au găsit comunități</Text>
            <Text style={styles.emptySubtitle}>
              Încearcă să modifici filtrele sau să cauți altceva
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    padding: SIZES.spacing.medium,
    backgroundColor: COLORS.surface,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius.medium,
    paddingHorizontal: SIZES.spacing.medium,
    paddingVertical: SIZES.spacing.small,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.spacing.small,
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  typeFilterContainer: {
    backgroundColor: COLORS.background,
    paddingVertical: SIZES.spacing.small,
  },
  typeFilterScroll: {
    paddingHorizontal: SIZES.spacing.medium,
  },
  typeFilterButton: {
    paddingHorizontal: SIZES.spacing.medium,
    paddingVertical: SIZES.spacing.small,
    marginRight: SIZES.spacing.small,
    borderRadius: SIZES.radius.round,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  typeFilterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeFilterText: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  typeFilterTextActive: {
    color: COLORS.background,
  },
  communitiesList: {
    padding: SIZES.spacing.medium,
  },
  communityCard: {
    marginBottom: SIZES.spacing.medium,
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.medium,
  },
  communityAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.spacing.medium,
  },
  communityAvatarText: {
    fontSize: SIZES.font.large,
    fontFamily: FONTS.bold,
    color: COLORS.background,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: SIZES.font.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.spacing.small,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SIZES.spacing.small,
    paddingVertical: 4,
    borderRadius: SIZES.radius.small,
  },
  typeBadgeText: {
    fontSize: SIZES.font.tiny,
    fontFamily: FONTS.medium,
    color: COLORS.background,
  },
  joinButton: {
    padding: SIZES.spacing.small,
  },
  communityDescription: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SIZES.spacing.medium,
  },
  communityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SIZES.spacing.medium,
    paddingVertical: SIZES.spacing.small,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.medium,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginLeft: SIZES.spacing.small,
  },
  communityRules: {
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
    paddingTop: SIZES.spacing.medium,
  },
  rulesTitle: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.spacing.small,
  },
  ruleText: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: SIZES.spacing.xlarge,
  },
  emptyTitle: {
    fontSize: SIZES.font.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginTop: SIZES.spacing.medium,
    marginBottom: SIZES.spacing.small,
  },
  emptySubtitle: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CommunitiesScreen;