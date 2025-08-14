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
import { MarketplaceItem } from '../types';

// Date mock pentru demonstrație
const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: '1',
    sellerId: 'seller1',
    title: 'Jante BMW E36 Originale',
    description: 'Set de 4 jante originale BMW E36, 17 inch, starea perfectă, fără zgârieturi',
    category: 'parts',
    price: 800,
    currency: 'RON',
    condition: 'used',
    brand: 'BMW',
    model: 'E36',
    year: 1995,
    compatibility: ['BMW E36', 'BMW E46'],
    photos: ['https://via.placeholder.com/300x200'],
    location: {
      latitude: 44.4268,
      longitude: 26.1025,
      address: 'București, Sector 1',
    },
    isAvailable: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    views: 45,
    favorites: ['user1', 'user2'],
  },
  {
    id: '2',
    sellerId: 'seller2',
    title: 'Anvelope Michelin Pilot Sport 4',
    description: 'Set de 4 anvelope noi, 225/45R17, perfecte pentru performanță',
    category: 'tires',
    price: 1200,
    currency: 'RON',
    condition: 'new',
    brand: 'Michelin',
    compatibility: ['225/45R17', '225/40R17'],
    photos: ['https://via.placeholder.com/300x200'],
    location: {
      latitude: 44.4368,
      longitude: 26.1125,
      address: 'București, Sector 2',
    },
    isAvailable: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    views: 78,
    favorites: ['user1'],
  },
  {
    id: '3',
    sellerId: 'seller3',
    title: 'Suspensie Coilover BC Racing',
    description: 'Suspensie reglabilă BC Racing, compatibilă cu multe modele, starea excelentă',
    category: 'parts',
    price: 2500,
    currency: 'RON',
    condition: 'used',
    brand: 'BC Racing',
    compatibility: ['Universal'],
    photos: ['https://via.placeholder.com/300x200'],
    location: {
      latitude: 44.4168,
      longitude: 26.0925,
      address: 'București, Sector 3',
    },
    isAvailable: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    views: 32,
    favorites: [],
  },
  {
    id: '4',
    sellerId: 'seller4',
    title: 'Ulei Motor Mobil 1 5W-30',
    description: 'Ulei motor de înaltă calitate, 4L, perfect pentru mașini moderne',
    category: 'oils',
    price: 120,
    currency: 'RON',
    condition: 'new',
    brand: 'Mobil 1',
    compatibility: ['5W-30', 'API SN Plus'],
    photos: ['https://via.placeholder.com/300x200'],
    location: {
      latitude: 44.4468,
      longitude: 26.1225,
      address: 'București, Sector 4',
    },
    isAvailable: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    views: 156,
    favorites: ['user1', 'user2', 'user3'],
  },
  {
    id: '5',
    sellerId: 'seller5',
    title: 'Volan Sport MOMO',
    description: 'Volan sport MOMO, 350mm, perfect pentru tuning și drift',
    category: 'accessories',
    price: 450,
    currency: 'RON',
    condition: 'used',
    brand: 'MOMO',
    compatibility: ['Universal'],
    photos: ['https://via.placeholder.com/300x200'],
    location: {
      latitude: 44.4568,
      longitude: 26.1325,
      address: 'București, Sector 5',
    },
    isAvailable: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    views: 89,
    favorites: ['user1'],
  },
];

const MarketplaceScreen: React.FC = () => {
  const navigation = useNavigation();
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(mockMarketplaceItems);
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>(mockMarketplaceItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    filterItems();
  }, [searchQuery, selectedCategory, selectedCondition, priceRange]);

  const filterItems = () => {
    let filtered = marketplaceItems;

    // Filtrare după categorie
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filtrare după stare
    if (selectedCondition) {
      filtered = filtered.filter(item => item.condition === selectedCondition);
    }

    // Filtrare după preț
    filtered = filtered.filter(item => 
      item.price >= priceRange.min && item.price <= priceRange.max
    );

    // Filtrare după căutare
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.model && item.model.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulează reîncărcarea datelor
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'parts':
        return '🔧';
      case 'accessories':
        return '🎨';
      case 'tires':
        return '🛞';
      case 'oils':
        return '🛢️';
      case 'vehicles':
        return '🚗';
      default:
        return '📦';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'parts':
        return 'Piese';
      case 'accessories':
        return 'Accesorii';
      case 'tires':
        return 'Anvelope';
      case 'oils':
        return 'Uleiuri';
      case 'vehicles':
        return 'Vehicule';
      default:
        return 'Altele';
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'Nou';
      case 'used':
        return 'Folosit';
      case 'refurbished':
        return 'Recondiționat';
      default:
        return 'Necunoscut';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return COLORS.success;
      case 'used':
        return COLORS.warning;
      case 'refurbished':
        return COLORS.info;
      default:
        return COLORS.textSecondary;
    }
  };

  const renderMarketplaceItem = ({ item }: { item: MarketplaceItem }) => (
    <Card
      style={styles.itemCard}
      onPress={() => navigation.navigate('MarketplaceItemDetail' as never, { item } as never)}
    >
      <View style={styles.itemImageContainer}>
        <Text style={styles.itemImagePlaceholder}>
          {getCategoryIcon(item.category)}
        </Text>
        <View style={styles.itemBadges}>
          <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(item.condition) }]}>
            <Text style={styles.conditionBadgeText}>{getConditionText(item.condition)}</Text>
          </View>
          {item.isAvailable ? (
            <View style={[styles.availabilityBadge, { backgroundColor: COLORS.success }]}>
              <Text style={styles.availabilityBadgeText}>Disponibil</Text>
            </View>
          ) : (
            <View style={[styles.availabilityBadge, { backgroundColor: COLORS.error }]}>
              <Text style={styles.availabilityBadgeText}>Vândut</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.itemDetails}>
          {item.brand && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Brand:</Text>
              <Text style={styles.detailValue}>{item.brand}</Text>
            </View>
          )}
          {item.model && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Model:</Text>
              <Text style={styles.detailValue}>{item.model}</Text>
            </View>
          )}
          {item.year && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>An:</Text>
              <Text style={styles.detailValue}>{item.year}</Text>
            </View>
          )}
        </View>

        <View style={styles.itemFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{item.price} {item.currency}</Text>
            <Text style={styles.priceLabel}>Preț</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="eye" size={16} color={COLORS.textSecondary} />
              <Text style={styles.statText}>{item.views}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={16} color={COLORS.error} />
              <Text style={styles.statText}>{item.favorites.length}</Text>
            </View>
          </View>
        </View>

        <View style={styles.itemActions}>
          <Button
            title="Vezi detalii"
            onPress={() => navigation.navigate('MarketplaceItemDetail' as never, { item } as never)}
            variant="primary"
            size="small"
            style={styles.detailsButton}
          />
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons 
              name={item.favorites.includes('user1') ? 'heart' : 'heart-outline'} 
              size={20} 
              color={item.favorites.includes('user1') ? COLORS.error : COLORS.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersScroll}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            !selectedCategory && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[
            styles.filterText,
            !selectedCategory && styles.filterTextActive,
          ]}>
            Toate
          </Text>
        </TouchableOpacity>

        {(['parts', 'accessories', 'tires', 'oils', 'vehicles'] as const).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterButton,
              selectedCategory === category && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
          >
            <Text style={[
              styles.filterText,
              selectedCategory === category && styles.filterTextActive,
            ]}>
              {getCategoryText(category)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Marketplace"
        subtitle="Piese, accesorii și vehicule"
        backgroundColor={COLORS.background}
        textColor={COLORS.text}
        rightIcon="add"
        onRightPress={() => {
          // Navigare la adăugarea unui produs nou
          Alert.alert('În curând', 'Funcționalitatea de adăugare produs va fi disponibilă în curând!');
        }}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Caută produse..."
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

      {renderFilters()}

      <FlatList
        data={filteredItems}
        renderItem={renderMarketplaceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.itemsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyTitle}>Nu s-au găsit produse</Text>
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
  filtersContainer: {
    backgroundColor: COLORS.background,
    paddingVertical: SIZES.spacing.small,
  },
  filtersScroll: {
    paddingHorizontal: SIZES.spacing.medium,
  },
  filterButton: {
    paddingHorizontal: SIZES.spacing.medium,
    paddingVertical: SIZES.spacing.small,
    marginRight: SIZES.spacing.small,
    borderRadius: SIZES.radius.round,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.background,
  },
  itemsList: {
    padding: SIZES.spacing.medium,
  },
  itemCard: {
    marginBottom: SIZES.spacing.medium,
  },
  itemImageContainer: {
    height: 200,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacing.medium,
    position: 'relative',
  },
  itemImagePlaceholder: {
    fontSize: 64,
  },
  itemBadges: {
    position: 'absolute',
    top: SIZES.spacing.small,
    right: SIZES.spacing.small,
    alignItems: 'flex-end',
  },
  conditionBadge: {
    paddingHorizontal: SIZES.spacing.small,
    paddingVertical: 4,
    borderRadius: SIZES.radius.small,
    marginBottom: SIZES.spacing.small,
  },
  conditionBadgeText: {
    fontSize: SIZES.font.tiny,
    fontFamily: FONTS.medium,
    color: COLORS.background,
  },
  availabilityBadge: {
    paddingHorizontal: SIZES.spacing.small,
    paddingVertical: 4,
    borderRadius: SIZES.radius.small,
  },
  availabilityBadgeText: {
    fontSize: SIZES.font.tiny,
    fontFamily: FONTS.medium,
    color: COLORS.background,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: SIZES.font.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.spacing.small,
    lineHeight: 22,
  },
  itemDescription: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacing.medium,
    lineHeight: 20,
  },
  itemDetails: {
    marginBottom: SIZES.spacing.medium,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: SIZES.spacing.small,
  },
  detailLabel: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    width: 60,
  },
  detailValue: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    flex: 1,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing.medium,
  },
  priceContainer: {
    alignItems: 'flex-start',
  },
  price: {
    fontSize: SIZES.font.xlarge,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  priceLabel: {
    fontSize: SIZES.font.tiny,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SIZES.spacing.medium,
  },
  statText: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginLeft: SIZES.spacing.small,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButton: {
    flex: 1,
    marginRight: SIZES.spacing.medium,
  },
  favoriteButton: {
    padding: SIZES.spacing.small,
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

export default MarketplaceScreen;