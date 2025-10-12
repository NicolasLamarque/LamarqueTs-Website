declare module '#app' {
  interface NuxtApp {
    $fetch: typeof import('$fetch').$fetch;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $fetch: typeof import('$fetch').$fetch;
  }
}