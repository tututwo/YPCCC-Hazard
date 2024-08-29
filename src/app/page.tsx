//@ts-nocheck
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import counties from "../../public/finalGEOJSON.json";
// NOTE: UI library
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import DataTableDemo from "@/components/containers/Table";

// NOTE: Utility library
import { csv } from "d3-fetch";
import * as d3 from "d3";
import {
  useEffect,
  useState,
  createContext,
  useContext,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import * as turf from "@turf/turf";
import { WebMercatorViewport } from "@deck.gl/core";
import calculateStateViewsFromCounties from "@/lib/calculateStateViews";

import { useParentSize, ParentSize } from "@visx/responsive";
// NOTE: Custom UI Components
import Scatterplot from "@/components/containers/Scatterplot";
import Map from "@/components/containers/Map";
import DeckglMap from "@/components/containers/DeckglMap";
import Legend from "@/components/ui/Legend";
import { MapProvider } from "@/lib/context";
import StateButton from "@/components/ui/StateButton";
import ExpandableSection from "@/components/containers/ExpandableSection";
import ExpandButton from "@/components/ui/expandButton";

// NOTE: Styles
import "../styles/InputButton.css";

const xVariable = "xValue";
const yVariable = "yValue";
const colorVariable = "gap";

const categories = [
  {
    name: "Heat",
    subcategories: ["Heat gap", "Heat health score", "Heat", "Sensitivity"],
  },
  { name: "Fire", subcategories: ["Subcategory 1", "Subcategory 2"] },
  { name: "Storm", subcategories: ["Subcategory 1", "Subcategory 2"] },
  { name: "Flood", subcategories: ["Subcategory 1", "Subcategory 2"] },
  { name: "Drought", subcategories: ["Subcategory 1", "Subcategory 2"] },
];
gsap.registerPlugin(useGSAP);

// NOTE: zoom-to-state metrics

const DynamicCalculateStateViews = dynamic(
  () =>
    import("@/lib/calculateStateViews").then(
      (mod) => mod.calculateStateViewsFromCounties
    ),
  { ssr: false }
);
export default function Home() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [data, setData] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoomToWhichState, setZoomToWhichState] = useState({});
  const { parentRef, width, height } = useParentSize();

  useEffect(() => {
    if (width > 0 && height > 0) {
      const result = calculateStateViewsFromCounties(counties, width, height);
      setZoomToWhichState(result);
    }
  }, [width, height]);

  const handleMouseEnter = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsExpanded(false);
  }, []);
  useEffect(() => {
    csv("/data.csv").then((loadedData) => {
      loadedData.forEach((d) => {
        d[xVariable] = +d[xVariable];
        d[yVariable] = +d[yVariable];
      });
      setData(loadedData);
    });
  }, []);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 820);
  }, []);

  return (
    <>
      <Input
        id="sidebar-toggle"
        type="checkbox"
        title="Toggle sidebar"
        onClick={handleMouseEnter}
        overrideClassName
        className="z-50"
      />
      <ExpandableSection
        isExpanded={isExpanded}
        isDesktop={isDesktop}
        categories={categories}
      ></ExpandableSection>
      <MapProvider>
        <header className="w-full bg-[#D2E4F6] mb-12">
          <div className=" max-w-sm items-center space-x-2 ">
            {" "}
            <StateButton />
          </div>
        </header>
        <main className="flex-grow h-screen flex flex-col desktop:flex-nowrap w-full  relative  ">
          {/* NOTE: This `flex-grow` here maintains the flex layout, eg. footer stays at the bottom, as overall height growing while the content grows on other parts */}
          {/* NOTE:Map Section */}
          <section
            className="w-full min-h-[700px] desktop:flex-grow desktop:flex-shrink   pb-6 flex flex-row gap-10"
            onMouseEnter={handleMouseLeave}
          >
            {/* NOTE:Actual Map */}
            <figure
              ref={parentRef}
              className="flex-grow h-full relative z-10 overflow-hidden "
            >
              <DeckglMap
                width={width}
                height={height}
                zoomToWhichState={zoomToWhichState}
                geographyData={counties}
                colorVariable={colorVariable}
              />
            </figure>

            {/*NOTE: Legend */}
            {isDesktop && (
              <div className="legend mb-4 desktop:w-[144px]">
                <ParentSize>
                  {({ width, height }) => (
                    <Legend width={width} height={height} />
                  )}
                </ParentSize>
              </div>
            )}
          </section>

          {/* Table + Plots Section */}

          <section className=" desktop:min-h-[600px] w-full flex flex-row gap-10">
            {/* NOTE: Scatterplot */}
            <div className="mt-4 flex-grow" id="scatterplot-container">
              <h2 className="text-lg font-bold ml-8">
                Heat worry and Heat rating of all counties
              </h2>
              <figure className="w-full h-full ">
                <ParentSize>
                  {({ width, height, top, left }) => {
                    return (
                      <Scatterplot
                        data={data}
                        width={width}
                        height={height}
                        xVariable={xVariable}
                        yVariable={yVariable}
                        colorVariable={colorVariable}
                      ></Scatterplot>
                    );
                  }}
                </ParentSize>
              </figure>
            </div>

            <aside className="w-full desktop:w-1/3 flex-shrink-0 pr-1 flex flex-col">
              <div className="mt-4 mb-1 ">
                <b className="text-xl">3143 Counties</b> in the US
              </div>
              <div className="table-container grow overflow-hidden">
                <ParentSize>
                  {({ width, height }) => {
                    return (
                      <DataTableDemo
                        data={data}
                        height={height}
                        xVariable={xVariable}
                        yVariable={yVariable}
                        colorVariable={colorVariable}
                      ></DataTableDemo>
                    );
                  }}
                </ParentSize>
              </div>

              <Button variant={"ghost"} className="w-full flex text-lg">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  className="scale-150"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
                &nbsp;&nbsp;Download Data
              </Button>
            </aside>
          </section>
        </main>

        {!isDesktop && (
          <footer className="p-4">
            <button className="download-button w-full">Download data</button>
          </footer>
        )}
      </MapProvider>
    </>
  );
}
