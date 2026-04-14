import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.178.25:3000/api/v1"
});