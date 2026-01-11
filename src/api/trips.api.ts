import { getJson, postJson } from './http';
import type { Trip, CreateTripRequest } from '@/src/models/trip';

/**
 * API de viajes (trips)
 * Endpoints:
 * - POST /trips - Crear un nuevo viaje
 * - GET /trips/{id} - Obtener detalle de un viaje
 */

/**
 * Crea un nuevo viaje (reserva)
 * @param data - Datos del viaje a crear
 * @returns Promise con el Trip creado
 * @throws Error con mensaje claro si falla
 */
export async function createTrip(data: CreateTripRequest): Promise<Trip> {
  try {
    // Convertir camelCase a snake_case para el backend
    const backendData = {
      route_id: data.routeId,
      pickup_stop_id: data.pickupStopId,
      dropoff_stop_id: data.dropoffStopId,
      payment_method: data.paymentMethod,
      scheduled_at: data.scheduledAt,
    };

    const response = await postJson<any>('/trips', backendData);
    
    // Convertir snake_case a camelCase para el frontend
    return {
      id: response.id,
      routeId: response.route_id,
      passengerId: response.passenger_id,
      pickupStopId: response.pickup_stop_id,
      dropoffStopId: response.dropoff_stop_id,
      status: response.status,
      paymentMethod: response.payment_method,
      priceCents: response.price_cents,
      currency: response.currency,
      scheduledAt: response.scheduled_at,
      startedAt: response.started_at,
      finishedAt: response.finished_at,
      cancelledAt: response.cancelled_at,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al crear viaje: ${error.message}`);
    }
    throw new Error('Error desconocido al crear viaje');
  }
}

/**
 * Obtiene el detalle de un viaje específico
 * @param id - ID del viaje
 * @returns Promise con el Trip
 * @throws Error con mensaje claro si falla
 */
export async function fetchTrip(id: string): Promise<Trip> {
  try {
    const response = await getJson<any>(`/trips/${id}`);
    
    // Convertir snake_case a camelCase para el frontend
    return {
      id: response.id,
      routeId: response.route_id,
      passengerId: response.passenger_id,
      pickupStopId: response.pickup_stop_id,
      dropoffStopId: response.dropoff_stop_id,
      status: response.status,
      paymentMethod: response.payment_method,
      priceCents: response.price_cents,
      currency: response.currency,
      scheduledAt: response.scheduled_at,
      startedAt: response.started_at,
      finishedAt: response.finished_at,
      cancelledAt: response.cancelled_at,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al obtener viaje: ${error.message}`);
    }
    throw new Error('Error desconocido al obtener viaje');
  }
}
