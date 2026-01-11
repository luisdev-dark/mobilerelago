/**
 * Modelos de rutas
 * Tipos claros usando camelCase en frontend
 */

/**
 * RouteSummary - Resumen de ruta para listados
 * Representa una ruta en la lista principal
 */
export interface RouteSummary {
  id: string;
  name: string;
  isActive: boolean;
  originName: string;
  originLat: number;
  originLon: number;
  destinationName: string;
  destinationLat: number;
  destinationLon: number;
  basePriceCents: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * RouteStop - Parada intermedia (anexo) de una ruta
 * Representa un punto de recogida/bajada opcional
 */
export interface RouteStop {
  id: string;
  name: string;
  stopOrder: number;
}

/**
 * RouteDetail - Detalle completo de una ruta
 * Incluye información completa y lista de paradas
 */
export interface RouteDetail {
  id: string;
  name: string;
  origin: string;
  destination: string;
  basePrice: number;
  currency: string;
  stops: RouteStop[];
}
