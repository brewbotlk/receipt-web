import { forwardRef } from 'react';
import ReceiptHeader from './ReceiptHeader';
import ReceiptDetails from './ReceiptDetails';
import ReceiptFooter from './ReceiptFooter';

const ReceiptCard = forwardRef(function ReceiptCard(
    { receipt, onDownloadPdf, isDownloadingPdf },
    ref
) {
    return (
        <div className="card" ref={ref}>
            <div className="card-inner">
                <ReceiptHeader />
                <ReceiptDetails
                    receipt={receipt}
                    onDownloadPdf={onDownloadPdf}
                    isDownloadingPdf={isDownloadingPdf}
                />
                <ReceiptFooter receipt={receipt} />
            </div>
        </div>
    );
});

export default ReceiptCard;
