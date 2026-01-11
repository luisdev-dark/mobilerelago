import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { tripsApi } from '@/src/api/trips.api';
import type { TripDetail } from '@/src/models/trip';

const STATUS_COLORS: Record<string, string> = {
  requested: '#FF9500',
  confirmed: '#007AFF',
  completed: '#34C759',
  cancelled: '#FF3B30',
};

const STATUS_LABELS: Record<string, string> = {
  requested: 'Requested',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tripsApi.getTripById(id);
      setTrip(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading trip');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading trip details...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={loadTrip}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (!trip) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Trip not found</ThemedText>
      </ThemedView>
    );
  }

  const statusColor = STATUS_COLORS[trip.status] || '#8E8E93';
  const statusLabel = STATUS_LABELS[trip.status] || trip.status;

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title">Trip Details</ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Route
          </ThemedText>
          <ThemedText style={styles.routeName}>{trip.route.name}</ThemedText>
          <ThemedText style={styles.routeInfo}>
            {trip.route.origin} → {trip.route.destination}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Pickup
          </ThemedText>
          {trip.pickup ? (
            <ThemedText style={styles.stopText}>{trip.pickup.name}</ThemedText>
          ) : (
            <ThemedText style={styles.stopText}>{trip.route.origin}</ThemedText>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Dropoff
          </ThemedText>
          {trip.dropoff ? (
            <ThemedText style={styles.stopText}>{trip.dropoff.name}</ThemedText>
          ) : (
            <ThemedText style={styles.stopText}>{trip.route.destination}</ThemedText>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Payment
          </ThemedText>
          <View style={styles.paymentInfo}>
            <ThemedText style={styles.paymentMethod}>
              {trip.payment_method.charAt(0).toUpperCase() + trip.payment_method.slice(1)}
            </ThemedText>
            <ThemedText style={styles.price}>
              {trip.price.toFixed(2)} {trip.currency}
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Schedule
          </ThemedText>
          {trip.scheduled_at ? (
            <ThemedText style={styles.scheduleText}>
              {new Date(trip.scheduled_at).toLocaleString()}
            </ThemedText>
          ) : (
            <ThemedText style={styles.scheduleText}>Immediate departure</ThemedText>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Trip ID
          </ThemedText>
          <ThemedText style={styles.tripId}>{trip.id}</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Booked At
          </ThemedText>
          <ThemedText style={styles.bookedAt}>
            {new Date(trip.created_at).toLocaleString()}
          </ThemedText>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  routeInfo: {
    fontSize: 16,
  },
  stopText: {
    fontSize: 16,
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethod: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  scheduleText: {
    fontSize: 16,
  },
  tripId: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'monospace',
  },
  bookedAt: {
    fontSize: 14,
    color: '#8E8E93',
  },
  backButton: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
