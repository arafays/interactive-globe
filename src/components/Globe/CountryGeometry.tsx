import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Feature } from 'geojson';

export function useCountryGeometries() {
  const [geometries, setGeometries] = useState<{
    [key: string]: THREE.BufferGeometry;
  }>();

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/johan/world.geo.json/refs/heads/master/countries.geo.json'
    )
      .then((res) => res.json())
      .then((data) => {
        const newGeometries: { [key: string]: THREE.BufferGeometry } = {};
        data.features.forEach((feature: Feature) => {
          if (feature.id) {
            const coordinates = feature.geometry.coordinates;
            const points: THREE.Vector3[] = [];

            coordinates.forEach((poly: any) => {
              poly.forEach((coord: number[]) => {
                const lat = (coord[1] * Math.PI) / 180;
                const lon = (coord[0] * Math.PI) / 180;
                const radius = 2.02; // Slightly larger than globe to prevent z-fighting
                const x = radius * Math.cos(lat) * Math.sin(lon);
                const y = radius * Math.sin(lat);
                const z = radius * Math.cos(lat) * Math.cos(lon);
                points.push(new THREE.Vector3(x, y, z));
              });
            });

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            newGeometries[feature.id] = geometry;
          }
        });
        console.log(newGeometries);
        setGeometries(newGeometries);
      });

    return () => {
      // Cleanup geometries when component unmounts
      Object.values(geometries || {}).forEach((geometry) => geometry.dispose());
    };
  }, []);

  return geometries;
}
