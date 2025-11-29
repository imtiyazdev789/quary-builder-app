// Simple environment configuration
// Update these values directly or use expo-constants from app.json

// Try to get from expo-constants (app.json extra section)
let API_BASE_URL = 'http://localhost:3000';
let API_BASE_URL_PROD = 'https://your-production-api.com';
let NODE_ENV = __DEV__ ? 'development' : 'production';

try {
    const Constants = require('expo-constants');
    const constants = Constants.default || Constants;
    if (constants?.expoConfig?.extra) {
        API_BASE_URL = constants.expoConfig.extra.apiBaseUrl || API_BASE_URL;
        API_BASE_URL_PROD = constants.expoConfig.extra.apiBaseUrlProd || API_BASE_URL_PROD;
        NODE_ENV = constants.expoConfig.extra.nodeEnv || NODE_ENV;
    }
} catch (e) {
    // expo-constants not available, use defaults
}

// For .env file support, manually update these values:
// Or add to app.json extra section:
// {
//   "expo": {
//     "extra": {
//       "apiBaseUrl": "http://localhost:3000",
//       "apiBaseUrlProd": "https://your-production-api.com",
//       "nodeEnv": "development"
//     }
//   }
// }

export { API_BASE_URL, API_BASE_URL_PROD, NODE_ENV };

export default {
    API_BASE_URL,
    API_BASE_URL_PROD,
    NODE_ENV,
};

