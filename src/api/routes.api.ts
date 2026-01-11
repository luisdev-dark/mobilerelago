import { getJson } from './http';
import { API_ENDPOINTS } from '@/src/config/config';
import type { RouteSummary, RouteDetail } from '@/src/models/route';

/**
 * API de rutas
 * Endpoints:
 * - GET /api/routes - Lista todas las rutas
 * - GET /api/routes/{id} - Detalle de una ruta específica
 */

/**
 * Obtiene la lista de todas las rutas disponibles
 * @returns Promise con array de RouteSummary
 * @throws Error con mensaje claro si falla
 */
export async function fetchRoutes(): Promise<RouteSummary[]> {
  try {
    const response = await getJson<any[]>(API_ENDPOINTS.routes);
    // Map backend snake_case to frontend camelCase
    return response.map(r => ({
      id: r.id,
      name: r.name,
      isActive: r.is_active,
      originName: r.origin_name,
      originLat: r.origin_lat,
      originLon: r.origin_lon,
      destinationName: r.destination_name,
      destinationLat: r.destination_lat,
      destinationLon: r.destination_lon,
      basePriceCents: r.base_price_cents,
      currency: r.currency,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al cargar rutas: ${error.message}`);
    }
    throw new Error('Error desconocido al cargar rutas');
  }
}

/**
 * Obtiene el detalle completo de una ruta incluyendo paradas
 * @param id - ID de la ruta
 * @returns Promise con RouteDetail
 * @throws Error con mensaje claro si falla
 */
export async function fetchRouteDetail(id: string): Promise<RouteDetail> {
  try {
    const r = await getJson<any>(API_ENDPOINTS.routeById(id));

    // Map backend snake_case to frontend camelCase
    return {
      id: r.id,
      name: r.name,
      origin: r.origin,
      destination: r.destination,
      basePrice: r.base_price,
      currency: r.currency,
      stops: (r.stops || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        stopOrder: s.stop_order,
      })),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al cargar detalle de ruta: ${error.message}`);
    }
    throw new Error('Error desconocido al cargar detalle de ruta');
  }
}
