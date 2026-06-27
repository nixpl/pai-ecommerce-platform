const config = {
  authServiceUrl: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3001',
  profileServiceUrl: import.meta.env.VITE_PROFILE_SERVICE_URL || 'http://localhost:3002',
  catalogServiceUrl: import.meta.env.VITE_CATALOG_SERVICE_URL || 'http://localhost:3003',
  orderServiceUrl: import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:3004'
};

export default config;
