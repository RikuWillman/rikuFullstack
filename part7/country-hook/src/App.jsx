import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (name) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        .then((response) => {
          const countryData = response.data;
          setCountry({
            found: true,
            data: {
              name: countryData.name.common,
              capital: countryData.capital[0],
              population: countryData.population,
              flag: countryData.flags.png,
            },
          });
        })
        .catch((error) => {
          setCountry({ found: false });
        });
    }
  }, [name]);

  return country;
};
