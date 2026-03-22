import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <section className="loading-section">
      <div className="loader">
        <div className="loader-dot"></div>
        <div className="loader-dot"></div>
        <div className="loader-dot"></div>
      </div>
      <p className="loading-text">Fetching weather data...</p>
    </section>
  );
}

export default LoadingSpinner;
