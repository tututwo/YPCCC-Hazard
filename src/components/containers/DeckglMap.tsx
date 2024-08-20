// @ts-nocheck
"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import * as d3 from "d3";
import { geoAlbers, geoMercator, geoOrthographic } from "d3-geo";
import { Map } from "react-map-gl/maplibre";
import { feature, mesh } from "topojson-client";
import { useMapContext } from "@/lib/context";

import DeckGL from "@deck.gl/react";
import { MapViewState, FlyToInterpolator } from "@deck.gl/core";
import { LineLayer, GeoJsonLayer } from "@deck.gl/layers";

const CARTO_BASEMAP =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const projectGeoJson = (geojson, projection) => {
  const path = d3.geoPath().projection(projection);
  return {
    type: "FeatureCollection",
    features: geojson.features.map((feature) => ({
      type: "Feature",
      geometry: {
        type: "MultiPolygon",
        coordinates: path(feature).coordinates || [],
      },
      properties: feature.properties,
    })),
  };
};
const calculateBBox = (features) => {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  let validCoordinatesFound = false;

  features.forEach((feature) => {
    if (feature.geometry && feature.geometry.coordinates) {
      feature.geometry.coordinates[0].forEach((coord) => {
        const [lng, lat] = coord;
        if (isFinite(lng) && isFinite(lat)) {
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
          validCoordinatesFound = true;
        }
      });
    }
  });

  return validCoordinatesFound
    ? [
        [minLng, minLat],
        [maxLng, maxLat],
      ]
    : null;
};

const DeckglMap = ({
  width = 975,
  height = 610,
  zoomToWhichState,
  geographyData,
  colorScale,
}) => {
  const { selectedState } = useMapContext();
  const [initialViewState, setInitialViewState] = useState<MapViewState>({
    longitude: -98.5795, // Roughly the center of the US
    latitude: 39.8283,
    zoom: 3, // Adjust this value to fit the entire US in view
    pitch: 0,
    bearing: 0,
  });

  const mapRef = useRef(null);

  useEffect(() => {
    if (selectedState.name === "US") {
      setInitialViewState({
        longitude: -98.5795, // Roughly the center of the US
        latitude: 39.8283,
        zoom: 3.8, // Adjust this value to fit the entire US in view
        pitch: 0,
        bearing: 0,
        minZoom: 3,
      });
    } else {
      setInitialViewState({
        ...zoomToWhichState[selectedState.name],
        minZoom: 3,
        transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
        transitionDuration: "auto",
      });
    }
  }, [selectedState]);

  const layers = useMemo(
    () => [
      new GeoJsonLayer({
        id: "geojson-layer",
        data: geographyData,
        getFillColor: (d) => {
          const { r, g, b } = d3.color(
            colorScale(d.properties.gap_cc_heatscore)
          );
          let a;
          if (selectedState.name === "US") {
            a = 255;
          } else {
            a = d.properties.STATENAME === selectedState.name ? 255 : 80;
          }

          return [r, g, b, a];
        },
        getLineColor: [255, 255, 255],
        getLineWidth: 1,
        updateTriggers: {
          getFillColor: [selectedState, colorScale],
        },
      }),
    ],
    [geographyData, selectedState, colorScale]
  );

  return (
    <map ref={mapRef} style={{ width: "100%", height: "100%" }}>
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      >
        <Map
          reuseMaps
          mapStyle={
            "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
          }
        />
      </DeckGL>
    </map>
  );
};

export default DeckglMap;
