import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { routesApi } from '@/src/api/routes.api';
import { tripsApi } from '@/src/api/trips.api';
import type { RouteDetail } from '@/src/models/route';

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash' },
  { id: 'yape', label: 'Yape' },
  { id: 'pling', label: 'Plin' },
] as const;

type PaymentMethod = typeof PAYMENT_METHODS[number]['id'];

export default function TripConfirmScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const [route, setRoute] = useState<RouteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedPickup, setSelectedPickup] = useState<string | null>(null);
  const [selectedDropoff, setSelectedDropoff] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cash');

  useEffect(() => {
    loadRoute();
  }, [routeId]);

  const loadRoute = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await routesApi.getRouteById(routeId);
      setRoute(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading route');
    } finally {
      setLoading(false);
    }
  };

  const handleBookTrip = async () => {
    if (!route) return;

    try {
      setSubmitting(true);
      setError(null);

      const tripData = {
        route_id: route.id,
        pickup_stop_id: selectedPickup || null,
        dropoff_stop_id: selectedDropoff || null,
        payment_method: selectedPayment,
      };

      const trip = await tripsApi.createTrip(tripData);
      
      Alert.alert(
        'Trip Booked!',
        'Your trip has been successfully booked.',
        [
          {
            text: 'View Trip',
            onPress: () => router.replace(`/trips/${trip.id}`),
          },
        ]
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error booking trip');
      Alert.alert('Error', 'Failed to book trip. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading route...</ThemedText>
      </ThemedView>
    );
  }

  if (error && !route) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={loadRoute}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (!route) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Route not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title">Book Trip</ThemedText>
          <ThemedText style={styles.routeName}>{route.name}</ThemedText>
          <ThemedText style={styles.routeInfo}>
            {route.origin} → {route.destination}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Pickup Stop (Optional)
          </ThemedText>
          <TouchableOpacity
            style={[styles.optionButton, !selectedPickup && styles.selectedOption]}
            onPress={() => setSelectedPickup(null)}
          >
            <Text style={styles.optionText}>Origin ({route.origin})</Text>
            {!selectedPickup && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          {route.stops.map((stop) => (
            <TouchableOpacity
              key={stop.id}
              style={[styles.optionButton, selectedPickup === stop.id && styles.selectedOption]}
              onPress={() => setSelectedPickup(stop.id)}
            >
              <Text style={styles.optionText}>{stop.name}</Text>
              {selectedPickup === stop.id && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Dropoff Stop (Optional)
          </ThemedText>
          <TouchableOpacity
            style={[styles.optionButton, !selectedDropoff && styles.selectedOption]}
            onPress={() => setSelectedDropoff(null)}
          >
            <Text style={styles.optionText}>Destination ({route.destination})</Text>
            {!selectedDropoff && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          {route.stops.map((stop) => (
            <TouchableOpacity
              key={stop.id}
              style={[styles.optionButton, selectedDropoff === stop.id && styles.selectedOption]}
              onPress={() => setSelectedDropoff(stop.id)}
            >
              <Text style={styles.optionText}>{stop.name}</Text>
              {selectedDropoff === stop.id && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Payment Method
          </ThemedText>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[styles.optionButton, selectedPayment === method.id && styles.selectedOption]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <Text style={styles.optionText}>{method.label}</Text>
              {selectedPayment === method.id && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.priceSection}>
          <ThemedText type="defaultSemiBold">Total Price:</ThemedText>
          <ThemedText style={styles.price}>
            {route.base_price.toFixed(2)} {route.currency}
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[styles.bookButton, submitting && styles.disabledButton]}
          onPress={handleBookTrip}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.bookButtonText}>Confirm Booking</Text>
          )}
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
  },
  routeName: {
    fontSize: 18,
    marginTop: 8,
  },
  routeInfo: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF10',
  },
  optionText: {
    fontSize: 16,
  },
  checkmark: {
    color: '#007AFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#8E8E93',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
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
