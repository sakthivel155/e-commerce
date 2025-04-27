  // src/environments/environment.prod.ts (production environment)
  export const environment = {
    production: true,
    apiUrl: 'https://api.myapp.com/api',
    authTokenKey: 'auth_token',
    featureFlags: {
      enableNewDashboard: true,
      enableAnalytics: true
    },
    logging: {
      level: 'error',
      toConsole: false
    }
  };