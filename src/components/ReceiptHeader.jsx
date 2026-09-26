import brewbotLogo from '../assets/brewbot-logo.png';

function ReceiptHeader() {
    return (
        <div className="header">
            <div className="logo-wrapper">
                <img 
                    src={brewbotLogo} 
                    alt="BrewBot" 
                    className="brand-logo" 
                />
            </div>
            <div className="brand-name">BrewBot</div>
        </div>
    );
}

export default ReceiptHeader;