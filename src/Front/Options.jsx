import React, { useState } from 'react';
import './Options.css';

const cities = [
  'Jerusalem',
  'Tel Aviv',
  'Haifa',
  'Ramat Gan',
  'Petah Tikva',
  'Ashdod',
  'Beer Sheva',
  'Netanya',
  'Eilat',
  'Herzliya'
];

function Options() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [population, setPopulation] = useState(0);

  return (
    <div className="options-container">
      <h2>Options</h2>

      <label htmlFor="city-select">Select city:</label>
      <select
        id="city-select"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      <label htmlFor="population-range">
        Select Population: {population.toLocaleString()} km
      </label>
      <input
        type="range"
        id="population-range"
        min="0"
        max="200000"
        value={population}
        onChange={(e) => setPopulation(Number(e.target.value))}
      />
    </div>
  );
}

export default Options;
