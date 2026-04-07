import { NativeModules, Platform } from 'react-native';
import { storage } from './storage';

const WEB_DEFAULT_API_BASE = `${import.meta.env.VITE_API_URL}/api`;
const NATIVE_DEFAULT_API_BASE = 'http://192.168.0.201:5000/api';

const envApiBase =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  '';

export const API_BASE =
  envApiBase ||
  (Platform.OS === 'web' ? WEB_DEFAULT_API_BASE : resolveNativeApiBase());

console.log('API_BASE resolved to', API_BASE);

function resolveNativeApiBase() {
  const devHost = getExpoDevHost();
  if (devHost) {
    return `http://${devHost}:5000/api`;
  }

  return NATIVE_DEFAULT_API_BASE;
}

function getExpoDevHost() {
  const scriptURL: string | undefined = NativeModules?.SourceCode?.scriptURL;

  if (!scriptURL) {
    return '';
  }

  try {
    return new URL(scriptURL).hostname;
  } catch {
    const match = scriptURL.match(/https?:\/\/([^/:]+)/i);
    return match?.[1] || '';
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = await storage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Request failed');
  }

  return data;
}
