import { Link } from 'react-router-dom';
import { Coffee, Sparkles } from 'lucide-react';
import '../styles/receipt.css';

function NotFoundPage() {
    return (
        <div className="receipt-page">
            <div className="ambient-background">
                <div className="ambient-orb orb-1"></div>
                <div className="ambient-orb orb-2"></div>
            </div>

            <div className="receipt-container">
                <div className="receipt-error-card">
                    <div className="error-icon-box">
                        <Coffee size={40} />
                    </div>

                    <h2>404 — Page Not Found</h2>

                    <p className="error-description">
                        The requested receipt page does not exist or the link may be outdated.
                    </p>

                    <div className="error-action-row">
                        <Link to="/" className="action-btn-primary">
                            <Sparkles size={17} />
                            <span>View Sample Receipt</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;