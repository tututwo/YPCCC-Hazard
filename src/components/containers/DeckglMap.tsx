// @ts-nocheck
import React, { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import { Map } from "react-map-gl/maplibre";
import { useMapContext } from "@/lib/context";
import DeckGL from "@deck.gl/react";
import { MapViewState, FlyToInterpolator } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CARTO_BASEMAP =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const DeckglMap = ({
  width = 975,
  height = 610,
  zoomToWhichState,
  geographyData,
  colorScale,
}) => {
  const { selectedState } = useMapContext();
  const [initialViewState, setInitialViewState] = useState({
    longitude: -98.5795,
    latitude: 39.8283,
    zoom: 3,
    pitch: 0,
    bearing: 0,
  });
  const [alphaValues, setAlphaValues] = useState(() => {
    const initialAlphas = {};
    geographyData.features.forEach((feature) => {
      initialAlphas[feature.properties.STATENAME] = 255;
    });
    return initialAlphas;
  });

  const mapRef = useRef(null);

  useEffect(() => {
    const newViewState = {
      minZoom: 3,
      transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
      transitionDuration: "auto",
    };

    if (selectedState.name === "US") {
      setInitialViewState({
        longitude: -98.5795,
        latitude: 39.8283,
        zoom: 3.8,
        pitch: 0,
        bearing: 0,
        ...newViewState,
      });
    } else {
      setInitialViewState({
        ...zoomToWhichState[selectedState.name],
        ...newViewState,
      });
    }
  }, [selectedState, zoomToWhichState]);

  useGSAP(
    () => {
      const targetAlphas = {};
      geographyData.features.forEach((feature) => {
        targetAlphas[feature.properties.STATENAME] =
          selectedState.name === "US" ||
          feature.properties.STATENAME === selectedState.name
            ? 255
            : 80;
      });

      gsap.to(alphaValues, {
        ...targetAlphas,
        duration: .88,
        ease: "power2.inOut",
        onUpdate: () => setAlphaValues({ ...alphaValues }),
      });
    },
    { dependencies: [selectedState, geographyData] }
  );
  const layers = useMemo(
    () => [
      new GeoJsonLayer({
        id: "geojson-layer",
        data: geographyData,
        getFillColor: (d) => {
          const { r, g, b } = d3.color(
            colorScale(d.properties.gap_cc_heatscore)
          );
          const a = alphaValues[d.properties.STATENAME] || 255; // Default to 255 if not set
          return [r, g, b, a];
        },
        getLineColor: [255, 255, 255],
        getLineWidth: 1,
        updateTriggers: {
          getFillColor: [selectedState, colorScale, alphaValues],
        },
      }),
    ],
    [geographyData, selectedState, colorScale, alphaValues]
  );

  return (
    <map ref={mapRef} style={{ width: "100%", height: "100%" }}>
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      >
        <Map reuseMaps mapStyle={CARTO_BASEMAP} />
      </DeckGL>
    </map>
  );
};

export default DeckglMap;
