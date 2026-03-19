// services/apiClient.js
import axios from 'axios';

const apiClientDownload = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
    timeout: 10000,
    headers: {
        'Accept': 'text/csv',
        'Content-Type': 'text/csv',
    },
});

apiClientDownload.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    const employeeCode = localStorage.getItem("employeeCode")
    if (employeeCode) {
        config.headers['X-Employee-Code'] = employeeCode;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClientDownload.interceptors.response.use(
    (response) => {
        const FileDownload = require('js-file-download');
        FileDownload(response.data, response.config.params.file_name)

        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized, logging out...');
        }

        if (error.response?.status === 400) {
        return Promise.reject(error.response?.data);
        }


        return Promise.reject(error);
    }
);

export default apiClientDownload;
