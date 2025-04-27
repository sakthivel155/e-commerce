  
  // src/environments/environment.staging.ts (optional staging environment)
  export const environment = {
    production: false,
    apiUrl: 'https://staging-api.myapp.com/api',
    authTokenKey: 'auth_token_staging',
    featureFlags: {
      enableNewDashboard: true,
      enableAnalytics: true
    },
    logging: {
      level: 'info',
      toConsole: true
    }
  };