import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { COLORS, SIZES, FONTS } from '../constants';
import { HelpRequest, User } from '../types';

// Date mock pentru demonstrație
const mockHelpRequests: HelpRequest[] = [
  {
    id: '1',
    requesterId: 'user1',
    type: 'flat_tire',
    description: 'Am o pană pe drumul spre București, am nevoie de ajutor cu schimbarea roții',
    location: {
      latitude: 44.4268,
      longitude: 26.1025,
      address: 'DN1, lângă Băneasa',
    },
    urgency: 'medium',
    status: 'open',
    helpers: [],
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minute în urmă
  },
  {
    id: '2',
    requesterId: 'user2',
    type: 'dead_battery',
    description: 'Bateria s-a descărcat, am nevoie de un boost',
    location: {
      latitude: 44.4368,
      longitude: 26.1125,
      address: 'Strada Victoriei, București',
    },
    urgency: 'high',
    status: 'assigned',
    helpers: ['helper1'],
    assignedHelperId: 'helper1',
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minute în urmă
  },
];

const mockHelpers: User[] = [
  {
    id: 'helper1',
    username: 'road_angel',
    fullName: 'Maria Ionescu',
    avatar: 'https://via.placeholder.com/100x100',
    cars: [],
    badges: [],
    points: 2500,
    joinDate: new Date(),
    isPremium: true,
  },
];

const AutoHelpScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'requests' | 'my-requests' | 'my-help'>('requests');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState<HelpRequest['type']>('flat_tire');
  const [requestDescription, setRequestDescription] = useState('');
  const [requestUrgency, setRequestUrgency] = useState<HelpRequest['urgency']>('medium');
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>(mockHelpRequests);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    // Mock user data
    setUser({
      id: 'user1',
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

  const getRequestTypeIcon = (type: HelpRequest['type']) => {
    switch (type) {
      case 'flat_tire':
        return '🛞';
      case 'dead_battery':
        return '🔋';
      case 'out_of_fuel':
        return '⛽';
      case 'towing':
        return '🚛';
      case 'other':
        return '❓';
      default:
        return '🚗';
    }
  };

  const getRequestTypeText = (type: HelpRequest['type']) => {
    switch (type) {
      case 'flat_tire':
        return 'Pană';
      case 'dead_battery':
        return 'Baterie descărcată';
      case 'out_of_fuel':
        return 'Fără combustibil';
      case 'towing':
        return 'Tractare';
      case 'other':
        return 'Altceva';
      default:
        return 'Necunoscut';
    }
  };

  const getUrgencyColor = (urgency: HelpRequest['urgency']) => {
    switch (urgency) {
      case 'low':
        return COLORS.low;
      case 'medium':
        return COLORS.medium;
      case 'high':
        return COLORS.high;
      case 'emergency':
        return COLORS.emergency;
      default:
        return COLORS.medium;
    }
  };

  const getUrgencyText = (urgency: HelpRequest['urgency']) => {
    switch (urgency) {
      case 'low':
        return 'Scăzută';
      case 'medium':
        return 'Medie';
      case 'high':
        return 'Ridicată';
      case 'emergency':
        return 'Urgență';
      default:
        return 'Medie';
    }
  };

  const getStatusText = (status: HelpRequest['status']) => {
    switch (status) {
      case 'open':
        return 'Deschisă';
      case 'assigned':
        return 'Atribuită';
      case 'in_progress':
        return 'În progres';
      case 'completed':
        return 'Finalizată';
      case 'cancelled':
        return 'Anulată';
      default:
        return 'Necunoscut';
    }
  };

  const getStatusColor = (status: HelpRequest['status']) => {
    switch (status) {
      case 'open':
        return COLORS.info;
      case 'assigned':
        return COLORS.warning;
      case 'in_progress':
        return COLORS.secondary;
      case 'completed':
        return COLORS.success;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const handleCreateRequest = () => {
    if (!requestDescription.trim()) {
      Alert.alert('Eroare', 'Te rog să introduci o descriere pentru cererea ta');
      return;
    }

    const newRequest: HelpRequest = {
      id: Date.now().toString(),
      requesterId: user?.id || 'user1',
      type: selectedRequestType,
      description: requestDescription,
      location: {
        latitude: 44.4268, // Mock location
        longitude: 26.1025,
        address: 'Locația ta curentă',
      },
      urgency: requestUrgency,
      status: 'open',
      helpers: [],
      createdAt: new Date(),
    };

    setHelpRequests(prev => [newRequest, ...prev]);
    setShowNewRequestModal(false);
    setRequestDescription('');
    setSelectedRequestType('flat_tire');
    setRequestUrgency('medium');

    Alert.alert(
      'Cerere creată!',
      'Cererea ta de ajutor a fost creată și va fi vizibilă pentru alți utilizatori din apropiere.',
      [{ text: 'OK' }]
    );
  };

  const handleOfferHelp = (request: HelpRequest) => {
    if (request.status !== 'open') {
      Alert.alert('Eroare', 'Această cerere nu mai acceptă ajutor');
      return;
    }

    Alert.alert(
      'Oferă ajutor',
      `Ești sigur că vrei să oferi ajutor pentru "${getRequestTypeText(request.type)}"?`,
      [
        { text: 'Anulează', style: 'cancel' },
        {
          text: 'Ofer ajutor',
          onPress: () => {
            const updatedRequests = helpRequests.map(req =>
              req.id === request.id
                ? { ...req, status: 'assigned', assignedHelperId: user?.id }
                : req
            );
            setHelpRequests(updatedRequests);
            Alert.alert('Succes!', 'Ai oferit ajutor pentru această cerere.');
          },
        },
      ]
    );
  };

  const renderRequestCard = ({ item }: { item: HelpRequest }) => (
    <Card style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.requestTypeContainer}>
          <Text style={styles.requestTypeIcon}>
            {getRequestTypeIcon(item.type)}
          </Text>
          <View>
            <Text style={styles.requestTypeText}>
              {getRequestTypeText(item.type)}
            </Text>
            <Text style={styles.requestTime}>
              {Math.floor((Date.now() - item.createdAt.getTime()) / (1000 * 60))} min în urmă
            </Text>
          </View>
        </View>
        <View style={styles.requestStatusContainer}>
          <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(item.urgency) }]}>
            <Text style={styles.urgencyText}>{getUrgencyText(item.urgency)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.requestDescription}>{item.description}</Text>
      
      <View style={styles.requestLocation}>
        <Ionicons name="location" size={16} color={COLORS.textSecondary} />
        <Text style={styles.locationText}>{item.location.address}</Text>
      </View>

      <View style={styles.requestActions}>
        {item.status === 'open' && (
          <Button
            title="Ofer ajutor"
            onPress={() => handleOfferHelp(item)}
            variant="primary"
            size="small"
            style={styles.helpButton}
          />
        )}
        <Button
          title="Vezi detalii"
          onPress={() => navigation.navigate('HelpRequestDetail' as never, { request: item } as never)}
          variant="outline"
          size="small"
        />
      </View>
    </Card>
  );

  const renderNewRequestModal = () => (
    <Modal
      visible={showNewRequestModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowNewRequestModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Cerere de ajutor nouă</Text>
            <TouchableOpacity onPress={() => setShowNewRequestModal(false)}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Tipul problemei</Text>
            <View style={styles.typeOptions}>
              {(['flat_tire', 'dead_battery', 'out_of_fuel', 'towing', 'other'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeOption,
                    selectedRequestType === type && styles.typeOptionSelected,
                  ]}
                  onPress={() => setSelectedRequestType(type)}
                >
                  <Text style={styles.typeOptionIcon}>
                    {getRequestTypeIcon(type)}
                  </Text>
                  <Text style={[
                    styles.typeOptionText,
                    selectedRequestType === type && styles.typeOptionTextSelected,
                  ]}>
                    {getRequestTypeText(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Urgența</Text>
            <View style={styles.urgencyOptions}>
              {(['low', 'medium', 'high', 'emergency'] as const).map((urgency) => (
                <TouchableOpacity
                  key={urgency}
                  style={[
                    styles.urgencyOption,
                    requestUrgency === urgency && styles.urgencyOptionSelected,
                  ]}
                  onPress={() => setRequestUrgency(urgency)}
                >
                  <Text style={[
                    styles.urgencyOptionText,
                    requestUrgency === urgency && styles.urgencyOptionTextSelected,
                  ]}>
                    {getUrgencyText(urgency)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Descrierea problemei</Text>
            <Text style={styles.formDescription}>
              Descrie cât mai detaliat problema întâlnită pentru a primi ajutorul potrivit.
            </Text>
            <Text style={styles.requestDescriptionInput}>
              {requestDescription || 'Descrie problema aici...'}
            </Text>
          </View>

          <View style={styles.modalActions}>
            <Button
              title="Anulează"
              onPress={() => setShowNewRequestModal(false)}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title="Creează cererea"
              onPress={handleCreateRequest}
              variant="primary"
              style={styles.createButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'requests':
        return (
          <FlatList
            data={helpRequests.filter(req => req.status === 'open')}
            renderItem={renderRequestCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.requestsList}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'my-requests':
        return (
          <FlatList
            data={helpRequests.filter(req => req.requesterId === user?.id)}
            renderItem={renderRequestCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.requestsList}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'my-help':
        return (
          <FlatList
            data={helpRequests.filter(req => req.assignedHelperId === user?.id)}
            renderItem={renderRequestCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.requestsList}
            showsVerticalScrollIndicator={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="AutoHelp"
        subtitle="Ajutor rapid între șoferi"
        backgroundColor={COLORS.background}
        textColor={COLORS.text}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            Cereri ({helpRequests.filter(req => req.status === 'open').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-requests' && styles.activeTab]}
          onPress={() => setActiveTab('my-requests')}
        >
          <Text style={[styles.tabText, activeTab === 'my-requests' && styles.activeTabText]}>
            Cererile mele
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-help' && styles.activeTab]}
          onPress={() => setActiveTab('my-help')}
        >
          <Text style={[styles.tabText, activeTab === 'my-help' && styles.activeTabText]}>
            Ajutorul meu
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderTabContent()}
      </View>

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowNewRequestModal(true)}
        >
          <Ionicons name="add" size={24} color={COLORS.background} />
        </TouchableOpacity>
      </View>

      {renderNewRequestModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.spacing.small,
    paddingVertical: SIZES.spacing.small,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.spacing.small,
    alignItems: 'center',
    borderRadius: SIZES.radius.medium,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.background,
  },
  content: {
    flex: 1,
  },
  requestsList: {
    padding: SIZES.spacing.medium,
  },
  requestCard: {
    marginBottom: SIZES.spacing.medium,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.spacing.medium,
  },
  requestTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  requestTypeIcon: {
    fontSize: 24,
    marginRight: SIZES.spacing.small,
  },
  requestTypeText: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  requestTime: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  requestStatusContainer: {
    alignItems: 'flex-end',
  },
  urgencyBadge: {
    paddingHorizontal: SIZES.spacing.small,
    paddingVertical: 4,
    borderRadius: SIZES.radius.small,
    marginBottom: SIZES.spacing.small,
  },
  urgencyText: {
    fontSize: SIZES.font.tiny,
    fontFamily: FONTS.medium,
    color: COLORS.background,
  },
  statusBadge: {
    paddingHorizontal: SIZES.spacing.small,
    paddingVertical: 4,
    borderRadius: SIZES.radius.small,
  },
  statusText: {
    fontSize: SIZES.font.tiny,
    fontFamily: FONTS.medium,
    color: COLORS.background,
  },
  requestDescription: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: SIZES.spacing.medium,
  },
  requestLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.medium,
  },
  locationText: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginLeft: SIZES.spacing.small,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helpButton: {
    flex: 1,
    marginRight: SIZES.spacing.small,
  },
  fabContainer: {
    position: 'absolute',
    bottom: SIZES.spacing.large,
    right: SIZES.spacing.large,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    maxHeight: '80%',
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
  formSection: {
    marginBottom: SIZES.spacing.large,
  },
  formLabel: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.spacing.small,
  },
  formDescription: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacing.small,
    lineHeight: 18,
  },
  typeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeOption: {
    width: '48%',
    alignItems: 'center',
    padding: SIZES.spacing.medium,
    borderWidth: 2,
    borderColor: COLORS.surface,
    borderRadius: SIZES.radius.medium,
    marginBottom: SIZES.spacing.small,
  },
  typeOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  typeOptionIcon: {
    fontSize: 32,
    marginBottom: SIZES.spacing.small,
  },
  typeOptionText: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  typeOptionTextSelected: {
    color: COLORS.primary,
  },
  urgencyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  urgencyOption: {
    flex: 1,
    alignItems: 'center',
    padding: SIZES.spacing.small,
    borderWidth: 2,
    borderColor: COLORS.surface,
    borderRadius: SIZES.radius.medium,
    marginHorizontal: SIZES.spacing.small,
  },
  urgencyOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  urgencyOptionText: {
    fontSize: SIZES.font.small,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  urgencyOptionTextSelected: {
    color: COLORS.primary,
  },
  requestDescriptionInput: {
    fontSize: SIZES.font.medium,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    padding: SIZES.spacing.medium,
    borderWidth: 1,
    borderColor: COLORS.surface,
    borderRadius: SIZES.radius.medium,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: SIZES.spacing.small,
  },
  createButton: {
    flex: 1,
    marginLeft: SIZES.spacing.small,
  },
});

export default AutoHelpScreen;