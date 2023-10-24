import axios from 'axios';

const publicAxios = axios.create({
    baseURL: import.meta.env.VITE_API_BASEURL
});

export const privateAxios = axios.create({
    baseURL: import.meta.env.VITE_API_BASEURL,
    headers: {"Content-Type": "application/json"},
    withCredentials: true,
});

export default publicAxios;