// src/environments/environment.ts (development environment)
export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api',
    authTokenKey: 'auth_token_dev',
    featureFlags: {
      enableNewDashboard: true,
      enableAnalytics: false
    },
    logging: {
      level: 'debug',
      toConsole: true
    }
  };
  

