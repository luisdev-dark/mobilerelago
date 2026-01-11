import { Redirect } from 'expo-router';

/**
 * Pantalla inicial de la app
 * Redirige automáticamente a la lista de rutas
 */
export default function Index() {
  return <Redirect href="/routes" />;
}
