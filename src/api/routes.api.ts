import { getJson } from './http';
import type { RouteSummary, RouteDetail } from '@/src/models/route';

/**
 * API de rutas
 * Endpoints:
 * - GET /routes - Lista todas las rutas
 * - GET /routes/{id} - Detalle de una ruta específica
 */

/**
 * Obtiene la lista de todas las rutas disponibles
 * @returns Promise con array de RouteSummary
 * @throws Error con mensaje claro si falla
 */
export async function fetchRoutes(): Promise<RouteSummary[]> {
  try {
    return await getJson<RouteSummary[]>('/routes');
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
    return await getJson<RouteDetail>(`/routes/${id}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al cargar detalle de ruta: ${error.message}`);
    }
    throw new Error('Error desconocido al cargar detalle de ruta');
  }
}
