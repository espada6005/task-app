import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api',
    withCredentials: true, // HTTP-only Cookie を自動で送受信
    headers: {
        'Content-Type': 'application/json',
    },
});

// 401が返ったらログイン画面へリダイレクト
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
