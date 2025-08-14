import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/common/Header';
import { COLORS } from '../constants';

const MessengerScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header
        title="Mesaje"
        subtitle="Comunică cu alți membri"
        backgroundColor={COLORS.background}
        textColor={COLORS.text}
        showBackButton
        onBackPress={() => {}}
      />
      <View style={styles.content}>
        <Text style={styles.text}>Ecranul pentru mesaje va fi implementat aici</Text>
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

export default MessengerScreen;