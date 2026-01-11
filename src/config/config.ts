/**
 * Configuración de la API
 * 
 * IMPORTANTE: Esta app corre en un dispositivo físico o emulador.
 * NO usar localhost - usar una URL pública accesible (ej: ngrok, tu IP local, o servidor en la nube)
 * 
 * Ejemplos:
 * - ngrok: https://abc123.ngrok.io
 * - IP local: http://192.168.1.100:8080
 * - Servidor: https://api.tudominio.com
 */
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://tu-ngrok-url.ngrok.io';

export const API_ENDPOINTS = {
  routes: '/routes',
  routeById: (id: string) => `/routes/${id}`,
  trips: '/trips',
  tripById: (id: string) => `/trips/${id}`,
} as const;
