import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchTrip } from '@/src/api/trips.api';
import type { Trip } from '@/src/models/trip';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrip = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTrip(id!);
      setTrip(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar viaje');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadTrip();
  }, [id]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  if (error || !trip) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Viaje no encontrado'}</Text>
        <TouchableOpacity onPress={loadTrip} style={styles.button}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#34C759';
      case 'completed': return '#007AFF';
      case 'cancelled': return '#FF3B30';
      default: return '#FF9500'; // requested
    }
  };

  const getPaymentLabel = (method: string) => {
      switch(method) {
          case 'cash': return 'Efectivo';
          case 'yape': return 'Yape';
          case 'pling': return 'Plin';
          default: return method;
      }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Viaje #{trip.id.slice(0, 8)}</Text>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
          <Text style={styles.statusText}>{trip.status.toUpperCase()}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Método de Pago:</Text>
          <Text style={styles.value}>{getPaymentLabel(trip.paymentMethod)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Precio:</Text>
          <Text style={styles.value}>{trip.currency} {(trip.priceCents / 100).toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Programado:</Text>
            <Text style={styles.value}>
                {trip.scheduledAt ? new Date(trip.scheduledAt).toLocaleString() : 'Inmediato'}
            </Text>
        </View>
      </View>

      <TouchableOpacity onPress={loadTrip} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>Actualizar Estado</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/routes')} style={styles.homeButton}>
        <Text style={styles.homeButtonText}>Volver al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 20,
  },
  statusText: { color: 'white', fontWeight: 'bold' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  label: { color: '#666', fontSize: 16 },
  value: { fontWeight: '600', fontSize: 16 },

  refreshButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  refreshButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  homeButton: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  homeButtonText: { color: '#007AFF', fontSize: 16 },

  errorText: { color: 'red', marginBottom: 16 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
