import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Downloads a high-resolution PDF of the clean receipt docket.
 * @param {HTMLElement} element - The DOM element of the receipt card
 * @param {string} orderNo - The order number for the filename
 */
export const downloadReceiptPdf = async (element, orderNo = 'receipt') => {
    if (!element) {
        throw new Error('Receipt element not found');
    }

    // Scroll to top to ensure complete element capture
    window.scrollTo(0, 0);

    const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FCFBF8',
        logging: false,
        onclone: (clonedDoc) => {
            // Remove any shadow or outer spacing in PDF
            const card = clonedDoc.querySelector('.card');
            if (card) {
                card.style.boxShadow = 'none';
                card.style.animation = 'none';
                card.style.transform = 'none';
                card.style.opacity = '1';
                card.style.margin = '0';
            }
            // Hide any copy buttons
            const copyBtns = clonedDoc.querySelectorAll('.copy-btn');
            copyBtns.forEach((btn) => {
                btn.style.display = 'none';
            });
        },
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // Docket size: 85mm width, calculated height
    const pdfWidth = 85;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight + 4],
    });

    pdf.addImage(imgData, 'PNG', 0, 2, pdfWidth, pdfHeight, undefined, 'FAST');
    const safeOrderNo = String(orderNo || 'receipt').replace(/[^a-zA-Z0-9_-]/g, '_');
    pdf.save(`BrewBot-Receipt-${safeOrderNo}.pdf`);
};
