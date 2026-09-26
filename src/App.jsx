import { Routes, Route } from 'react-router-dom';

import ReceiptPage from './pages/ReceiptPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<ReceiptPage />} />
            <Route path="/receipt/:orderNo" element={<ReceiptPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;