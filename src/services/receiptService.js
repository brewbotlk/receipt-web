import axios from 'axios';

const API_URL = import.meta.env.VITE_RECEIPT_API_URL || 'http://localhost:5001';

export const getReceiptByOrderNo = async (orderNo) => {
    if (!orderNo || !orderNo.trim()) {
        const error = new Error('Order number is required.');
        error.isNotFound = true;
        throw error;
    }

    const response = await axios.get(
        `${API_URL}/api/receipts/order/${encodeURIComponent(orderNo.trim())}`,
    );

    const receipt = response.data?.receipt || response.data;

    if (!receipt || !receipt.orderNo) {
        const error = new Error('No receipt found for this order.');
        error.isNotFound = true;
        throw error;
    }

    return receipt;
};