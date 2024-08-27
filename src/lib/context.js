// MapContext.js
import React, { createContext, useState, useContext, useMemo } from "react";
import { scaleThreshold } from "d3-scale";
const MapContext = createContext();
const redColors = ["#b91c1c", "#dc2626", "#ef4444", "#f87171", "#fca5a5"];
const grayColors = ["#12375A", "#4E6C8A", "#7590AB", "#A7BDD3", "#D2E4F6"];

export function MapProvider({ children }) {
  const [selectedState, setSelectedState] = useState({ id: 0, name: "US" });

  const [selectedCounties, setSelectedCounties] = useState([]);

  const updateSelectedCounties = (counties) => {
    setSelectedCounties(counties);
  };

  const colorScale = useMemo(() => {
    const positiveThreshold = scaleThreshold()
      .domain([0.2, 0.4, 0.6, 0.8, 1])
      .range(redColors);

    const negativeThreshold = scaleThreshold()
      .domain([-0.8, -0.6, -0.4, -0.2, 0])
      .range(grayColors.slice().reverse());

    return (value) => {
      if (value >= 0) {
        return positiveThreshold(value);
      } else {
        return negativeThreshold(value);
      }
    };
  }, []);
  return (
    <MapContext.Provider
      value={{
        selectedState,
        setSelectedState,
        colorScale,
        selectedCounties,
        updateSelectedCounties,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  return useContext(MapContext);
}
