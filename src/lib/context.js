// MapContext.js
import React, { createContext, useState, useContext } from 'react';

const MapContext = createContext();

export function MapProvider({ children }) {
  const [selectedState, setSelectedState] = useState({ id: 0, name: 'US' });

  return (
    <MapContext.Provider value={{ selectedState, setSelectedState }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  return useContext(MapContext);
}