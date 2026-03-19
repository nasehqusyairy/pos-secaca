import apiClient from "./apiClientV2";

const apiClientStore = apiClient;

apiClientStore.interceptors.request.use(async (config) => {
    const deviceCode = localStorage.getItem("deviceCode")
    if (deviceCode) {
        config.headers['X-Device-Code'] = deviceCode
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClientStore;