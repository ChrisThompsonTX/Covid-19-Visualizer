import React, { useState, useEffect } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, Card } from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import { sortData, prettyPrintStat } from './util';
import "leaflet/dist/leaflet.css";

function App() {
  const [ countries, setCountries] = useState([]);
  const [ country, setCountry] = useState(['worldwide']);
  const [ countryInfo, setCountryInfo] = useState({});
  const [ tableData, setTableData] = useState([]);
  const [ mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [ mapZoom, setMapZoom] = useState(3);
  const [ mapCountries, setMapCountries] = useState([]);
  const [ casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(res => res.json())
      .then(data => {
        setCountryInfo(data);
      });
  }, []);

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


            const sortedData = sortData(data);
            setCountries(countries);
            setMapCountries(data);
            setTableData(sortedData);
        })
    };

    getCountriesData();
  }, [countries]);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    
    const url = countryCode === 'worldwide' 
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(res => res.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
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
                <MenuItem key={country.name} value={country.value} >{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox 
            isRed
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}
            onClick={e => setCasesType('cases')}
            active={casesType === 'cases'}
            />
          <InfoBox 
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)}
            onClick={e => setCasesType('recovered')}
            active={casesType === 'recovered'}
            />
          <InfoBox 
            isRed
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)} 
            onClick={e => setCasesType('deaths')}
            active={casesType === 'deaths'}
            />
        </div>

        <Map 
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />

      </div>
      <Card className="app__right">
        <h3>Live Cases by Country</h3>
        <Table countries={tableData} />
          <h3>WorldWide new {casesType}</h3>
        <LineGraph casesType={casesType}/>
      </Card>
    </div>
  );
}

export default App;
