
// middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo, useCookie, type RouteLocationNormalized } from '#app';

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized, _from) => {
  const token = useCookie('auth_token').value;
  const isDashboardRoute = to.path.startsWith('/dashboard');

  // Si l'utilisateur essaie d'accéder au dashboard sans token, on le redirige
  if (isDashboardRoute && !token) {
    return navigateTo('/login');
  }

  // Si l'utilisateur est déjà connecté et essaie d'accéder au login, on le redirige vers le dashboard
  if (to.path === '/login' && token) {
    return navigateTo('/dashboard');
  }
});