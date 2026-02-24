export default function Toast({ toasts }) {
    return (
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className="toast">
                    <span className="toast-icon">{t.icon}</span>
                    <span>{t.message}</span>
                </div>
            ))}
        </div>
    );
}
