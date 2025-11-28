import axios from "axios";

const BASE_URL = "http://localhost:5000/api/auth"; // or your production backend URL

export const signup = (data: { name: string; email: string; password: string }) =>
  axios.post(`${BASE_URL}/signup`, data);

export const login = (data: { email: string; password: string }) =>
  axios.post(`${BASE_URL}/login`, data);
