// API Configuration
const config = {
  development: {
    apiUrl: 'http://localhost:4000',
    frontendUrl: 'http://localhost:3000'
  },
     production: {
     apiUrl: 'https://api.thehealthygrandparent.com',
     frontendUrl: 'http://thehealthygrandparent-frontend.s3-website-us-east-1.amazonaws.com'
   }
};

const environment = process.env.NODE_ENV || 'development';
const currentConfig = config[environment];

export const API_BASE_URL = currentConfig.apiUrl;
export const FRONTEND_URL = currentConfig.frontendUrl;

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    requestOtp: `${API_BASE_URL}/api/auth/request-otp`,
    verifyOtp: `${API_BASE_URL}/api/auth/verify-otp`,
    me: `${API_BASE_URL}/api/auth/me`
  },
  users: {
    profile: `${API_BASE_URL}/api/users/profile`,
    update: `${API_BASE_URL}/api/users/update`
  },
  health: `${API_BASE_URL}/api/health`
};

export default currentConfig; 