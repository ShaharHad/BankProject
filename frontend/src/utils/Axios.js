import axios from "axios";

const Axios = axios.create({
    baseURL: "http://localhost:8000",
    timeout: 10000,
});

Axios.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default Axios;