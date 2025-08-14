import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import { User, Car, Badge } from '../types';

// Date mock pentru demonstrație
const mockUser: User = {
  id: '1',
  username: 'car_lover',
  email: 'ion.popescu@email.com',
  fullName: 'Ion Popescu',
  avatar: 'https://via.placeholder.com/100x100',
  location: {
    latitude: 44.4268,
    longitude: 26.1025,
    address: 'București, România',
  },
  cars: [
    {
      id: '1',
      brand: 'BMW',
      model: 'E36',
      year: 1995,
      engine: '2.0L 4-cylinder',
      modifications: [],
      photos: ['https://via.placeholder.com/300x200'],
      description: 'Mașina mea de proiect pentru tuning',
      mileage: 250000,
      fuelType: 'gasoline',
    },
    {
      id: '2',
      brand: 'Volkswagen',
      model: 'Golf GTI',
      year: 2018,
      engine: '2.0L TSI',
      modifications: [],
      photos: ['https://via.placeholder.com/300x200'],
      description: 'Mașina de zi cu zi',
      mileage: 45000,
      fuelType: 'gasoline',
    },
  ],
  badges: [
    {
      id: '1',
      name: 'Primul Post',
      description: 'Ai creat primul tău post în comunitate',
      icon: '🏆',
      category: 'achievement',
      rarity: 'common',
      earnedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      name: 'Ajutor Comunitate',
      description: 'Ai oferit ajutor altor membri',
      icon: '🤝',
      category: 'help',
      rarity: 'rare',
      earnedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
  ],
  points: 1250,
  joinDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
  isPremium: false,
};

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<User>(mockUser);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return COLORS.common;
      case 'rare':
        return COLORS.rare;
      case 'epic':
        return COLORS.epic;
      case 'legendary':
        return COLORS.legendary;
      default:
        return COLORS.textSecondary;
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'Comun';
      case 'rare':
        return 'Rar';
      case 'epic':
        return 'Epic';
      case 'legendary':
        return 'Legendary';
      default:
        return 'Necunoscut';
    }
  };

  const renderCarCard = ({ item }: { item: Car }) => (
    <Card style={styles.carCard}>
      <View style={styles.carImageContainer}>
        <Text style={styles.carImagePlaceholder}>
          🚗
        </Text>
      </View>
      <View style={styles.carContent}>
        <Text style={styles.carTitle}>{item.brand} {item.model}</Text>
        <Text style={styles.carYear}>{item.year}</Text>
        <Text style={styles.carEngine}>{item.engine}</Text>
        <Text style={styles.carMileage}>{item.mileage.toLocaleString()} km</Text>
        <Text style={styles.carDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Button
          title="Vezi detalii"
          onPress={() => {
            // Navigare la detalii mașină
          }}
          variant="outline"
          size="small"
        />
      </View>
    </Card>
  );

  const renderBadgeCard = ({ item }: { item: Badge }) => (
    <Card style={styles.badgeCard}>
      <View style={styles.badgeIconContainer}>
        <Text style={styles.badgeIcon}>{item.icon}</Text>
      </View>
      <View style={styles.badgeContent}>
        <Text style={styles.badgeName}>{item.name}</Text>
        <Text style={styles.badgeDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(item.rarity) }]}>
          <Text style={styles.rarityText}>{getRarityText(item.rarity)}</Text>
        </View>
        <Text style={styles.badgeDate}>
          Câștigat {item.earnedAt.toLocaleDateString('ro-RO')}
        </Text>
      </View>
    </Card>
  );

  const renderMenuItem = (icon: string, title: string, subtitle: string, onPress: () => void) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon as any} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Profil"
        subtitle="Gestionează-ți contul și preferințele"
        backgroundColor={COLORS.background}
        textColor={COLORS.text}
        rightIcon="settings"
        onRightPress={() => {
          // Navigare la setări
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Profil */}
        <Card style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{user.fullName}</Text>
              <Text style={styles.profileUsername}>@{user.username}</Text>
              <Text style={styles.profileLocation}>
                📍 {user.location?.address}
              </Text>
              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{user.points}</Text>
                  <Text style={styles.statLabel}>Puncte</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{user.cars.length}</Text>
                  <Text style={styles.statLabel}>Mașini</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{user.badges.length}</Text>
                  <Text style={styles.statLabel}>Badge-uri</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.profileActions}>
            <Button
              title="Editează Profil"
              onPress={() => {
                // Navigare la editare profil
              }}
              variant="outline"
              size="small"
              style={styles.editButton}
            />
            {!user.isPremium && (
              <Button
                title="Upgrade Premium"
                onPress={() => {
                  // Navigare la upgrade premium
                }}
                variant="secondary"
                size="small"
                style={styles.premiumButton}
              />
            )}
          </View>
        </Card>

        {/* Meniu Principal */}
        <Card style={styles.menuCard}>
          <Text style={styles.sectionTitle}>Meniu Principal</Text>
          
          {renderMenuItem(
            'car-outline',
            'Garajul meu',
            `${user.cars.length} mașini înregistrate`,
            () => {
              // Navigare la garaj
            }
          )}
          
          {renderMenuItem(
            'chatbubbles-outline',
            'Mesaje',
            'Comunică cu alți membri',
            () => navigation.navigate('Messenger' as never)
          )}
          
          {renderMenuItem(
            'help-circle-outline',
            'AutoHelp',
            'Ajutor și asistență',
            () => navigation.navigate('AutoHelp' as never)
          )}
          
          {renderMenuItem(
            'newspaper-outline',
            'Blog & Știri',
            'Citește ultimele noutăți',
            () => navigation.navigate('Blog' as never)
          )}
          
          {renderMenuItem(
            'people-outline',
            'Cluburi & Uniuni',
            'Descoperă organizații auto',
            () => navigation.navigate('Clubs' as never)
          )}
        </Card>

        {/* Mașinile mele */}
        <Card style={styles.carsCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mașinile mele</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Vezi toate</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={user.cars}
            renderItem={renderCarCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carsList}
          />
        </Card>

        {/* Badge-urile mele */}
        <Card style={styles.badgesCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Badge-urile mele</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Vezi toate</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={user.badges}
            renderItem={renderBadgeCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesList}
          />
        </Card>

        {/* Informații cont */}
        <Card style={styles.accountCard}>
          <Text style={styles.sectionTitle}>Informații cont</Text>
          
          <View style={styles.accountInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Membru din:</Text>
              <Text style={styles.infoValue}>
                {user.joinDate.toLocaleDateString('ro-RO')}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <View style={styles.statusContainer}>
                <Text style={[
                  styles.statusText,
                  { color: user.isPremium ? COLORS.secondary : COLORS.textSecondary }
                ]}>
                  {user.isPremium ? 'Premium' : 'Standard'}
                </Text>
                {user.isPremium && (
                  <Ionicons name="star" size={16} color={COLORS.secondary} />
                )}
              </View>
            </View>
          </View>
        </Card>
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
  profileHeader: {
    margin: SIZES.spacing.medium,
    padding: SIZES.spacing.large,
  },
  profileInfo: {
    flexDirection: 'row',
    marginBottom: SIZES.spacing.large,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: SIZES.spacing.medium,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: SIZES.font.xlarge,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.spacing.small,
  },
  profileUsername: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginBottom: SIZES.spacing.small,
  },
  profileLocation: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacing.medium,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: SIZES.font.large,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    marginRight: SIZES.spacing.small,
  },
  premiumButton: {
    flex: 1,
    marginLeft: SIZES.spacing.small,
  },
  menuCard: {
    margin: SIZES.spacing.medium,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: SIZES.font.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.spacing.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.spacing.medium,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  carsCard: {
    margin: SIZES.spacing.medium,
    marginTop: 0,
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
  carsList: {
    paddingRight: SIZES.spacing.medium,
  },
  carCard: {
    width: 280,
    marginRight: SIZES.spacing.medium,
    margin: 0,
  },
  carImageContainer: {
    height: 150,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacing.medium,
  },
  carImagePlaceholder: {
    fontSize: 48,
  },
  carContent: {
    flex: 1,
  },
  carTitle: {
    fontSize: SIZES.font.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.spacing.small,
  },
  carYear: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.medium,
    color: COLORS.secondary,
    marginBottom: SIZES.spacing.small,
  },
  carEngine: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacing.small,
  },
  carMileage: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacing.small,
  },
  carDescription: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacing.medium,
    lineHeight: 18,
  },
  badgesCard: {
    margin: SIZES.spacing.medium,
    marginTop: 0,
  },
  badgesList: {
    paddingRight: SIZES.spacing.medium,
  },
  badgeCard: {
    width: 250,
    marginRight: SIZES.spacing.medium,
    margin: 0,
  },
  badgeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacing.medium,
    alignSelf: 'center',
  },
  badgeIcon: {
    fontSize: 32,
  },
  badgeContent: {
    alignItems: 'center',
  },
  badgeName: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.spacing.small,
  },
  badgeDescription: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.spacing.medium,
    lineHeight: 18,
  },
  rarityBadge: {
    paddingHorizontal: SIZES.spacing.small,
    paddingVertical: 4,
    borderRadius: SIZES.radius.small,
    marginBottom: SIZES.spacing.small,
  },
  rarityText: {
    fontSize: SIZES.font.tiny,
    fontFamily: FONTS.medium,
    color: COLORS.background,
  },
  badgeDate: {
    fontSize: SIZES.font.tiny,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  accountCard: {
    margin: SIZES.spacing.medium,
    marginTop: 0,
    marginBottom: SIZES.spacing.xlarge,
  },
  accountInfo: {
    marginTop: SIZES.spacing.medium,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  infoLabel: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.medium,
    marginRight: SIZES.spacing.small,
  },
});

export default ProfileScreen;