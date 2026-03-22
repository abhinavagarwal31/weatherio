import './RecentCities.css';

function RecentCities({ cities, onCityClick, onClear, getIconUrl }) {
  return (
    <section className="recent-section">
      <div className="recent-header">
        <h3 className="recent-title">🕘 Recent Searches</h3>
        {cities.length > 0 && (
          <button className="clear-recent-btn" onClick={onClear}>
            Clear All
          </button>
        )}
      </div>
      <div className="recent-cities">
        {/* Empty state */}
        {cities.length === 0 && (
          <p className="no-recent">No recent searches yet. Try searching for a city above!</p>
        )}

        {/* Render list using map() with proper keys */}
        {cities.map((entry) => (
          <div
            className="recent-chip"
            key={entry.id}
            role="button"
            tabIndex={0}
            onClick={() => onCityClick(entry.city)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCityClick(entry.city);
              }
            }}
          >
            <span className="recent-chip-icon" role="img" aria-hidden="true">
              {entry.icon}
            </span>
            <span className="recent-chip-city">{entry.city}</span>
            <span className="recent-chip-temp">{entry.temp}°C</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentCities;
