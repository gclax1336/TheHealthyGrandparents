// API Configuration
const config = {
  development: {
    apiUrl: 'http://localhost:4000',
    frontendUrl: 'http://localhost:3000'
  },
  production: {
    apiUrl: 'http://3.17.67.234:4000',
    frontendUrl: 'http://thehealthygrandparent-frontend-1753470518.s3-website-us-east-1.amazonaws.com'
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
    me: `${API_BASE_URL}/api/auth/me`,
    verify: `${API_BASE_URL}/api/auth/verify`
  },
  workouts: {
    today: `${API_BASE_URL}/api/workouts/today`,
    all: `${API_BASE_URL}/api/workouts`,
    create: `${API_BASE_URL}/api/workouts`,
    update: `${API_BASE_URL}/api/workouts`,
    delete: `${API_BASE_URL}/api/workouts`
  },
  users: {
    profile: `${API_BASE_URL}/api/users/profile`,
    update: `${API_BASE_URL}/api/users/update`,
    payment: `${API_BASE_URL}/api/users/payment`
  }
};

export default currentConfig; 