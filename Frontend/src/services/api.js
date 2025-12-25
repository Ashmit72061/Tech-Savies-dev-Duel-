/**
 * API Service - Core Utility
 * 
 * Centralized API client with:
 * - Base URL from environment
 * - Auth token injection
 * - Error handling with typed errors
 * - Retry logic with exponential backoff
 * - Response validation
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CONFIG = {
    timeout: 10000,          // 10 seconds
    maxRetries: 3,
    retryDelays: [1000, 2000, 4000], // Exponential backoff
};

// =============================================================================
// CUSTOM ERROR TYPES
// =============================================================================

/**
 * Base API Error class
 */
export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

/**
 * 401 Unauthorized - Token invalid or expired
 */
export class AuthError extends ApiError {
    constructor(message = 'Authentication required') {
        super(message, 401);
        this.name = 'AuthError';
    }
}

/**
 * 403 Forbidden - No permission
 */
export class ForbiddenError extends ApiError {
    constructor(message = 'Access denied') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}

/**
 * 400 Bad Request - Validation errors
 */
export class ValidationError extends ApiError {
    constructor(message = 'Validation failed', errors = {}) {
        super(message, 400);
        this.name = 'ValidationError';
        this.errors = errors;
    }
}

/**
 * 500 Server Error
 */
export class ServerError extends ApiError {
    constructor(message = 'Server error occurred') {
        super(message, 500);
        this.name = 'ServerError';
    }
}

/**
 * Network Error - Connection failed
 */
export class NetworkError extends ApiError {
    constructor(message = 'Network connection failed') {
        super(message, 0);
        this.name = 'NetworkError';
    }
}

// =============================================================================
// AUTH HELPERS
// =============================================================================

/**
 * Get auth token from localStorage
 */
export function getAuthToken() {
    return localStorage.getItem('authtoken');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
    return !!getAuthToken();
}

/**
 * Clear auth data and redirect to login
 */
export function handleAuthExpired() {
    localStorage.removeItem('authtoken');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    
    // Redirect to login (check role for correct page)
    const role = localStorage.getItem('role');
    const loginPath = role === 'admin' ? '/admin/login' : '/resident/login';
    window.location.href = loginPath;
}

// =============================================================================
// RESPONSE VALIDATION
// =============================================================================

/**
 * Validate API response structure
 * @param {Object} response - API response data
 * @param {string[]} requiredFields - Fields that must exist
 * @returns {boolean} - True if valid
 */
export function validateResponse(response, requiredFields = []) {
    if (!response) {
        console.error('[API] Empty response received');
        return false;
    }
    
    for (const field of requiredFields) {
        // Support nested fields like 'data.score'
        const parts = field.split('.');
        let value = response;
        
        for (const part of parts) {
            if (value === undefined || value === null) {
                console.error(`[API] Missing required field: ${field}`);
                return false;
            }
            value = value[part];
        }
        
        if (value === undefined) {
            console.error(`[API] Missing required field: ${field}`);
            return false;
        }
    }
    
    return true;
}

// =============================================================================
// CORE REQUEST FUNCTION
// =============================================================================

/**
 * Make an API request with error handling and retries
 * 
 * @param {string} endpoint - API endpoint (e.g., '/api/user/profile')
 * @param {Object} options - Fetch options
 * @param {boolean} options.auth - Include auth token (default: true)
 * @param {number} options.retries - Number of retries (default: 0)
 * @returns {Promise<any>} - Response data
 */
export async function apiRequest(endpoint, options = {}) {
    const {
        method = 'GET',
        body = null,
        auth = true,
        retries = 0,
        headers: customHeaders = {},
    } = options;
    
    // Build URL
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Build headers
    const headers = {
        'Content-Type': 'application/json',
        ...customHeaders,
    };
    
    // Add auth token if required
    if (auth) {
        const token = getAuthToken();
        if (token) {
            headers['auth-token'] = token;
        }
    }
    
    // Build request config
    const config = {
        method,
        headers,
    };
    
    if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
    }
    
    try {
        // Create timeout abort controller
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);
        config.signal = controller.signal;
        
        // Make request
        const response = await fetch(url, config);
        clearTimeout(timeoutId);
        
        // Parse response
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }
        
        // Handle HTTP errors
        if (!response.ok) {
            throw createErrorFromResponse(response.status, data);
        }
        
        return data;
        
    } catch (error) {
        // Handle abort (timeout)
        if (error.name === 'AbortError') {
            throw new NetworkError('Request timed out');
        }
        
        // Handle network errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
            // Retry logic
            if (retries < CONFIG.maxRetries) {
                const delay = CONFIG.retryDelays[retries] || 4000;
                console.log(`[API] Retrying in ${delay}ms... (attempt ${retries + 1})`);
                await sleep(delay);
                return apiRequest(endpoint, { ...options, retries: retries + 1 });
            }
            throw new NetworkError('Unable to connect to server');
        }
        
        // Re-throw API errors
        if (error instanceof ApiError) {
            // Handle auth expiry
            if (error instanceof AuthError) {
                handleAuthExpired();
            }
            throw error;
        }
        
        // Unknown error
        console.error('[API] Unexpected error:', error);
        throw new ServerError('An unexpected error occurred');
    }
}

/**
 * Create appropriate error type from HTTP status
 */
function createErrorFromResponse(status, data) {
    const message = data?.error || data?.message || 'Request failed';
    
    switch (status) {
        case 401:
            return new AuthError(message);
        case 403:
            return new ForbiddenError(message);
        case 400:
        case 422:
            return new ValidationError(message, data?.errors);
        case 500:
        case 502:
        case 503:
            return new ServerError(message);
        default:
            return new ApiError(message, status, data);
    }
}

/**
 * Sleep helper for retry delays
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// =============================================================================
// CONVENIENCE METHODS
// =============================================================================

/**
 * GET request
 */
export function get(endpoint, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'GET' });
}

/**
 * POST request
 */
export function post(endpoint, body, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'POST', body });
}

/**
 * PUT request
 */
export function put(endpoint, body, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'PUT', body });
}

/**
 * DELETE request
 */
export function del(endpoint, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'DELETE' });
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
    get,
    post,
    put,
    del,
    request: apiRequest,
    validateResponse,
    getAuthToken,
    isAuthenticated,
    // Error types for instanceof checks
    ApiError,
    AuthError,
    ForbiddenError,
    ValidationError,
    ServerError,
    NetworkError,
};
