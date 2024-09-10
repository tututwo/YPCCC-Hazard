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
import { MapViewState, FlyToInterpolator } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Tooltip from "@/components/ui/tooltip";
import stateData from "../../../public/us-states.json";

import USMapLayer from "./USMapLayer";
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

const DeckglMap = ({
  width = 975,
  height = 610,
  zoomToWhichState,
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
    colorScale,
    selectedCounties,
    updateSelectedCounties,
  } = useMapStore();

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
          speed: 0.4,
          curve: 1.8,
        }),
        transitionDuration: "auto",
        transitionEasing: easeOutExpo,
      };
      setViewState(newViewState);
    },
    [zoomToWhichState]
  );

  useEffect(() => {
    if (selectedState.name === "US") {
      setViewState({
        longitude: -98.,
        latitude: 39., // 39.8283
        zoom: 3.1,
        maxZoom: 4.2,
        minZoom: 2.5,
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
    geographyData,
    flyToState,
    updateSelectedCounties,
  ]);

  // enable color transition
  // useGSAP(
  //   () => {
  //     const targetAlphas = {};
  //     geographyData.features.forEach((feature) => {
  //       targetAlphas[feature.properties.STATENAME] =
  //         selectedState.name === "US" ||
  //         feature.properties.STATENAME === selectedState.name
  //           ? 250
  //           : 80;
  //     });

  //     gsap.to(alphaValues, {
  //       ...targetAlphas,
  //       duration: 0.88,
  //       ease: "power2.inOut",
  //       onUpdate: () => setAlphaValues({ ...alphaValues }),
  //     });
  //   },
  //   { dependencies: [selectedState, geographyData] }
  // );
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
          pickable: true,
          autoHighlight: false,
          getLineColor: [255, 255, 255, 200],
          getLineWidth: 0,
          lineWidthUnits: "pixels",
          lineWidthScale: 1,
          // lineWidthMinPixels: 1,
          // lineWidthMaxPixels: 1,
          transitions: {
            // getFillColor: 500,
            getLineColor: 500,
          },
          updateTriggers: {
            getFillColor: [selectedCounties, colorScale, colorVariable],
          },
        }),

        new GeoJsonLayer({
          id: "state-border-layer-white",
          data: stateData,
          visible: selectedState.name === "US" ? true : false,
          filled: false,
          stroked: true,
          getLineColor: [0, 0, 0, 200],
          getLineWidth: 4,
          lineWidthUnits: "pixels",
          lineWidthScale: 1,
          // lineWidthMinPixels: 1,
          // lineWidthMaxPixels: 2,
        }),
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
    [geographyData, selectedState, colorScale, alphaValues, selectedCounties]
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
        controller={true}
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
