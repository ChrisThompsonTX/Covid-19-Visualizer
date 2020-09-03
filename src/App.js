import React, { useState, useEffect } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, Card } from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';

function App() {
  const [ countries, setCountries] = useState([]);
  const [ country, setCountry] = useState(['worldwide']);

  useEffect(()=> {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }));

            setCountries(countries);
        })
    };

    getCountriesData();
  }, [countries]);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);
  }

  return (
    <div className="app">
      <div className="app__left">

        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value='worldwide' >WorldWide</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value} >{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" cases={123} total={2000} />
          <InfoBox title="Recovered" cases={1234} total={3000} />
          <InfoBox title="Deaths" cases={1243} total={4000} />
        </div>

        
        
        {/* Map */}
        <Map></Map>
      </div>
      <Card className="app__right">
        {/* table */}
        {/* graph */}
      </Card>
    </div>
  );
}

export default App;
