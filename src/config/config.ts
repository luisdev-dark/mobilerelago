// Expo Go corre en celular, por eso NO sirve localhost
// Ejemplo: https://TU_PROYECTO.vercel.app
export const BASE_URL = 'https://TU_PROYECTO.vercel.app';

export const API_ENDPOINTS = {
  routes: '/api/routes',
  routeById: (id: string) => `/api/routes/${id}`,
  trips: '/api/trips',
  tripById: (id: string) => `/api/trips/${id}`,
} as const;
