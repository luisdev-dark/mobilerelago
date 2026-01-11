// Expo Go corre en celular, por eso NO sirve localhost
// Ejemplo: https://tu-backend.onrender.com
export const BASE_URL = 'https://tu-backend.onrender.com';

export const API_ENDPOINTS = {
  routes: '/routes',
  routeById: (id: string) => `/routes/${id}`,
  trips: '/trips',
  tripById: (id: string) => `/trips/${id}`,
} as const;
