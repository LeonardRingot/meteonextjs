'use client'

import axios from "axios";
import { useState } from "react";
import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Image from "next/image";
export default function Home() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState({})
  const [forecasts, setForecast] = useState([])
  const [loading, setLoading] = useState(false)

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
  const getIconUrl = (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`;
   const fetchWeather = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const weatherResponse = await axios.get(weatherUrl);
      setWeather(weatherResponse.data);

      const forecastResponse = await axios.get(forecastUrl);
      setForecast(forecastResponse.data.list);

      console.log("Weather data:", weatherResponse.data);
      console.log("Forecast data:", forecastResponse.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      margin: '0 auto 16px',
      padding: '16px',
      backgroundColor: 'red',
      borderRadius: '4px',
      boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.2)',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 3 }}>
        <Box sx={{ width: '65%' }}>
          <Typography variant="h5" sx={{ textAlign: 'center' }}>Mon application Météo</Typography>
          <Card sx={{ width: '100%', height: 'auto', alignContent: 'center' }}>
            <CardContent>
              <TextField
                label="Nom de la ville"
                variant="outlined"
                fullWidth
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Button variant="contained" onClick={fetchWeather} disabled={loading} sx={{ mt: 2 }}>
                Rechercher
              </Button>
            </CardContent>
          </Card>
          <Typography>Aujourd'hui </Typography>
          <Card sx={{ width: '100%', height: 'auto', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
  {/* Informations textuelles */}
  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: 2 }}>
    <Typography variant="h5">{weather.name}</Typography>
    <Typography variant="h2">{Math.round(weather.main && weather.main.temp - 273.15)}°C</Typography>
    <Typography variant="h6">Humidité: {weather.main && weather.main.humidity}%</Typography>
    <Typography variant="h6">{weather.weather && weather.weather[0].description}</Typography>
  </Box>

  {/* Image */}
  <Box sx={{ flex: 1, textAlign: 'center', p: 2 }}>
    {weather.weather && (
      <img src={getIconUrl(weather.weather[0].icon)} alt="Weather Icon" />
    )}
  </Box>
</Card>
          <Typography>PREVISIONS DE LA JOURNÉE </Typography>
          <Card sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center' }}>
  <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
    {/* Afficher les prévisions de 6h, 9h, 12h, 15h, 18h et 21h */}
    {[6, 9, 12, 15, 18, 21].map((hour) => {
      const forecast = forecasts.find((f) => {
        const forecastTime = new Date(f.dt * 1000).getUTCHours();
        return forecastTime === hour;
      });

      return (
        <Box key={hour} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2, mb: 2 }}>
          <Typography>{hour}:00</Typography>
          {forecast && (
            <>
              <img src={getIconUrl(forecast.weather[0].icon)} alt="Weather Icon" />
              <Typography>{Math.round(forecast.main && forecast.main.temp - 273.15)}°C</Typography>
            </>
          )}
        </Box>
      );
    })}
  </CardContent>
</Card>
          <Typography>Conditions de l'air</Typography>
          <Card sx={{ width: '100%', height: 'auto', alignContent: 'center' }}>
  <CardContent>
    <Typography variant="h6">Vitesse du vent: {weather.wind && weather.wind.speed}km/h</Typography>
    <Typography variant="h6">Temperature feel: {Math.round(weather.main && weather.main.feels_like - 273.15)}°C</Typography>
    
  </CardContent>
</Card>
        </Box>
        {/* Prévisions des 7 prochains jours*/}
        <Box sx={{ width: '30%' }}>
        <Typography>Prévisions prochains jours</Typography>
        <Card sx={{ width: '100%', height: 'auto', alignContent: 'center' }}>
          <CardContent>
            {/* Afficher les prévisions des 7 prochains jours */}
            {forecasts && forecasts.slice(0, 7).map((forecast, index) => {
              const forecastDate = new Date(forecast.dt * 1000);
              const dayOfWeek = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(forecastDate);

              return (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography>{dayOfWeek}</Typography>
                  <img src={getIconUrl(forecast.weather[0].icon)} alt="Weather Icon" />
                  <Typography>{Math.round(forecast.main && forecast.main.temp - 273.15)}°C</Typography>
                </Box>
              );
            })}
          </CardContent>
        </Card>
      </Box>

      </Box>
    </Box>
  );
}
