import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import RecentCities from './components/RecentCities';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import './App.css';

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const MAX_RECENT = 6;
const STORAGE_KEY = 'weatherChecker_recentCities';

// WMO Weather Code mapping for descriptions and icons
const WMO_CODES = {
  0: { desc: 'Clear sky', icon: '☀️' },
  1: { desc: 'Mainly clear', icon: '🌤️' },
  2: { desc: 'Partly cloudy', icon: '⛅' },
  3: { desc: 'Overcast', icon: '☁️' },
  45: { desc: 'Foggy', icon: '🌫️' },
  48: { desc: 'Depositing rime fog', icon: '🌫️' },
  51: { desc: 'Light drizzle', icon: '🌦️' },
  53: { desc: 'Moderate drizzle', icon: '🌦️' },
  55: { desc: 'Dense drizzle', icon: '🌧️' },
  61: { desc: 'Slight rain', icon: '🌦️' },
  63: { desc: 'Moderate rain', icon: '🌧️' },
  65: { desc: 'Heavy rain', icon: '🌧️' },
  71: { desc: 'Slight snowfall', icon: '🌨️' },
  73: { desc: 'Moderate snowfall', icon: '🌨️' },
  75: { desc: 'Heavy snowfall', icon: '❄️' },
  77: { desc: 'Snow grains', icon: '❄️' },
  80: { desc: 'Slight rain showers', icon: '🌦️' },
  81: { desc: 'Moderate rain showers', icon: '🌧️' },
  82: { desc: 'Violent rain showers', icon: '⛈️' },
  85: { desc: 'Slight snow showers', icon: '🌨️' },
  86: { desc: 'Heavy snow showers', icon: '🌨️' },
  95: { desc: 'Thunderstorm', icon: '⛈️' },
  96: { desc: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { desc: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

function getWeatherInfo(code) {
  return WMO_CODES[code] || { desc: 'Unknown', icon: '🌍' };
}

function App() {
  // ===== useState for UI + data =====
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C'); // Toggle: °C / °F
  const [recentCities, setRecentCities] = useState([]);

  // ===== useEffect: Load recent cities from localStorage on mount =====
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentCities(JSON.parse(stored));
      }
    } catch {
      setRecentCities([]);
    }
  }, []);

  // ===== useEffect: Persist recent cities to localStorage =====
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentCities));
  }, [recentCities]);

  // ===== Helper: Convert temperature based on unit =====
  const formatTemp = (celsius) => {
    if (celsius === null || celsius === undefined) return '--';
    const val = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
    return Math.round(val);
  };

  // ===== Helper: Get weather emoji icon (no external images needed) =====
  const getIconUrl = (iconCode) => {
    return iconCode; // We use emoji strings directly now
  };

  // ===== API: Fetch weather data using Open-Meteo (free, no key) =====
  const fetchWeather = async (searchCity) => {
    if (!searchCity.trim()) return;

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      // Step 1: Geocode the city name
      const geoRes = await fetch(`${GEOCODE_URL}?name=${encodeURIComponent(searchCity)}&count=1&language=en`);
      if (!geoRes.ok) throw new Error('API_ERROR');
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('CITY_NOT_FOUND');
      }

      const place = geoData.results[0];

      // Step 2: Get weather for the coordinates
      const weatherRes = await fetch(
        `${WEATHER_URL}?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure`
      );
      if (!weatherRes.ok) throw new Error('API_ERROR');
      const weatherJson = await weatherRes.json();

      const current = weatherJson.current;
      const weatherInfo = getWeatherInfo(current.weather_code);

      const weather = {
        city: place.name,
        country: place.country_code || '',
        tempCelsius: current.temperature_2m,
        feelsLikeCelsius: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        pressure: Math.round(current.surface_pressure),
        windSpeed: current.wind_speed_10m,
        condition: weatherInfo.desc,
        conditionDesc: weatherInfo.desc,
        icon: weatherInfo.icon,
      };

      setWeatherData(weather);
      setLoading(false);

      // Save to recent cities
      saveToRecent({
        city: weather.city,
        country: weather.country,
        temp: Math.round(weather.tempCelsius),
        icon: weather.icon,
        id: `${weather.city}-${weather.country}`,
      });
    } catch (err) {
      setLoading(false);
      if (err.message === 'CITY_NOT_FOUND') {
        setError({
          title: 'City Not Found',
          message: `We couldn't find "${searchCity}". Please check the spelling and try again.`,
        });
      } else if (err.message === 'API_ERROR') {
        setError({
          title: 'Something Went Wrong',
          message: 'There was an issue fetching weather data. Please try again later.',
        });
      } else {
        setError({
          title: 'Connection Error',
          message: 'Please check your internet connection and try again.',
        });
      }
    }
  };

  // ===== Save to recent cities =====
  const saveToRecent = (entry) => {
    setRecentCities((prev) => {
      const filtered = prev.filter(
        (r) => r.city.toLowerCase() !== entry.city.toLowerCase()
      );
      const updated = [entry, ...filtered];
      return updated.slice(0, MAX_RECENT);
    });
  };

  // ===== Toggle °C ↔ °F =====
  const toggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  // ===== Search handler =====
  const handleSearch = (searchCity) => {
    setCity(searchCity);
    fetchWeather(searchCity);
  };

  // ===== Clear recent cities =====
  const clearRecent = () => {
    setRecentCities([]);
  };

  // ===== Retry handler =====
  const handleRetry = () => {
    setError(null);
    setWeatherData(null);
  };

  // ===== Format current date =====
  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* Animated background orbs */}
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="logo">
            <span className="logo-icon">🌦️</span>
            <h1>WeatherFlix</h1>
          </div>
          <p className="tagline">Stream the weather. Watch it live.</p>
        </header>

        {/* Search Bar - Controlled Input */}
        <SearchBar onSearch={handleSearch} isLoading={loading} />

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && (
          <ErrorDisplay
            title={error.title}
            message={error.message}
            onRetry={handleRetry}
          />
        )}

        {/* Weather Card */}
        {weatherData && !loading && !error && (
          <WeatherCard
            data={weatherData}
            unit={unit}
            onToggleUnit={toggleUnit}
            formatTemp={formatTemp}
            getIconUrl={getIconUrl}
            formatDate={formatDate}
          />
        )}

        {/* Recent Cities - uses map() with keys */}
        <RecentCities
          cities={recentCities}
          onCityClick={handleSearch}
          onClear={clearRecent}
          getIconUrl={getIconUrl}
        />
      </div>
    </>
  );
}

export default App;
