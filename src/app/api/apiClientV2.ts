// services/apiClientV2.js
import axios from 'axios';

const apiClientV2 = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClientV2.interceptors.request.use(async (config) => {
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

apiClientV2.interceptors.response.use(
    (response) => {
        response.data = {
            data: response.data.data,
            currentPage: response.data.current_page,
            lastPage: response.data.last_page,
            total: response.data.total,
            hasPrev: response.data.prev_page_url != null,
            hasNext: response.data.next_page_url != null,
            nextCursor: response.data.next_cursor,
            prevCursor: response.data.prev_cursor,
        };

        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized, logging out...');
        }
        return Promise.reject(error);
    }
);

export default apiClientV2;
