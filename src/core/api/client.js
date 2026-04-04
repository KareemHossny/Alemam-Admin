import axios from 'axios';

export const AUTH_REQUIRED_EVENT = 'portal:auth-required';

const apiClient = axios.create({
  baseURL: 'https://alemam-backend.vercel.app/api',
  timeout: 15000,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect && !error.config?.suppressAuthEvent) {
      window.dispatchEvent(new CustomEvent(AUTH_REQUIRED_EVENT));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
