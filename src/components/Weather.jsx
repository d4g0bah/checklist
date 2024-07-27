import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NubladoOSoleadoImg from '../Assets/nublado-o-soleado.webp';

const Weather = ({ apiKey }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Antofagasta&appid=${apiKey}&units=metric&lang=es`);
        setWeather(response.data);
      } catch (err) {
        setError('Error al obtener el clima');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [apiKey]);

  if (loading) {
    return <div>Cargando clima...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3>Clima en Antofagasta</h3>
      {weather && (
        <div>
          <img src={NubladoOSoleadoImg} alt="Nublado o Soleado" style={{ width: '100px', height: '100px' }} />
          <p>Temperatura: {weather.main.temp}°C</p>
          <p>Descripción: {weather.weather[0].description}</p>
          <p>Humedad: {weather.main.humidity}%</p>
          <p>Viento: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
