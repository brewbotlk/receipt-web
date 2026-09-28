import axios from 'axios';

// Normalize API URL to strip any trailing '/api' or slashes to prevent '/api/api' duplicates
const rawApiUrl = import.meta.env.VITE_RECEIPT_API_URL || 'https://receipt-5a43.onrender.com';
const API_BASE_URL = rawApiUrl.replace(/\/api\/?$/i, '').replace(/\/+$/, '');

/**
 * Retrieves a receipt by either its 64-character token or order reference number.
 * @param {string} identifier - Receipt token or order number
 */
export const getReceiptByOrderNo = async (identifier) => {
    const id = String(identifier || '').trim();

    if (!id) {
        const error = new Error('No receipt identifier provided.');
        error.isNotFound = true;
        throw error;
    }

    // 32 to 64 character hex string indicates a receiptToken
    const isToken = /^[a-f0-9]{32,64}$/i.test(id);

    if (isToken) {
        // Try token endpoint first
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/receipts/${encodeURIComponent(id)}`,
            );
            return response.data?.receipt || response.data;
        } catch (err) {
            // If expired (410), propagate immediately
            if (err?.response?.status === 410 || err?.response?.data?.expired) {
                throw err;
            }
            // Fallback to order endpoint in case orderNo happens to be hex
            try {
                const orderRes = await axios.get(
                    `${API_BASE_URL}/api/receipts/order/${encodeURIComponent(id)}`,
                );
                return orderRes.data?.receipt || orderRes.data;
            } catch {
                throw err;
            }
        }
    } else {
        // Non-token identifier: try order endpoint first
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/receipts/order/${encodeURIComponent(id)}`,
            );
            return response.data?.receipt || response.data;
        } catch (err) {
            if (err?.response?.status === 410 || err?.response?.data?.expired) {
                throw err;
            }
            // Fallback to token endpoint
            try {
                const tokenRes = await axios.get(
                    `${API_BASE_URL}/api/receipts/${encodeURIComponent(id)}`,
                );
                return tokenRes.data?.receipt || tokenRes.data;
            } catch {
                throw err;
            }
        }
    }
};