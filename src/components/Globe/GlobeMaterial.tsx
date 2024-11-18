import { useEffect, useState } from 'react';
import * as THREE from 'three';

export function useGlobeMaterial() {
  const [material, setMaterial] = useState<THREE.MeshPhongMaterial | null>(null);

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    
    Promise.all([
      textureLoader.loadAsync('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'),
      textureLoader.loadAsync('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg'),
      textureLoader.loadAsync('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg')
    ]).then(([diffuseMap, normalMap, specularMap]) => {
      const newMaterial = new THREE.MeshPhongMaterial({
        map: diffuseMap,
        normalMap: normalMap,
        specularMap: specularMap,
        normalScale: new THREE.Vector2(0.85, 0.85),
        shininess: 25
      });
      setMaterial(newMaterial);
    });

    return () => {
      // Cleanup textures when component unmounts
      material?.dispose();
      material?.map?.dispose();
      material?.normalMap?.dispose();
      material?.specularMap?.dispose();
    };
  }, []);

  return material;
}