// @ts-nocheck
"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";
import { geoAlbers, geoMercator, geoOrthographic } from "d3-geo";

import { feature, mesh } from "topojson-client";
import { useMapContext } from "@/lib/context";

import DeckGL from "@deck.gl/react";
import { MapViewState, FlyToInterpolator } from "@deck.gl/core";
import { LineLayer, GeoJsonLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl";

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
  const [initialViewState, setInitialViewState] = useState<MapViewState>(
    zoomToWhichState.Michigan
  );

  const mapRef = useRef(null);

  useEffect(() => {
    setInitialViewState({
      ...zoomToWhichState[selectedState.name],
      transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
      transitionDuration: "auto",
    });
  }, [selectedState]);

  const layers = [
    new GeoJsonLayer({
      id: "geojson-layer",
      data: geographyData,
      fill: true,
      getFillColor: (d, i) => {
        console.log(d)
        const { r, g, b, a } = d3.color(colorScale(i.index)) ?? {
          r: 0,
          g: 0,
          b: 0,
          a: 255,
        };
        return [r, g, b, a];
      },
      getLineColor: [255, 255, 255],
      getLineWidth: 1,
    }),
  ];

  return (
    <map ref={mapRef} style={{ width: "100%", height: "100%" }}>
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      ></DeckGL>
    </map>
  );
};

export default DeckglMap;
