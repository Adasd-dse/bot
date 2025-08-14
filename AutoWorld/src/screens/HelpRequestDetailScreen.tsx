import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/common/Header';
import { COLORS } from '../constants';

const HelpRequestDetailScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header
        title="Detalii Cerere Ajutor"
        subtitle="Informații despre cererea de ajutor"
        backgroundColor={COLORS.background}
        textColor={COLORS.text}
        showBackButton
        onBackPress={() => {}}
      />
      <View style={styles.content}>
        <Text style={styles.text}>Ecranul pentru detalii cerere ajutor va fi implementat aici</Text>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: COLORS.text,
  },
});

export default HelpRequestDetailScreen;