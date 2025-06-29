import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Session Management
export const sessionAPI = {
    create: (data) => api.post('/sessions', data),
    get: (id) => api.get(`/sessions/${id}`),
    list: (params) => api.get('/sessions', { params }),
    update: (id, data) => api.put(`/sessions/${id}`, data),
    delete: (id) => api.delete(`/sessions/${id}`),
    generateLink: (id, type) => api.post(`/sessions/${id}/links`, { type }),
    uploadResume: (id, file) => {
        const formData = new FormData();
        formData.append('resume', file);
        return api.post(`/sessions/${id}/resume`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    parseResume: (id) => api.post(`/sessions/${id}/resume/parse`),
};

// Conversation Management
export const conversationAPI = {
    create: (data) => api.post('/conversations', data),
    get: (id) => api.get(`/conversations/${id}`),
    list: (sessionId) => api.get(`/conversations?session_id=${sessionId}`),
    update: (id, data) => api.put(`/conversations/${id}`, data),
    delete: (id) => api.delete(`/conversations/${id}`),
};

// AI Services
export const aiAPI = {
    generateSuggestion: (data) => api.post('/ai/suggest', data),
    analyzeResume: (file) => {
        const formData = new FormData();
        formData.append('resume', file);
        return api.post('/ai/analyze-resume', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    transcribeAudio: (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob);
        return api.post('/ai/transcribe', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

// User Management
export const userAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    list: (params) => api.get('/users', { params }),
    get: (id) => api.get(`/users/${id}`),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

// Support Services
export const supportAPI = {
    createSession: (data) => api.post('/support/sessions', data),
    getSession: (id) => api.get(`/support/sessions/${id}`),
    listSessions: (params) => api.get('/support/sessions', { params }),
    updateSession: (id, data) => api.put(`/support/sessions/${id}`, data),
    endSession: (id) => api.post(`/support/sessions/${id}/end`),
    addIntervention: (sessionId, data) => api.post(`/support/sessions/${sessionId}/interventions`, data),
    getInterventions: (sessionId) => api.get(`/support/sessions/${sessionId}/interventions`),
};

// Analytics
export const analyticsAPI = {
    track: (data) => api.post('/analytics/track', data),
    getSessionStats: (sessionId) => api.get(`/analytics/sessions/${sessionId}`),
    getPlatformStats: (params) => api.get('/analytics/platform', { params }),
    getUserStats: (userId) => api.get(`/analytics/users/${userId}`),
};

// Notifications
export const notificationAPI = {
    create: (data) => api.post('/notifications', data),
    list: (params) => api.get('/notifications', { params }),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`),
};

// File Upload
export const fileAPI = {
    upload: (file, type) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        return api.post('/files/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    delete: (id) => api.delete(`/files/${id}`),
};

// Real-time WebSocket connection
export const createWebSocket = (sessionId, token) => {
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';
    const socket = new WebSocket(`${wsUrl}/ws?session_id=${sessionId}&token=${token}`);

    socket.onopen = () => {
        console.log('WebSocket connected');
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    return socket;
};

export default api; 