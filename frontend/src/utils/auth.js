import { jwtDecode } from "jwt-decode";

export const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded = jwtDecode(token);
  return decoded.user_id;
};

export const getUserName = () => {
  return localStorage.getItem("full_name");
};

export const getUserEmail = () => {
  return localStorage.getItem("email");
};