import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000/api/v1"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            ["user", "token", "uid"].forEach((k) => localStorage.removeItem(k));
            localStorage.setItem("participated", "true");
            window.location.replace("/expired");
        }
        return Promise.reject(error);
    }
);