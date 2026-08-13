import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:8080/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

const login = async (credentials) => {
  try {
    const response = await authApi.post("/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const register = async ({ name, username, email, password }) => {
  try {
    const response = await authApi.post("/register", { name, username, email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export { login, register };