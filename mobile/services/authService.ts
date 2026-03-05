import api from "../api/api";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  idNumber: string;
}

// LOGIN
export const login = async (data: LoginData) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data; // backend returns { token: "..." }
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// REGISTER
export const register = async (data: RegisterData) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};