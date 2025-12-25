import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (name && name.trim() !== '') {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        .then((response) => {
          const countryData = response.data;
          setCountry({
            found: true,
            data: {
              name: countryData.name.common,
              capital: countryData.capital ? countryData.capital[0] : 'N/A',
              population: countryData.population.toLocaleString(),
              flag: countryData.flags.png,
            },
          });
        })
        .catch((exactError) => {
          axios
            .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
            .then((allResponse) => {
              const countries = allResponse.data;
              const matchingCountries = countries.filter((c) =>
                c.name.common.toLowerCase().includes(name.toLowerCase())
              );

              if (matchingCountries.length === 1) {
                const countryData = matchingCountries[0];
                setCountry({
                  found: true,
                  data: {
                    name: countryData.name.common,
                    capital: countryData.capital
                      ? countryData.capital[0]
                      : 'N/A',
                    population: countryData.population.toLocaleString(),
                    flag: countryData.flags.png,
                  },
                });
              } else if (matchingCountries.length > 1) {
                const countryData = matchingCountries[0];
                setCountry({
                  found: true,
                  data: {
                    name: countryData.name.common,
                    capital: countryData.capital
                      ? countryData.capital[0]
                      : 'N/A',
                    population: countryData.population.toLocaleString(),
                    flag: countryData.flags.png,
                  },
                });
              } else {
                setCountry({ found: false });
              }
            })
            .catch((searchError) => {
              setCountry({ found: false });
            });
        });
    } else {
      setCountry(null);
    }
  }, [name]);

  return country;
};
