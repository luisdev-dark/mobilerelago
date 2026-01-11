import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { tripsApi } from '@/src/api/trips.api';

// For MVP, we'll use a hardcoded list of trip IDs
// In a real app, this would come from an endpoint like GET /trips?passenger_id=xxx
const MOCK_TRIP_IDS: string[] = [
  // Add some example trip IDs here, or leave empty
];

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

export default function TripsListScreen() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For MVP, load trips from hardcoded IDs
      // In production, you'd have an endpoint to get user's trips
      if (MOCK_TRIP_IDS.length === 0) {
        setTrips([]);
        return;
      }

      const tripPromises = MOCK_TRIP_IDS.map(id => tripsApi.getTripById(id));
      const tripData = await Promise.all(tripPromises);
      setTrips(tripData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading trips');
    } finally {
      setLoading(false);
    }
  };

  const renderTrip = ({ item }: { item: any }) => {
    const statusColor = STATUS_COLORS[item.status] || '#8E8E93';
    const statusLabel = STATUS_LABELS[item.status] || item.status;

    return (
      <TouchableOpacity
        style={styles.tripCard}
        onPress={() => router.push(`/trips/${item.id}`)}
      >
        <ThemedView style={styles.tripCardInner}>
          <View style={styles.tripHeader}>
            <ThemedText style={styles.routeName}>{item.route.name}</ThemedText>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusBadgeText}>{statusLabel}</Text>
            </View>
          </View>
          <ThemedText style={styles.tripInfo}>
            {item.route.origin} → {item.route.destination}
          </ThemedText>
          <View style={styles.tripFooter}>
            <ThemedText style={styles.price}>
              {item.price.toFixed(2)} {item.currency}
            </ThemedText>
            <ThemedText style={styles.date}>
              {new Date(item.created_at).toLocaleDateString()}
            </ThemedText>
          </View>
        </ThemedView>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading trips...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={loadTrips}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No trips yet</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Book your first trip to see it here
            </ThemedText>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push('/routes')}
            >
              <Text style={styles.browseButtonText}>Browse Routes</Text>
            </TouchableOpacity>
          </ThemedView>
        }
      />
    </ThemedView>
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
  listContent: {
    padding: 16,
  },
  tripCard: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tripCardInner: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tripInfo: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  date: {
    fontSize: 12,
    color: '#8E8E93',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
