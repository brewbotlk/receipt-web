import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

function ReceiptDetails({ receipt, onDownloadPdf, isDownloadingPdf }) {
    const [copiedField, setCopiedField] = useState('');

    const formatAmount = (val) => {
        const num = Number(val);

        if (Number.isNaN(num) || val === undefined || val === null) {
            return 'LKR 0.00';
        }

        return `LKR ${num.toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const formatDate = (val) => {
        if (!val) return '—';

        try {
            const d = new Date(val);

            if (Number.isNaN(d.getTime())) {
                return '—';
            }

            const month = d.toLocaleString('en-US', {
                month: 'short',
            });

            const day = d.getDate();
            const year = d.getFullYear();

            const time = d.toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });

            return `${month} ${day}, ${year}, ${time}`;
        } catch {
            return '—';
        }
    };

    const copyText = (text, fieldKey) => {
        if (!text || text === '—') return;

        navigator.clipboard
            .writeText(String(text))
            .then(() => {
                setCopiedField(fieldKey);

                setTimeout(() => {
                    setCopiedField('');
                }, 2000);
            })
            .catch(() => {});
    };

    return (
        <>
            <div className="divider"></div>

            <div className="total-section">
                <div className="total-label">
                    AMOUNT PAID
                </div>

                <div className="total-amount">
                    {formatAmount(receipt?.amount)}
                </div>

                {receipt?.productName && (
                    <div className="product-name">
                        {receipt.productName}
                    </div>
                )}
            </div>

            <div className="divider"></div>

            <div className="details-section">

                {/* Status */}
                <div className="detail-row">
                    <span className="detail-label">
                        Status
                    </span>

                    <span className="status-badge">
                        {receipt?.status || 'SUCCESS'}
                    </span>
                </div>

                {/* Date & Time */}
                <div className="detail-row">
                    <span className="detail-label">
                        Date & Time
                    </span>

                    <span className="detail-value date-time-value">
                        {formatDate(receipt?.createdAt)}
                    </span>
                </div>

                {/* Order Reference */}
                <div className="detail-row">
                    <span className="detail-label">
                        Order Ref
                    </span>

                    <span className="detail-value mono">
                        <span className="order-no-text">
                            {receipt?.orderNo || '—'}
                        </span>

                        {receipt?.orderNo && (
                            <button
                                type="button"
                                className={`copy-btn ${
                                    copiedField === 'orderNo'
                                        ? 'copied'
                                        : ''
                                }`}
                                onClick={() =>
                                    copyText(
                                        receipt.orderNo,
                                        'orderNo'
                                    )
                                }
                                title="Copy Order Ref"
                                aria-label="Copy Order Reference"
                            >
                                {copiedField === 'orderNo' ? (
                                    <Check
                                        size={14}
                                        className="copied-icon"
                                    />
                                ) : (
                                    <Copy size={14} />
                                )}

                                {copiedField === 'orderNo' && (
                                    <span className="copy-tooltip">
                                        Copied!
                                    </span>
                                )}
                            </button>
                        )}
                    </span>
                </div>

                {/* Download PDF Button
                    This element will NOT be included
                    when html2canvas generates the PDF.
                */}
                <div
                    className="actions-wrapper no-print"
                    data-html2canvas-ignore="true"
                >
                    <button
                        type="button"
                        onClick={onDownloadPdf}
                        disabled={isDownloadingPdf}
                        className="btn-download-pdf"
                        title="Download Receipt PDF"
                    >
                        <Download size={17} />

                        <span>
                            {isDownloadingPdf
                                ? 'Generating PDF...'
                                : 'Download Receipt PDF'}
                        </span>
                    </button>
                </div>

            </div>
        </>
    );
}

export default ReceiptDetails;
