/**
 * Consumption Service
 * 
 * API calls for consumption records (electricity, water, waste).
 * Used by: InputDataPage, ResidentDashboard
 */

import api, { validateResponse } from './api';
import { formatBillingPeriod } from './pointsService';

// =============================================================================
// DATA TRANSFORMERS
// =============================================================================

/**
 * Transform consumption record for display
 */
export function transformConsumptionRecord(record) {
    if (!record) return null;
    
    return {
        id: record._id || record.id,
        building: record.building || '',
        flatNumber: record.flatNumber || '',
        billingPeriod: record.billingPeriod,
        billingPeriodFormatted: formatBillingPeriod(record.billingPeriod),
        electricity: record.electricity || 0,
        water: record.water || 0,
        wasteSegregation: normalizeWasteStatus(record.wasteSegregation),
        wasteDisplay: getWasteDisplayInfo(record.wasteSegregation),
        status: record.status || 'pending',
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
    };
}

/**
 * Normalize waste status to consistent format
 */
export function normalizeWasteStatus(status) {
    if (!status) return 'no';
    const lower = status.toLowerCase();
    if (lower === 'yes' || lower === 'compliant') return 'yes';
    if (lower === 'partial') return 'partial';
    return 'no';
}

/**
 * Get waste status display info
 */
export function getWasteDisplayInfo(status) {
    const normalized = normalizeWasteStatus(status);
    const info = {
        yes: { label: 'Yes', variant: 'success', color: 'text-green-600' },
        partial: { label: 'Partial', variant: 'warning', color: 'text-yellow-600' },
        no: { label: 'No', variant: 'error', color: 'text-red-600' },
    };
    return info[normalized] || info.no;
}

/**
 * Get current billing period in YYYY-MM format
 */
export function getCurrentBillingPeriod() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

// =============================================================================
// API CALLS
// =============================================================================

/**
 * Submit new consumption record
 * @param {Object} data - Consumption data
 * @returns {Promise<Object>} Created record
 */
export async function submitConsumption(data) {
    const payload = {
        building: data.building,
        flatNumber: data.flatNumber,
        billingPeriod: data.billingPeriod,
        electricity: Number(data.electricity),
        water: Number(data.water),
        wasteSegregation: data.wasteSegregation,
    };
    
    const response = await api.post('/api/consumption/submit', payload);
    
    if (!validateResponse(response, ['record'])) {
        throw new Error('Invalid submission response');
    }
    
    return transformConsumptionRecord(response.record);
}

/**
 * Get user's consumption history
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Consumption records
 */
export async function getHistory(options = {}) {
    const { limit = 10, status } = options;
    
    let endpoint = `/api/consumption/history?limit=${limit}`;
    if (status) {
        endpoint += `&status=${status}`;
    }
    
    const response = await api.get(endpoint);
    
    return (response.records || response.history || []).map(transformConsumptionRecord);
}

/**
 * Get latest consumption record
 * @returns {Promise<Object|null>} Latest record or null
 */
export async function getLatest() {
    try {
        const response = await api.get('/api/consumption/latest');
        return transformConsumptionRecord(response.record);
    } catch (error) {
        // No records yet is not an error
        if (error.status === 404) {
            return null;
        }
        throw error;
    }
}

/**
 * Get consumption record by ID
 * @param {string} recordId - Record ID
 * @returns {Promise<Object>} Consumption record
 */
export async function getById(recordId) {
    const response = await api.get(`/api/consumption/${recordId}`);
    return transformConsumptionRecord(response.record);
}

/**
 * Update consumption record (before approval)
 * @param {string} recordId - Record ID
 * @param {Object} data - Updated data
 * @returns {Promise<Object>} Updated record
 */
export async function updateRecord(recordId, data) {
    const response = await api.put(`/api/consumption/${recordId}`, data);
    return transformConsumptionRecord(response.record);
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
    submitConsumption,
    getHistory,
    getLatest,
    getById,
    updateRecord,
    transformConsumptionRecord,
    normalizeWasteStatus,
    getWasteDisplayInfo,
    getCurrentBillingPeriod,
};
