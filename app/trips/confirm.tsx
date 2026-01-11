import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchRouteDetail } from '@/src/api/routes.api';
import { createTrip } from '@/src/api/trips.api';
import type { RouteDetail } from '@/src/models/route';

// Simple homemade dropdown since we want simple UI
const Dropdown = ({ label, items, selectedValue, onValueChange }: any) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionsContainer}>
        {items.map((item: any) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.option,
              selectedValue === item.value && styles.optionSelected
            ]}
            onPress={() => onValueChange(item.value)}
          >
            <Text style={[
              styles.optionText,
              selectedValue === item.value && styles.optionTextSelected
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function TripConfirmScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const router = useRouter();

  const [route, setRoute] = useState<RouteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [pickupId, setPickupId] = useState<string>('');
  const [dropoffId, setDropoffId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'yape' | 'pling'>('cash');

  useEffect(() => {
    if (routeId) {
      loadRoute();
    }
  }, [routeId]);

  const loadRoute = async () => {
    try {
      setLoading(true);
      const data = await fetchRouteDetail(routeId!);
      data.stops.sort((a, b) => a.stopOrder - b.stopOrder);
      setRoute(data);
      if (data.stops.length > 0) {
        setPickupId(data.stops[0].id);
        setDropoffId(data.stops[data.stops.length - 1].id);
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo cargar la información de la ruta');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!pickupId || !dropoffId) {
      Alert.alert('Error', 'Selecciona origen y destino');
      return;
    }

    // Validate order? (Optional but good)
    const pickupIndex = route?.stops.findIndex(s => s.id === pickupId) ?? -1;
    const dropoffIndex = route?.stops.findIndex(s => s.id === dropoffId) ?? -1;

    if (pickupIndex >= dropoffIndex && pickupIndex !== -1 && dropoffIndex !== -1) {
       Alert.alert('Error', 'La parada de destino debe ser posterior a la de origen');
       return;
    }

    try {
      setSubmitting(true);
      const trip = await createTrip({
        routeId: routeId!,
        pickupStopId: pickupId,
        dropoffStopId: dropoffId,
        paymentMethod: paymentMethod,
        // scheduledAt: new Date().toISOString() // Optional, depends on backend
      });
      
      router.replace(`/trips/${trip.id}`);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo crear el viaje');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !route) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  const stopOptions = route.stops.map(s => ({ label: s.name, value: s.id }));
  const paymentOptions = [
    { label: 'Efectivo', value: 'cash' },
    { label: 'Yape', value: 'yape' },
    { label: 'Plin', value: 'pling' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Confirmar Viaje</Text>
      <Text style={styles.subtitle}>Ruta: {route.name}</Text>

      <Dropdown
        label="Punto de Recogida"
        items={stopOptions}
        selectedValue={pickupId}
        onValueChange={setPickupId}
      />

      <Dropdown
        label="Punto de Bajada"
        items={stopOptions}
        selectedValue={dropoffId}
        onValueChange={setDropoffId}
      />

      <Dropdown
        label="Método de Pago"
        items={paymentOptions}
        selectedValue={paymentMethod}
        onValueChange={setPaymentMethod}
      />

      <TouchableOpacity
        style={[styles.confirmButton, submitting && styles.disabledButton]}
        onPress={handleConfirm}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.confirmButtonText}>Confirmar Reserva</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },

  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
    marginRight: 8,
  },
  optionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: { color: '#333' },
  optionTextSelected: { color: 'white', fontWeight: 'bold' },

  confirmButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  disabledButton: { opacity: 0.7 },
  confirmButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
