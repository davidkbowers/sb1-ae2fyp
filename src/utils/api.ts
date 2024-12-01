// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://odvrest.applikuapp.com/';

// API endpoints
export const ENDPOINTS = {
    // Auth endpoints
    LOGIN: 'login',
    REGISTER: 'register',
    
    // Video endpoints
    VIDEOS: 'videos',
    VIDEO_UPLOAD: 'videos/upload',
    
    // Course endpoints
    COURSES: 'courses',
    
    // Lesson endpoints
    LESSONS: 'lessons',
    
    // Player endpoints
    PLAYER: 'player',
} as const;

// Helper function to construct full API URLs
export const getApiUrl = (endpoint: string): string => {
    return `${API_BASE_URL}${endpoint}`;
};

// Helper function for common fetch options
export const createApiOptions = (method: string, data?: any): RequestInit => {
    // For FormData, don't set Content-Type header as browser will set it with boundary
    const isFormData = data instanceof FormData;
    
    return {
        method,
        headers: {
            ...(!isFormData && { 'Content-Type': 'application/json' }),
            // Add authorization header if token exists
            ...(localStorage.getItem('token') && {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            })
        },
        ...(data && { body: isFormData ? data : JSON.stringify(data) })
    };
};
