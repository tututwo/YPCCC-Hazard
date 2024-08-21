import * as turf from "@turf/turf";
import { WebMercatorViewport } from "@deck.gl/core";
export default function calculateStateViewsFromCounties(
    countyGeoJSON: FeatureCollection,
    width = 800, // Default width is 800
    height = 600
  ) {
    const zoomToWhichState = {};
    const stateFeatures = {};
  
    // Group counties by state
    countyGeoJSON.features.forEach((county: Feature<MultiPolygon>) => {
      const stateName = county.properties?.STATENAME;
      if (!stateFeatures[stateName]) {
        stateFeatures[stateName] = [];
      }
      stateFeatures[stateName].push(county);
    });
  
    // Calculate view for each state
    Object.entries(stateFeatures).forEach(([stateName, counties]) => {
      // Combine all county polygons into a single multipolygon
  
      let combined;
  
      if (counties.length === 0) {
        console.warn(`No counties found for state: ${stateName}`);
        return;
      } else if (counties.length === 1) {
        combined = counties[0];
      } else {
        try {
          combined = turf.union(turf.featureCollection(counties));
          // combined = turf.union(...counties);
        } catch (error) {
          console.warn(`Error combining counties for ${stateName}:`, error);
          combined = counties[0]; // Fallback to using the first county
        }
      }
  
      const [minLng, minLat, maxLng, maxLat] = turf.bbox(combined);
  
      const [centerLng, centerLat] =
        turf.centerOfMass(combined).geometry.coordinates;
  
      // Calculate zoom
      const viewport = new WebMercatorViewport({ width, height }).fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: 20, // Add some padding
        }
      );
  
      // Special case for state "a" (adjust as needed)
      if (stateName === "a") {
        zoomToWhichState[stateName] = {
          longitude: centerLng,
          latitude: centerLat,
          zoom: 6,
        };
      } else {
        zoomToWhichState[stateName] = {
          longitude: centerLng,
          latitude: centerLat,
          zoom: Math.floor(viewport.zoom),
        };
      }
    });
  
    return zoomToWhichState;
  }