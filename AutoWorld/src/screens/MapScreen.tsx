import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { COLORS, SIZES, FONTS, MAP_CONFIG } from '../constants';
import { MapMarker, Event, Community, MarketplaceItem, HelpRequest, MapFilters } from '../types';

const { width, height } = Dimensions.get('window');

// Date mock pentru demonstrație
const mockMarkers: MapMarker[] = [
  {
    id: '1',
    type: 'event',
    title: 'Track Day Băneasa',
    description: 'Ziua de track pentru pasionații de viteză',
    location: { latitude: 44.4268, longitude: 26.1025 },
    data: {
      id: '1',
      title: 'Track Day Băneasa',
      type: 'trackday',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      price: 150,
    },
    icon: '🏁',
    color: COLORS.trackday,
  },
  {
    id: '2',
    type: 'community',
    title: 'Tuning Romania',
    description: 'Comunitatea pentru pasionații de tuning',
    location: { latitude: 44.4368, longitude: 26.1125 },
    data: {
      id: '1',
      name: 'Tuning Romania',
      type: 'tuning',
      members: [],
    },
    icon: '👥',
    color: COLORS.tuning,
  },
  {
    id: '3',
    type: 'marketplace',
    title: 'Jante BMW E36',
    description: 'Set jante originale BMW E36, 17 inch',
    location: { latitude: 44.4168, longitude: 26.0925 },
    data: {
      id: '1',
      title: 'Jante BMW E36',
      price: 800,
      category: 'parts',
    },
    icon: '🛞',
    color: COLORS.parts,
  },
  {
    id: '4',
    type: 'help',
    title: 'Ajutor - Pană',
    description: 'Am o pană, am nevoie de ajutor',
    location: { latitude: 44.4468, longitude: 26.1225 },
    data: {
      id: '1',
      type: 'flat_tire',
      urgency: 'medium',
      status: 'open',
    },
    icon: '🚨',
    color: COLORS.medium,
  },
];

const MapScreen: React.FC = () => {
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [filters, setFilters] = useState<MapFilters>({
    events: true,
    communities: true,
    marketplace: true,
    help: true,
    spots: true,
    routes: true,
    distance: 50,
    categories: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredMarkers, setFilteredMarkers] = useState<MapMarker[]>(mockMarkers);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
        
        // Centrare harta pe locația utilizatorului
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      }
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const applyFilters = () => {
    let filtered = mockMarkers.filter(marker => {
      if (!filters.events && marker.type === 'event') return false;
      if (!filters.communities && marker.type === 'community') return false;
      if (!filters.marketplace && marker.type === 'marketplace') return false;
      if (!filters.help && marker.type === 'help') return false;
      if (!filters.spots && marker.type === 'spot') return false;
      if (!filters.routes && marker.type === 'route') return false;
      return true;
    });

    setFilteredMarkers(filtered);
  };

  const handleMarkerPress = (marker: MapMarker) => {
    setSelectedMarker(marker);
  };

  const handleMarkerAction = () => {
    if (!selectedMarker) return;

    switch (selectedMarker.type) {
      case 'event':
        navigation.navigate('EventDetail' as never, { event: selectedMarker.data } as never);
        break;
      case 'community':
        navigation.navigate('CommunityDetail' as never, { community: selectedMarker.data } as never);
        break;
      case 'marketplace':
        navigation.navigate('MarketplaceItemDetail' as never, { item: selectedMarker.data } as never);
        break;
      case 'help':
        navigation.navigate('HelpRequestDetail' as never, { request: selectedMarker.data } as never);
        break;
    }
    setSelectedMarker(null);
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'event':
        return '🏁';
      case 'community':
        return '👥';
      case 'marketplace':
        return '🛞';
      case 'help':
        return '🚨';
      case 'spot':
        return '📸';
      case 'route':
        return '🛣️';
      default:
        return '📍';
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'event':
        return COLORS.trackday;
      case 'community':
        return COLORS.tuning;
      case 'marketplace':
        return COLORS.parts;
      case 'help':
        return COLORS.medium;
      case 'spot':
        return COLORS.info;
      case 'route':
        return COLORS.success;
      default:
        return COLORS.primary;
    }
  };

  const renderMarker = ({ item }: { item: MapMarker }) => (
    <Marker
      key={item.id}
      coordinate={item.location}
      onPress={() => handleMarkerPress(item)}
    >
      <View style={[styles.markerContainer, { backgroundColor: getMarkerColor(item.type) }]}>
        <Text style={styles.markerIcon}>{getMarkerIcon(item.type)}</Text>
      </View>
      <Callout>
        <View style={styles.calloutContainer}>
          <Text style={styles.calloutTitle}>{item.title}</Text>
          <Text style={styles.calloutDescription}>{item.description}</Text>
          <Button
            title="Vezi detalii"
            onPress={handleMarkerAction}
            variant="primary"
            size="small"
            style={styles.calloutButton}
          />
        </View>
      </Callout>
    </Marker>
  );

  const renderFiltersModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtre Hartă</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Tipuri de conținut</Text>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => setFilters(prev => ({ ...prev, events: !prev.events }))}
            >
              <Ionicons
                name={filters.events ? 'checkbox' : 'square-outline'}
                size={20}
                color={filters.events ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={styles.filterOptionText}>Evenimente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => setFilters(prev => ({ ...prev, communities: !prev.communities }))}
            >
              <Ionicons
                name={filters.communities ? 'checkbox' : 'square-outline'}
                size={20}
                color={filters.communities ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={styles.filterOptionText}>Comunități</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => setFilters(prev => ({ ...prev, marketplace: !prev.marketplace }))}
            >
              <Ionicons
                name={filters.marketplace ? 'checkbox' : 'square-outline'}
                size={20}
                color={filters.marketplace ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={styles.filterOptionText}>Marketplace</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => setFilters(prev => ({ ...prev, help: !prev.help }))}
            >
              <Ionicons
                name={filters.help ? 'checkbox' : 'square-outline'}
                size={20}
                color={filters.help ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={styles.filterOptionText}>AutoHelp</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Aplică filtrele"
            onPress={() => setShowFilters(false)}
            variant="primary"
            fullWidth
          />
        </View>
      </View>
    </Modal>
  );

  const renderMarkerInfo = () => {
    if (!selectedMarker) return null;

    return (
      <Card style={styles.markerInfo}>
        <View style={styles.markerInfoHeader}>
          <Text style={styles.markerInfoTitle}>{selectedMarker.title}</Text>
          <TouchableOpacity onPress={() => setSelectedMarker(null)}>
            <Ionicons name="close" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.markerInfoDescription}>{selectedMarker.description}</Text>
        <Button
          title="Vezi detalii"
          onPress={handleMarkerAction}
          variant="primary"
          fullWidth
        />
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Hartă Inteligentă"
        subtitle="Descoperă tot ce se întâmplă în jurul tău"
        backgroundColor={COLORS.background}
        textColor={COLORS.text}
        rightIcon="filter"
        onRightPress={() => setShowFilters(true)}
      />

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: MAP_CONFIG.defaultCenter.latitude,
            longitude: MAP_CONFIG.defaultCenter.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
        >
          {filteredMarkers.map(renderMarker)}
        </MapView>

        {renderMarkerInfo()}
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            if (userLocation && mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });
            }
          }}
        >
          <Ionicons name="locate" size={24} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Locația mea</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter" size={24} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Filtre</Text>
        </TouchableOpacity>
      </View>

      {renderFiltersModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 20,
  },
  calloutContainer: {
    width: 200,
    padding: SIZES.spacing.small,
  },
  calloutTitle: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.spacing.small,
  },
  calloutDescription: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacing.small,
  },
  calloutButton: {
    alignSelf: 'stretch',
  },
  markerInfo: {
    position: 'absolute',
    bottom: 100,
    left: SIZES.spacing.medium,
    right: SIZES.spacing.medium,
    zIndex: 1000,
  },
  markerInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing.small,
  },
  markerInfoTitle: {
    fontSize: SIZES.font.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    flex: 1,
  },
  markerInfoDescription: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacing.medium,
    lineHeight: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SIZES.spacing.medium,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
  },
  actionButton: {
    alignItems: 'center',
    padding: SIZES.spacing.small,
  },
  actionButtonText: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginTop: SIZES.spacing.small,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.radius.xlarge,
    borderTopRightRadius: SIZES.radius.xlarge,
    padding: SIZES.spacing.large,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing.large,
  },
  modalTitle: {
    fontSize: SIZES.font.xlarge,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  filterSection: {
    marginBottom: SIZES.spacing.large,
  },
  filterSectionTitle: {
    fontSize: SIZES.font.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.spacing.medium,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.spacing.small,
  },
  filterOptionText: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginLeft: SIZES.spacing.small,
  },
});

export default MapScreen;