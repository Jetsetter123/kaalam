/**
 * Kaalaman Configuration
 * 
 * This file helps you configure whether to use local or remote API
 */

const config = {
  // Set this to your deployed URL (e.g., from Vercel, Netlify, Railway)
  // Leave empty to use local API (when running npm run dev)
  remoteApiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  
  // API endpoints
  endpoints: {
    chat: '/api/chat',
    upload: '/api/upload',
  },
  
  // Get the full API URL
  getApiUrl: function(endpoint) {
    const base = this.remoteApiUrl || '';
    return `${base}${endpoint}`;
  }
};

// Export for use in the app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}

// Also make available as global for browser
if (typeof window !== 'undefined') {
  window.kaalamanConfig = config;
}
