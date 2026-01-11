/**
 * Modelos de viajes (trips)
 * Mantener MVP simple con campos esenciales
 */

/**
 * CreateTripRequest - Datos para crear un nuevo viaje
 * Se envía al backend en POST /trips
 */
export interface CreateTripRequest {
  routeId: string;
  pickupStopId?: string | null;
  dropoffStopId?: string | null;
  paymentMethod: 'cash' | 'yape' | 'pling';
  scheduledAt?: string | null;
}

/**
 * Trip - Modelo completo de un viaje
 * Respuesta del backend con todos los campos
 */
export interface Trip {
  id: string;
  routeId: string;
  passengerId: string;
  pickupStopId: string | null;
  dropoffStopId: string | null;
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
  paymentMethod: 'cash' | 'yape' | 'pling';
  priceCents: number;
  currency: string;
  scheduledAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}
