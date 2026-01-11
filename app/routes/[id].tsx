import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchRouteDetail } from '@/src/api/routes.api';
import type { RouteDetail, RouteStop } from '@/src/models/route';

export default function RouteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [route, setRoute] = useState<RouteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    loadRoute();
  }, [id]);

  const loadRoute = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRouteDetail(id!);
      // Sort stops
      data.stops.sort((a, b) => a.stopOrder - b.stopOrder);
      setRoute(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar detalle');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  if (error || !route) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Ruta no encontrada'}</Text>
        <TouchableOpacity onPress={loadRoute} style={styles.button}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{route.name}</Text>
        <Text style={styles.subtitle}>{route.origin} → {route.destination}</Text>
        <Text style={styles.price}>Base: {route.currency} {route.basePrice.toFixed(2)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Paradas:</Text>
      <FlatList
        data={route.stops}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.stopItem}>
            <Text style={styles.stopOrder}>{item.stopOrder}</Text>
            <Text style={styles.stopName}>{item.name}</Text>
          </View>
        )}
        style={styles.list}
      />

      <TouchableOpacity
        style={styles.reserveButton}
        onPress={() => router.push({
            pathname: '/trips/confirm',
            params: { routeId: route.id }
        })}
      >
        <Text style={styles.reserveButtonText}>Reservar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4 },
  price: { fontSize: 18, color: '#007AFF', marginTop: 8, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', margin: 16 },
  list: { flex: 1, paddingHorizontal: 16 },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
  },
  stopOrder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#eee',
    textAlign: 'center',
    textAlignVertical: 'center', // Android only
    lineHeight: 30, // iOS
    marginRight: 12,
    fontWeight: 'bold',
  },
  stopName: { fontSize: 16 },
  reserveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  reserveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: 'red', marginBottom: 16 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
