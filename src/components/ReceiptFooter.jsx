function ReceiptFooter({ receipt }) {
    const formatDate = (val) => {
        if (!val) return '';
        try {
            const d = new Date(val);
            if (Number.isNaN(d.getTime())) return '';
            const month = d.toLocaleString('en-US', { month: 'short' });
            const day = d.getDate();
            const year = d.getFullYear();
            const time = d.toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
            return `${month} ${day}, ${year}, ${time}`;
        } catch {
            return '';
        }
    };

    const formattedExpiry = formatDate(receipt?.expiresAt);

    return (
        <div className="footer">
            <p>
                This document serves as your official payment record.
                {formattedExpiry && (
                    <>
                        <br />
                        Valid digitally until <strong>{formattedExpiry}</strong>.
                    </>
                )}
            </p>
        </div>
    );
}

export default ReceiptFooter;