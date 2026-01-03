// Server configuration
export const serverUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// For backward compatibility
export const config = {
  baseUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
};

// Log the API URL for debugging
console.log('API Server URL:', serverUrl);
