import React, { useContext, useEffect, useState } from "react";
import LoadingErrorState from "../molecules/LoadingErrorState";

import { WeatherContext } from "../../context/WeatherContext";
import { AppContext } from "../../context/AppContext";
import { getWeatherAssets } from "../../helpers/getWeatherAssets";

import FAVORITE_ICON from "../../assets/icons/regular/favorite.svg";
import FAVORITE_ACTIVE_ICON from "../../assets/icons/regular/favorite_active.svg";

import sc from "./WeatherSection.module.css";

const WeatherSection = () => {
  const { weatherData, loading, error } = useContext(WeatherContext);
  const { addToFavorites, removeFromFavorites, favorites } =
    useContext(AppContext);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (weatherData) {
      const cityExists = favorites.some((fav) => fav.name === weatherData.name);
      setIsFavorite(cityExists);
    }
  }, [weatherData, favorites]);

  if (loading || error || !weatherData) {
    return (
      <LoadingErrorState
        loading={loading}
        error={error}
        weatherData={weatherData}
      />
    );
  }

  const { name, sys, coord, main } = weatherData;
  const { icon, cardColor } = getWeatherAssets(weatherData);

  const onFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(weatherData.name);
      setIsFavorite(false);
    } else {
      addToFavorites(weatherData);
      setIsFavorite(true);
    }
  };

  return (
    <section className={sc.weather_card} style={{ backgroundColor: cardColor }}>
      <div className={sc.desc}>
        <p className={sc.city}>{name}</p>
        <p className={sc.country}>{sys.country}</p>
        <p className={sc.coord}>
          {coord.lat.toFixed(3)}, {coord.lon.toFixed(3)}
        </p>
      </div>
      <img
        className={sc.fav}
        src={isFavorite ? FAVORITE_ACTIVE_ICON : FAVORITE_ICON}
        alt="Favorite"
        onClick={onFavoriteToggle}
      />
      <div className={sc.about}>
        <img src={icon} alt="Weather" className={sc.image_weather} />
        <div className={sc.temp_container}>
          <p className={sc.temp}>
            {Math.round(main.temp)} <span>°C</span>
          </p>
          <p className={sc.weather_type}>
            {weatherData.weather[0].description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WeatherSection;
