import { useState, useEffect } from 'react';

export default function Checkout({ cart, subtotal, onClose, onClearCart }) {
    const [step, setStep] = useState('summary'); // 'summary', 'payment', 'success'
    const [cardData, setCardData] = useState({ name: '', number: '', expiry: '', cvv: '' });
    const [isPaying, setIsPaying] = useState(false);

    // Lock scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const handlePayment = (e) => {
        e.preventDefault();
        setIsPaying(true);
        // Simulate API call
        setTimeout(() => {
            setIsPaying(false);
            setStep('success');
        }, 2000);
    };

    const downloadInvoice = () => {
        const timestamp = new Date().toLocaleString();
        const orderId = `FF-${Math.floor(100000 + Math.random() * 900000)}`;

        let content = `
========================================
       FRUIT FUSION — INVOICE
========================================
Order ID:   ${orderId}
Date:       ${timestamp}
Status:     PAID (Card)
----------------------------------------
ITEM                        QTY    TOTAL
----------------------------------------
`;

        cart.forEach(item => {
            const line = `${item.name.padEnd(26)} x${item.qty}   $${(item.price * item.qty).toFixed(2)}`;
            content += line + '\n';
        });

        content += `
----------------------------------------
SUBTOTAL:                      $${subtotal.toFixed(2)}
SHIPPING:                      FREE
GRAND TOTAL:                   $${subtotal.toFixed(2)}
========================================
   Thank you for choosing peak freshness!
   Visit us again at fruitfusion.com
========================================
`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `FruitFusion_Invoice_${orderId}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="checkout-overlay">
            <div className="checkout-modal">
                <button className="checkout-close-btn" onClick={onClose} aria-label="Close checkout">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className="checkout-content">
                    {step === 'summary' && (
                        <div className="checkout-step-summary">
                            <h2 className="checkout-title">Order Summary</h2>
                            <div className="checkout-items">
                                {cart.map(item => (
                                    <div key={item.id} className="checkout-item-row">
                                        <span>{item.name} × {item.qty}</span>
                                        <span>${(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="checkout-total-footer">
                                <div className="checkout-total-row">
                                    <span>Grand Total</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <button className="primary-btn checkout-next-btn" onClick={() => setStep('payment')}>
                                    Enter Payment Details
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'payment' && (
                        <div className="checkout-step-payment">
                            <h2 className="checkout-title">Payment Details</h2>
                            <p className="checkout-subtitle">Amount to pay: <strong>${subtotal.toFixed(2)}</strong></p>

                            <form onSubmit={handlePayment} className="payment-form">
                                <div className="input-group">
                                    <label>Cardholder Name</label>
                                    <input
                                        type="text" required placeholder="John Doe"
                                        value={cardData.name} onChange={e => setCardData({ ...cardData, name: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Card Number</label>
                                    <input
                                        type="text" required placeholder="0000 0000 0000 0000" maxLength="19"
                                        value={cardData.number} onChange={e => setCardData({ ...cardData, number: e.target.value })}
                                    />
                                </div>
                                <div className="input-row">
                                    <div className="input-group">
                                        <label>Expiry Date</label>
                                        <input
                                            type="text" required placeholder="MM/YY" maxLength="5"
                                            value={cardData.expiry} onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>CVV</label>
                                        <input
                                            type="password" required placeholder="123" maxLength="3"
                                            value={cardData.cvv} onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="primary-btn pay-btn" disabled={isPaying}>
                                    {isPaying ? 'Processing...' : `Pay $${subtotal.toFixed(2)}`}
                                </button>
                            </form>
                            <button className="back-link" onClick={() => setStep('summary')}>&larr; Back to Order Summary</button>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="checkout-step-success">
                            <div className="success-icon">✅</div>
                            <h2 className="checkout-title">Payment Successful!</h2>
                            <p>Your premium botanicals are being prepared for dispatch.</p>

                            <div className="success-actions">
                                <button className="primary-btn invoice-btn" onClick={downloadInvoice}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    Download Invoice
                                </button>
                                <button className="secondary-btn" onClick={() => { onClearCart(); onClose(); }}>
                                    Return to Home
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
