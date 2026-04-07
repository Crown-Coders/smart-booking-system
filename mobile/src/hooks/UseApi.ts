// src/hooks/useApi.ts
import { useState, useCallback } from 'react';
import { storage } from '../utils/storage';

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
};

export function useApi<T = any>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (options: ApiOptions = {}) => {
    setLoading(true);
    setError(null);
    try {
      const token = await storage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
      if (!response.ok) {
        const text = await response.text();
        const errorData = text ? JSON.parse(text) : null;
        throw new Error(errorData?.message || 'Request failed');
      }
      const responseData = await response.json();
      setData(responseData);
      return responseData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { data, loading, error, execute };
}