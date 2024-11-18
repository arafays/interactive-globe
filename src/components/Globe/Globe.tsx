import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Alumni } from '../../types/Alumni';
import { useGlobeMaterial } from './GlobeMaterial';
import { useCountryGeometries } from './CountryGeometry';
import { useCountryPicker } from './useCountryPicker';

interface GlobeProps {
  onCountryClick: (country: string) => void;
  highlightedCountry: string | null;
  alumni: Alumni[];
}

export default function Globe({
  onCountryClick,
  highlightedCountry,
  alumni,
}: GlobeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const highlightRef = useRef<THREE.LineSegments>(null);
  const [hovered, setHovered] = useState(false);

  const globeMaterial = useGlobeMaterial();
  const countryGeometries = useCountryGeometries();
  const { getCountryFromLatLng } = useCountryPicker();

  useFrame(() => {
    if (meshRef.current && !hovered) {
      meshRef.current.rotation.y += 0.001;
    }
    if (highlightRef.current && meshRef.current) {
      highlightRef.current.rotation.copy(meshRef.current.rotation);
    }
  });

  const handleClick = useCallback(
    (event: THREE.Event) => {
      event.stopPropagation();
      if (!meshRef.current) return;

      const intersection = (event as any).intersections?.[0];
      if (!intersection) return;

      // Convert intersection point to latitude/longitude
      const point = intersection.point.clone().normalize();
      const lat = Math.asin(point.y) * (180 / Math.PI);
      const lng = Math.atan2(point.x, point.z) * (180 / Math.PI);

      // Get country code from coordinates
      const countryCode = getCountryFromLatLng(lat, lng);

      // Check if there are alumni from this country
      const hasAlumni = alumni.some((a) => a.country === countryCode);
      if (hasAlumni && countryCode) {
        onCountryClick(countryCode);
      }
    },
    [alumni, onCountryClick, getCountryFromLatLng]
  );

  if (!globeMaterial) {
    return null;
  }

  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <sphereGeometry args={[2, 64, 64]} />
        <primitive object={globeMaterial} attach="material" />
      </mesh>

      {highlightedCountry && countryGeometries?.[highlightedCountry] && (
        <lineSegments ref={highlightRef}>
          <primitive object={countryGeometries[highlightedCountry]} />
          <lineBasicMaterial color="#00ff00" linewidth={2} />
        </lineSegments>
      )}

      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
    </group>
  );
}
