import brewbotLogo from '../assets/brewbot-logo.png';
import '../styles/receipt.css';

function LoadingReceipt() {
    return (
        <div className="container">
            <div className="card loading-card">
                <div className="card-inner loading-inner">
                    <div className="loading-logo-box">
                        <img 
                            src={brewbotLogo} 
                            alt="BrewBot" 
                            className="loading-logo-img" 
                        />
                        <div className="loading-pulse-ring"></div>
                    </div>

                    <div className="loading-spinner-ring"></div>

                    <h2 className="loading-heading">Loading Receipt...</h2>
                    <p className="loading-subtext">Fetching verified payment details from BrewBot</p>

                    <div className="loading-skeleton-lines">
                        <div className="skeleton sk-line" style={{ width: '80%', height: '14px', margin: '14px auto 8px' }}></div>
                        <div className="skeleton sk-line" style={{ width: '60%', height: '14px', margin: '0 auto' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoadingReceipt;