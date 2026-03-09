import API from "./api";

export const registerUser = async (userData) => {
  try {
    const response = await API.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await API.post("/login", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};