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
const colorScale = d3
  .scaleSequential(d3[`interpolate${"Rainbow"}`])
  .domain([0, 50]);
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

const DeckglMap = ({ width = 975, height = 610 }) => {
  const [geographyData, setGeographyData] = useState(null);
  const [csvData, setCSVData] = useState([]);
  const { selectedState } = useMapContext();
  const [viewState, setViewState] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3,
    bearing: 0,
    pitch: 0,
  });
  const [projectedGeography, setProjectedGeography] = useState(null);
  const mapRef = useRef(null);
  const onResize = useCallback(() => {
    if (mapRef.current) {
      const { clientWidth, clientHeight } = mapRef.current;
      setViewState((prev) => ({
        ...prev,
        width: clientWidth,
        height: clientHeight,
      }));
    }
  }, []);

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onResize]);
  useEffect(() => {
    (async () => {
      const csvData = await d3.csv("/data.csv");
      const geojsonData = await d3.json("/counties.json");
      const modifiedGeojsonData = geojsonData.features.filter((d) =>
        csvData.find((e) => e.geoid === d.id)
      );
      modifiedGeojsonData.forEach((element) => {
        element.properties.state = csvData.find(
          (e) => e.geoid === element.id
        ).state;
      });
      setGeographyData(modifiedGeojsonData);
      setCSVData(csvData);
    })();
  }, []);
  const getStateViewport = (features, stateName) => {
    const stateFeatures = features.filter(
      (f) => f.properties.state === stateName
    );
    if (stateFeatures.length === 0) return null;

    const bbox = calculateBBox(stateFeatures);
    if (!bbox) return null;

    const [[minLng, minLat], [maxLng, maxLat]] = bbox;
   
    return {
      longitude: (minLng + maxLng) / 2,
      latitude: (minLat + maxLat) / 2,
      zoom: 0.67 * Math.max(maxLng - minLng, maxLat - minLat),
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 2000,
    };
  };
  useEffect(() => {
    if (geographyData && selectedState && selectedState.name) {
      const newViewState = getStateViewport(geographyData, selectedState.name);
      if (newViewState) {
        setViewState((prevState) => ({
          ...prevState,
          ...newViewState,
        }));
      }
    }
  }, [geographyData, selectedState]);
  const layers = [
    new GeoJsonLayer({
      id: "geojson-layer",
      data: geographyData,
      fill: true,
      getFillColor: (d, i) => {
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
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={true}
        layers={layers}
      ></DeckGL>
    </map>
  );
};

export default DeckglMap;
