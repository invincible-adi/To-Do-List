import axios from 'axios';

// Function to get the token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Create an Axios instance
const axiosInstance = axios.create({
    // Using hardcoded URL for now, consider using environment variable
    baseURL: 'http://localhost:5000',
    timeout: 10000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        // If token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

export default axiosInstance; 