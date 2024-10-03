// @ts-nocheck
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import * as d3 from "d3";
import { Map } from "react-map-gl/maplibre";
// import { useMapContext } from "@/lib/context";
import { useMapStore } from "@/lib/store";
import DeckGL from "@deck.gl/react";
import {
  MapViewState,
  FlyToInterpolator,
  LightingEffect,
  AmbientLight,
  _SunLight as SunLight,
} from "@deck.gl/core";
import { GeoJsonLayer, PolygonLayer } from "@deck.gl/layers";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Tooltip from "@/components/ui/tooltip";
import stateData from "../../../public/us-states.json";

import USMapLayer from "./USMapLayer";
import { zoomToWhichCounty } from "@/lib/calculateStateViews";

// https://deck.gl/docs/api-reference/carto/basemap
const CARTO_BASEMAP =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

type DataType = {
  position: [longitude: number, latitude: number];
  message: string;
};

const tooltipStyle: React.CSSProperties = {
  position: "absolute",
  zIndex: 1,
  pointerEvents: "none",
  // backgroundColor: "transparent",
  // padding: "10px",
  // borderRadius: "5px",
  // boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
};
const defaultOpacity = 235;
function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}
const twoSigFigFormatter = d3.format(".2r");

const elevationScale = d3.scaleLinear().domain([-1, 1]).range([0, 2000]);

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 2.5,
});

const dirLight = new SunLight({
  timestamp: Date.UTC(2019, 7, 1, 22),
  color: [255, 255, 255],
  intensity: 0.5,
  // _shadow: true,
});

const DeckglMap = ({
  width = 975,
  height = 610,
  zoomToWhichState,
  zoomToWhichCounty,
  geographyData,
  colorVariable,
  xVariable,
  yVariable,
}) => {
  // // // // // // // // // // // // // // // // // //
  // // // // // // // // STATE // // // // // // // //
  // // // // // // // // // // // // // // // // // //

  const {
    selectedState,
    setSelectedState,
    colorScale,
    selectedCounties,
    updateSelectedCounties,
    selectedZoomCounty,
    setSelectedZoomCounty,
  } = useMapStore();
  const [effects] = useState(() => {
    const lightingEffect = new LightingEffect({ ambientLight, dirLight });
    lightingEffect.shadowColor = [0, 0, 0, 0];
    return [lightingEffect];
  });
  const [viewState, setViewState] = useState({
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
  const [hoverInfo, setHoverInfo] = useState<PickingInfo<DataType>>({});

  const mapRef = useRef(null);

  // // // // // // // // // // // // // // // // // //
  // // // // // // // // Callbacks // // // // // // // //
  // // // // // // // // // // // // // // // // // //
  const onHover = useCallback((info) => {
    setHoverInfo(info.object ? info : null);
  }, []);

  const onMouseLeave = useCallback(() => {
    setHoverInfo(null);
  }, []);

  // // // // // // // // // // // // // // // // // //
  // // // // // // // // Effects // // // // // // // //
  // // // // // // // // // // // // // // // // // //

  const onViewStateChange = useCallback(({ viewState: newViewState }) => {
    setViewState(newViewState);
  }, []);

  const flyToState = useCallback(
    (stateName) => {
      const newViewState = {
        ...zoomToWhichState[stateName],
        transitionInterpolator: new FlyToInterpolator({
          speed: 0.8,
          curve: 1,
        }),
        transitionDuration: "auto",
        transitionEasing: easeOutExpo,
        minZoom: 3.2,
        maxZoom: 10,
      };
      setViewState(newViewState);
    },
    [zoomToWhichState]
  );
  const flyToCounty = useCallback(
    (countyZoomProps) => {
      const newViewState = {
        ...countyZoomProps,
        transitionInterpolator: new FlyToInterpolator({
          speed: 0.8,
          curve: 1,
        }),
        transitionDuration: "auto",
        transitionEasing: easeOutExpo,
        minZoom: 3.2,
        maxZoom: 10,
      };
      setViewState(newViewState);
    },
    [zoomToWhichCounty]
  );
  useEffect(() => {
    if (selectedState.name === "US") {
      setViewState({
        longitude: -98,
        latitude: 39, // 39.8283
        zoom: 3.1,
        maxZoom: 6.2, // 4.2
        minZoom: 3.2,
        pitch: 0,
        bearing: 0,
        transitionInterpolator: new FlyToInterpolator({
          speed: 0.4,
          curve: 1.8,
        }),
        transitionDuration: "auto",
        transitionEasing: easeOutExpo,
      });
    } else {
      flyToState(selectedState.name);
    }

    updateSelectedCounties(
      geographyData.features
        .filter(
          (feature) => feature.properties.STATENAME === selectedState.name
        )
        .map((feature) => feature.properties.GEOID)
    );
  }, [
    selectedState,
    zoomToWhichState,
    zoomToWhichCounty,
    geographyData,
    flyToState,
    updateSelectedCounties,
  ]);

  useEffect(() => {
    if (zoomToWhichCounty[selectedZoomCounty.geoID]) {
      flyToCounty(zoomToWhichCounty[selectedZoomCounty.geoID]);
    }
  }, [selectedZoomCounty]);
  // enable color transition


  const layers = useMemo(
    () =>
      [
        new GeoJsonLayer({
          id: "county-layer",
          data: geographyData,
          getFillColor: (d) => {
            const { r, g, b } = d3.color(
              colorScale(d.properties[colorVariable])
            );

            const a =
              selectedCounties.length == 0
                ? defaultOpacity
                : selectedCounties.includes(d.properties.GEOID)
                ? defaultOpacity
                : 55;
            return [r, g, b, a];
          },

          wireframe: true,
          pickable: true,
          autoHighlight: false,
          stroked: true,
          getLineColor: [234, 234, 234, 200],
          // extruded: true,
          // getElevation: (f) => {
          //   // console.log(elevationScale(f.properties[colorVariable]));
          //   return elevationScale(f.properties[colorVariable]);
          // },
          // elevationScale: 100,
          getLineWidth: 1,
          lineWidthUnits: "pixels",
          lineWidthScale: 1,
          lineWidthMinPixels: 1,
          lineWidthMaxPixels: 100,
          transitions: {
            // getFillColor: 500,
            getLineColor: 500,
          },
          updateTriggers: {
            getFillColor: [selectedCounties, colorScale, colorVariable],
          },
          onClick: (info, event) => {
            setSelectedState({
              id: +info.object.properties.STATEFP,
              name: info.object.properties.STATENAME,
            });
            setSelectedZoomCounty({
              geoID: info.object.properties.GEOID,
              countyName: info.object.properties.NAME,
            });

            flyToCounty(zoomToWhichCounty[info.object.properties.GEOID]);
          },
        }),
        // highlight clicked county
        new GeoJsonLayer({
          id: "highlight-layer",
          data: geographyData.features.filter(
            (d) =>
              d.properties.GEOID.toString() ===
              selectedZoomCounty.geoID.toString()
          ),
          pickable: false,
          stroked: true,
          filled: true,
          getFillColor: [255, 255, 255, 100],
          getLineColor: [255, 255, 255, 255],
          getLineWidth: 6,
          lineWidthUnits: "pixels",
        }),
        // new GeoJsonLayer({
        //   id: "state-border-layer-white",
        //   data: stateData,
        //   // visible: selectedState.name === "US" ? true : false,
        //   filled: false,
        //   stroked: true,
        //   getLineColor: [0, 0, 0, 200],
        //   getLineWidth: 4,
        //   lineWidthUnits: "pixels",
        //   lineWidthScale: 1,
        //   // lineWidthMinPixels: 1,
        //   // lineWidthMaxPixels: 2,
        // }),
        new GeoJsonLayer({
          id: "state-border-layer-black",
          data: stateData,
          // visible: selectedState.name === "US" ? true : false,
          filled: false,
          stroked: true,
          getLineColor: [255, 255, 255, 200],
          getLineWidth: 2,
          lineWidthUnits: "pixels",
          lineWidthScale: 1,
          // lineWidthMinPixels: 1,
          // lineWidthMaxPixels: 2,
        }),
      ].filter(Boolean),
    [
      geographyData,
      selectedState,
      colorScale,
      alphaValues,
      selectedCounties,
      selectedZoomCounty,
    ]
  );

  const hoverLayer = useMemo(() => {
    if (!hoverInfo || !hoverInfo.object) return null;
    return new GeoJsonLayer({
      id: "hover-layer",
      data: [hoverInfo.object],
      pickable: false,
      stroked: true,
      filled: true,
      getFillColor: (d) => {
        const { r, g, b } = d3.color(colorScale(d.properties[colorVariable]));

        const a = 255;
        return [r, g, b, a];
      },
      lineWidthUnits: "pixels",
      lineWidthScale: 1,
      lineWidthMinPixels: 2,
      lineWidthMaxPixels: 10,
      getLineColor: [255, 255, 255, 255],
      getLineWidth: 2,
    });
  }, [hoverInfo]);

  return (
    <map
      ref={mapRef}
      style={{ width: "100%", height: "100%" }}
      onMouseLeave={onMouseLeave}
    >
      <DeckGL
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        controller={{ doubleClickZoom: false, touchRotate: true }}
        // effects={effects}
        layers={[...layers, hoverLayer].filter(Boolean)}
        onHover={onHover}
      >
        {hoverInfo && hoverInfo.object && (
          <Tooltip
            left={hoverInfo.x + 10}
            top={hoverInfo.y + 10}
            county={hoverInfo.object.properties.NAME}
            state={hoverInfo.object.properties.STATENAME}
            gap={twoSigFigFormatter(hoverInfo.object.properties[colorVariable])}
            worry={twoSigFigFormatter(hoverInfo.object.properties[yVariable])}
            rating={twoSigFigFormatter(hoverInfo.object.properties[xVariable])}
          />
        )}
        {/* <Map reuseMaps mapStyle={CARTO_BASEMAP} /> */}
      </DeckGL>
    </map>
  );
};

export default DeckglMap;
