import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { RefreshCw, AlertCircle, Clock } from 'lucide-react';

import { getReceiptByOrderNo } from '../services/receiptService';
import { downloadReceiptPdf } from '../utils/pdfGenerator';

import ReceiptCard from '../components/ReceiptCard';
import LoadingReceipt from '../components/LoadingReceipt';

import '../styles/receipt.css';

function ReceiptPage() {
    const { orderNo } = useParams();
    const cleanOrderNo = orderNo?.trim() || '';

    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(Boolean(cleanOrderNo));
    const [isExpired, setIsExpired] = useState(false);
    const [error, setError] = useState(cleanOrderNo ? '' : 'No order reference provided.');
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

    const receiptCardRef = useRef(null);

    useEffect(() => {
        if (!cleanOrderNo) {
            return;
        }

        let cancelled = false;

        const loadReceipt = async () => {
            try {
                setLoading(true);
                setError('');
                setIsExpired(false);

                const data = await getReceiptByOrderNo(cleanOrderNo);

                if (!cancelled) {
                    if (data?.expiresAt && new Date() > new Date(data.expiresAt)) {
                        setIsExpired(true);
                    }
                    setReceipt(data);
                }
            } catch (err) {
                console.error('Failed to load receipt:', err);

                if (!cancelled) {
                    if (err?.response?.status === 410 || err?.response?.data?.expired) {
                        setIsExpired(true);
                    } else {
                        setError(
                            err?.response?.data?.message ||
                            'No receipt data found for this order reference.'
                        );
                    }
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadReceipt();

        return () => {
            cancelled = true;
        };
    }, [cleanOrderNo]);

    const handleDownloadPdf = async () => {
        if (!receiptCardRef.current || isDownloadingPdf) return;

        try {
            setIsDownloadingPdf(true);
            await downloadReceiptPdf(receiptCardRef.current, receipt?.orderNo || 'receipt');
        } catch (err) {
            console.error('PDF generation error:', err);
            alert('Could not download PDF. Please try again.');
        } finally {
            setIsDownloadingPdf(false);
        }
    };

    if (loading) {
        return <LoadingReceipt />;
    }

    if (isExpired) {
        return (
            <div className="container">
                <div className="alert-card">
                    <div className="alert-icon" style={{ display: 'inline-flex' }}>
                        <Clock size={46} />
                    </div>
                    <h2 className="alert-title">Receipt Expired</h2>
                    <p className="alert-text">
                        This receipt has expired after 72 hours. Digital receipts are only accessible within 72 hours of purchase for security purposes.
                    </p>
                    {cleanOrderNo && (
                        <div className="alert-order-badge">
                            <span>Order Ref: </span>
                            <code>{cleanOrderNo}</code>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (error || !receipt) {
        return (
            <div className="container">
                <div className="alert-card">
                    <div className="alert-icon error-color" style={{ display: 'inline-flex' }}>
                        <AlertCircle size={46} />
                    </div>
                    <h2 className="alert-title">No Receipt Data Found</h2>
                    <p className="alert-text">
                        {error || 'We could not find any receipt details for this order.'}
                    </p>
                    {cleanOrderNo && (
                        <div className="alert-order-badge">
                            <span>Order Ref: </span>
                            <code>{cleanOrderNo}</code>
                        </div>
                    )}
                    <div style={{ marginTop: '22px' }}>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="btn-retry"
                        >
                            <RefreshCw size={15} />
                            <span>Try Again</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <ReceiptCard
                receipt={receipt}
                ref={receiptCardRef}
                onDownloadPdf={handleDownloadPdf}
                isDownloadingPdf={isDownloadingPdf}
            />
        </div>
    );
}

export default ReceiptPage;