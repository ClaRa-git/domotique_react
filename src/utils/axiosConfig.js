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

// ✅ Intercepteur de réponse — on log sans rediriger
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('401 détecté sur :', error.config.url);
            // ❌ Pas de redirection automatique — on laisse chaque composant gérer
        }
        return Promise.reject(error);
    }
);

export default axios;