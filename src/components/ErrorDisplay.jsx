import './ErrorDisplay.css';

function ErrorDisplay({ title, message, onRetry }) {
  return (
    <section className="error-section">
      <div className="error-card">
        <span className="error-icon">🌧️</span>
        <h2 className="error-title">{title}</h2>
        <p className="error-message">{message}</p>
        <button className="retry-btn" onClick={onRetry}>Try Again</button>
      </div>
    </section>
  );
}

export default ErrorDisplay;
