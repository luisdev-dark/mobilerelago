import { BASE_URL } from '@/src/config/config';

export class HttpError extends Error {
  constructor(public status: number, public body: any) {
    super(`HTTP Error ${status}`);
    this.name = 'HttpError';
  }
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);

    if (!response.ok) {
      let body: any;
      try {
        body = await response.json();
      } catch {
        body = await response.text();
      }
      throw new HttpError(response.status, body);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function getJson<T>(path: string): Promise<T> {
  return request<T>(path, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function postJson<T>(path: string, body: any): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
