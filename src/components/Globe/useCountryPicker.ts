import { useEffect, useState } from 'react';
import { Feature } from 'geojson';

interface CountryFeature extends Feature {
  id: string;
  properties: {
    NAME: string;
  };
}

export function useCountryPicker() {
  const [countries, setCountries] = useState<CountryFeature[]>([]);

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/johan/world.geo.json/refs/heads/master/countries.geo.json'
    )
      .then((res) => res.json())
      .then((data) => {
        setCountries(data.features);
      });
  }, []);

  const getCountryFromLatLng = (lat: number, lng: number): string | null => {
    for (const country of countries) {
      if (isPointInPolygon(lat, lng, country.geometry.coordinates)) {
        console.log(country);
        return country.id;
      }
    }
    return null;
  };

  const isPointInPolygon = (
    lat: number,
    lng: number,
    coordinates: any[]
  ): boolean => {
    for (const polygon of coordinates) {
      for (const ring of polygon) {
        let inside = false;
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
          const xi = ring[i][0],
            yi = ring[i][1];
          const xj = ring[j][0],
            yj = ring[j][1];

          const intersect =
            yi > lat !== yj > lat &&
            lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
          if (intersect) inside = !inside;
        }
        if (inside) return true;
      }
    }
    return false;
  };

  return { getCountryFromLatLng };
}
