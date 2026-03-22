import './WeatherCard.css';

function WeatherCard({ data, unit, onToggleUnit, formatTemp, getIconUrl, formatDate }) {
  return (
    <section className="weather-section">
      <div className="weather-card">
        {/* Toggle °C ↔ °F */}
        <div className="unit-toggle-wrapper">
          <button
            className="unit-toggle"
            id="unitToggle"
            onClick={onToggleUnit}
            data-active={unit}
            aria-label="Toggle temperature unit"
          >
            <span className={`unit-option ${unit === 'C' ? 'active' : ''}`} data-unit="C">°C</span>
            <span className="unit-slider"></span>
            <span className={`unit-option ${unit === 'F' ? 'active' : ''}`} data-unit="F">°F</span>
          </button>
        </div>

        {/* Main Weather Info */}
        <div className="weather-main">
          <div className="weather-icon-wrapper">
            <span className="weather-icon-emoji" role="img" aria-label={data.conditionDesc}>
              {data.icon}
            </span>
          </div>
          <div className="weather-temp-wrapper">
            <span className="weather-temp" id="weatherTemp">{formatTemp(data.tempCelsius)}</span>
            <span className="weather-unit" id="weatherUnit">{unit === 'C' ? '°C' : '°F'}</span>
          </div>
          <p className="weather-condition" id="weatherCondition">{data.conditionDesc}</p>
        </div>

        {/* City & Date */}
        <div className="weather-location">
          <h2 className="weather-city" id="weatherCity">{data.city}, {data.country}</h2>
          <p className="weather-date" id="weatherDate">{formatDate()}</p>
        </div>

        {/* Weather Details Grid - uses map() with keys */}
        <div className="weather-details">
          {[
            { icon: '🌡️', label: 'Feels Like', value: `${formatTemp(data.feelsLikeCelsius)}°`, id: 'feelsLike' },
            { icon: '💧', label: 'Humidity', value: `${data.humidity}%`, id: 'humidity' },
            { icon: '💨', label: 'Wind Speed', value: `${data.windSpeed} m/s`, id: 'wind' },
            { icon: '🔵', label: 'Pressure', value: `${data.pressure} hPa`, id: 'pressure' },
          ].map((detail) => (
            <div className="detail-item" key={detail.id}>
              <div className="detail-icon">{detail.icon}</div>
              <div className="detail-info">
                <span className="detail-value">{detail.value}</span>
                <span className="detail-label">{detail.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WeatherCard;
