import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AnimatePresence } from 'framer-motion';
import Globe from './components/Globe/Globe';
import AlumniPanel from './components/AlumniPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import { mockAlumni } from './data/mockAlumni';
import { useState } from 'react';

function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading globe...</p>
      </div>
    </div>
  );
}

function App() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  return (
    <div className="w-full h-screen relative bg-gray-900">
      <ErrorBoundary>
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <Suspense fallback={null}>
            <Globe
              onCountryClick={setSelectedCountry}
              highlightedCountry={selectedCountry}
              alumni={mockAlumni}
            />
          </Suspense>
          <OrbitControls
            enablePan={false}
            minDistance={4}
            maxDistance={8}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>
      </ErrorBoundary>

      <AnimatePresence>
        {selectedCountry && (
          <AlumniPanel
            country={selectedCountry}
            alumni={mockAlumni}
            onClose={() => setSelectedCountry(null)}
          />
        )}
      </AnimatePresence>

      {!selectedCountry && (
        <div className="absolute top-4 left-4 bg-white/90 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Alumni Globe</h2>
          <p className="text-sm text-gray-600">
            Click on countries to see alumni information.<br />
            Drag to rotate, scroll to zoom.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;