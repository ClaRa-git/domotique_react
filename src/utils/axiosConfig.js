import axios from 'axios';

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('401 détecté sur :', error.config.url);
            // Si un token existait → session expirée : on nettoie et on renvoie au login
            if (localStorage.getItem('jwt_token')) {
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('userInfos');
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default axios;