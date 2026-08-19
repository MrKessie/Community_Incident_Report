import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Auto-detect local IP for development
export const getBaseURL = () => {
  const debuggerHost = Constants.expoConfig?.hostUri || Constants.experienceUrl || Constants.manifest?.debuggerHost;
  if (debuggerHost) {
    const ip = debuggerHost.split(':').shift();
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:8000/api/v1`;
    }
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api/v1'; // Android emulator localhost alias
  }
  return 'http://127.0.0.1:8000/api/v1';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(
  async (config) => {
    const token = asyncStorageGet('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Synchronous token cache helper
let cachedToken = null;
export const setAuthToken = (token) => {
  cachedToken = token;
  if (token) {
    AsyncStorage.setItem('token', token);
  } else {
    AsyncStorage.removeItem('token');
  }
};

const asyncStorageGet = (key) => cachedToken;

export const loadStoredToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) cachedToken = token;
    return token;
  } catch (e) {
    return null;
  }
};

export default api;
