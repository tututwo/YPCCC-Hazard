// @ts-nocheck
// import * as turf from "@turf/turf";
// import { WebMercatorViewport } from "@deck.gl/core";
// export default function calculateStateViewsFromCounties(
//     countyGeoJSON: FeatureCollection,
//     width = 800, // Default width is 800
//     height = 600
//   ) {
//     const zoomToWhichState = {};
//     const stateFeatures = {};
  
//     // Group counties by state
//     countyGeoJSON.features.forEach((county: Feature<MultiPolygon>) => {
//       const stateName = county.properties?.STATENAME;
//       if (!stateFeatures[stateName]) {
//         stateFeatures[stateName] = [];
//       }
//       stateFeatures[stateName].push(county);
//     });
  
//     // Calculate view for each state
//     Object.entries(stateFeatures).forEach(([stateName, counties]) => {
//       // Combine all county polygons into a single multipolygon
  
//       let combined;
  
//       if (counties.length === 0) {
//         console.warn(`No counties found for state: ${stateName}`);
//         return;
//       } else if (counties.length === 1) {
//         combined = counties[0];
//       } else {
//         try {
//           combined = turf.union(turf.featureCollection(counties));
//           // combined = turf.union(...counties);
//         } catch (error) {
//           console.warn(`Error combining counties for ${stateName}:`, error);
//           combined = counties[0]; // Fallback to using the first county
//         }
//       }
  
//       const [minLng, minLat, maxLng, maxLat] = turf.bbox(combined);
  
//       const [centerLng, centerLat] =
//         turf.centerOfMass(combined).geometry.coordinates;
  
//       // Calculate zoom
//       const viewport = new WebMercatorViewport({ width, height }).fitBounds(
//         [
//           [minLng, minLat],
//           [maxLng, maxLat],
//         ],
//         {
//           padding: 20, // Add some padding
//         }
//       );
  
//       // Special case for state "a" (adjust as needed)
//       if (stateName === "a") {
//         zoomToWhichState[stateName] = {
//           longitude: centerLng,
//           latitude: centerLat,
//           zoom: 6,
//         };
//       } else {
//         zoomToWhichState[stateName] = {
//           longitude: centerLng,
//           latitude: centerLat,
//           zoom: Math.ceil(viewport.zoom)*.881,
//         };
//       }
//     });
  
//     return zoomToWhichState;
//   }
export const zoomToWhichState = ({
  "California": {
      "longitude": -119.43639008967415,
      "latitude": 37.240828796984,
      "zoom": 5.286
  },
  "Massachusetts": {
      "longitude": -71.558717416657,
      "latitude": 42.11674912104163,
      "zoom": 7.048
  },
  "Nebraska": {
      "longitude": -99.81026470446827,
      "latitude": 41.527192867835794,
      "zoom": 5.286
  },
  "North Carolina": {
      "longitude": -79.18180614599667,
      "latitude": 35.53869134217362,
      "zoom": 5.286
  },
  "Texas": {
      "longitude": -99.33232166791802,
      "latitude": 31.462004637640398,
      "zoom": 5.286
  },
  "Vermont": {
      "longitude": -72.66221354262254,
      "latitude": 44.07477920749605,
      "zoom": 7.048
  },
  "Virginia": {
      "longitude": -78.73443993987982,
      "latitude": 37.64750362869042,
      "zoom": 5.286
  },
  "Arkansas": {
      "longitude": -92.4378535727122,
      "latitude": 34.9000168358767,
      "zoom": 6.167
  },
  "Colorado": {
      "longitude": -105.54760157097506,
      "latitude": 38.99842146808117,
      "zoom": 6.167
  },
  "Idaho": {
      "longitude": -114.65872002858748,
      "latitude": 44.39033376040275,
      "zoom": 5.286
  },
  "Illinois": {
      "longitude": -89.1975231293055,
      "latitude": 40.06348262419128,
      "zoom": 5.286
  },
  "Iowa": {
      "longitude": -93.49896028582107,
      "latitude": 42.07491673124318,
      "zoom": 6.167
  },
  "Kentucky": {
      "longitude": -85.28901623577296,
      "latitude": 37.52594721472532,
      "zoom": 6.167
  },
  "Louisiana": {
      "longitude": -91.94549092317015,
      "latitude": 31.02017582419013,
      "zoom": 6.167
  },
  "South Dakota": {
      "longitude": -100.23070687186568,
      "latitude": 44.43594679131874,
      "zoom": 6.167
  },
  "Indiana": {
      "longitude": -86.27500653277292,
      "latitude": 39.907819554426325,
      "zoom": 6.167
  },
  "Missouri": {
      "longitude": -92.47789057466616,
      "latitude": 38.36847074187306,
      "zoom": 6.167
  },
  "Minnesota": {
      "longitude": -94.30636291666507,
      "latitude": 46.31809575340072,
      "zoom": 5.286
  },
  "Georgia": {
      "longitude": -83.44336055489997,
      "latitude": 32.64809469528399,
      "zoom": 6.167
  },
  "South Carolina": {
      "longitude": -80.89516676099883,
      "latitude": 33.908048138493534,
      "zoom": 6.167
  },
  "Kansas": {
      "longitude": -98.3789074528939,
      "latitude": 38.4851524370905,
      "zoom": 6.167
  },
  "North Dakota": {
      "longitude": -100.4688071885217,
      "latitude": 47.44631791756397,
      "zoom": 6.167
  },
  "Oklahoma": {
      "longitude": -97.50896502398231,
      "latitude": 35.5843023028522,
      "zoom": 5.286
  },
  "Pennsylvania": {
      "longitude": -77.79954366352734,
      "latitude": 40.87415767341304,
      "zoom": 6.167
  },
  "Wisconsin": {
      "longitude": -89.92157651801193,
      "latitude": 44.708738813861565,
      "zoom": 6.167
  },
  "New Mexico": {
      "longitude": -106.10836174781213,
      "latitude": 34.4214147314476,
      "zoom": 6.167
  },
  "Michigan": {
      "longitude": -86.20194355433627,
      "latitude": 44.80059931410808,
      "zoom": 5.286
  },
  "Florida": {
      "longitude": -83.16414753215253,
      "latitude": 28.290678354904635,
      "zoom": 5.286
  },
  "Mississippi": {
      "longitude": -89.6621633573408,
      "latitude": 32.7509547372423,
      "zoom": 6.167
  },
  "New York": {
      "longitude": -75.39549710560222,
      "latitude": 42.65729259274356,
      "zoom": 6.167
  },
  "Tennessee": {
      "longitude": -86.34063938501421,
      "latitude": 35.84331836057118,
      "zoom": 5.286
  },
  "District of Columbia": {
      "longitude": -77.01655991980581,
      "latitude": 38.904177732242196,
      "zoom": 9.691
  },
  "Ohio": {
      "longitude": -82.74963525331053,
      "latitude": 40.33374917137419,
      "zoom": 6.167
  },
  "New Hampshire": {
      "longitude": -71.5766997189612,
      "latitude": 43.68569304413405,
      "zoom": 6.167
  },
  "Alabama": {
      "longitude": -86.82838502756172,
      "latitude": 32.788880800058465,
      "zoom": 6.167
  },
  "Rhode Island": {
      "longitude": -71.52609995487757,
      "latitude": 41.603528277275345,
      "zoom": 7.929
  },
  "New Jersey": {
      "longitude": -74.66084347740109,
      "latitude": 40.18497376874466,
      "zoom": 7.048
  },
  "Utah": {
      "longitude": -111.67806409191992,
      "latitude": 39.32378058839308,
      "zoom": 6.167
  },
  "Oregon": {
      "longitude": -120.55673863751603,
      "latitude": 43.9369256509795,
      "zoom": 5.286
  },
  "West Virginia": {
      "longitude": -80.6116380173951,
      "latitude": 38.64411219846801,
      "zoom": 6.167
  },
  "Maryland": {
      "longitude": -77.02486166866339,
      "latitude": 38.99520657567666,
      "zoom": 6.167
  },
  "Wyoming": {
      "longitude": -107.55124218434908,
      "latitude": 42.999632319701426,
      "zoom": 6.167
  },
  "Washington": {
      "longitude": -120.64133978845042,
      "latitude": 47.377486808443265,
      "zoom": 6.167
  },
  "Montana": {
      "longitude": -109.64303342482792,
      "latitude": 47.03433222159732,
      "zoom": 5.286
  },
  "Delaware": {
      "longitude": -75.50094869768837,
      "latitude": 39.00062819033293,
      "zoom": 7.048
  },
  "Arizona": {
      "longitude": -111.66448247623985,
      "latitude": 34.2928280104603,
      "zoom": 6.167
  },
  "Nevada": {
      "longitude": -116.65525091726106,
      "latitude": 39.35629768681844,
      "zoom": 5.286
  },
  "Maine": {
      "longitude": -69.17579586466026,
      "latitude": 45.297309809167224,
      "zoom": 6.167
  },
  "Connecticut": {
      "longitude": -72.72688892809965,
      "latitude": 41.61872535726553,
      "zoom": 7.929
  }
})