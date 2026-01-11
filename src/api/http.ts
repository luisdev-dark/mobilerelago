import { BASE_URL } from '@/src/config/config';

/**
 * Cliente HTTP simple usando fetch
 * - Timeout de 10 segundos
 * - Manejo de errores HTTP no 2xx
 * - Sin interceptores ni librerías externas
 */

const TIMEOUT_MS = 10000; // 10 segundos

/**
 * Realiza una petición GET y devuelve JSON parseado
 */
export async function getJson<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('La petición tardó demasiado (timeout 10s)');
      }
      throw error;
    }
    throw new Error('Error inesperado en la petición');
  }
}

/**
 * Realiza una petición POST con body JSON y devuelve JSON parseado
 */
export async function postJson<T>(path: string, body: any): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('La petición tardó demasiado (timeout 10s)');
      }
      throw error;
    }
    throw new Error('Error inesperado en la petición');
  }
}
