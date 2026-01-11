import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">RealGo</ThemedText>
        <ThemedText style={styles.subtitle}>Transport MVP</ThemedText>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/routes')}
        >
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>🚌</Text>
          </View>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Browse Routes
          </ThemedText>
          <ThemedText style={styles.cardDescription}>
            View available routes and book your trip
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/trips')}
        >
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>🎫</Text>
          </View>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            My Trips
          </ThemedText>
          <ThemedText style={styles.cardDescription}>
            View your booked trips and status
          </ThemedText>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
            About RealGo
          </ThemedText>
          <ThemedText style={styles.infoText}>
            Simple transportation with fixed routes and stops. No payments in app, no real-time tracking.
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  actionCard: {
    backgroundColor: '#007AFF10',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconText: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  infoCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  infoTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
});
