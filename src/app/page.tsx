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
import Legend from "@/components/containers/ui-container/Legend";
import { MapProvider } from "@/lib/context";
import StateButton from "@/components/containers/ui-container/StateButton";
import ExpandableSection from "@/components/containers/ExpandableSection";
import ExpandButton from "@/components/ui/expandButton";

// NOTE: Styles
import "../styles/InputButton.css";

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

const colorScale = d3
  .scaleLinear<string>()
  .domain([-1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1])
  .range([
    "#374151",
    "#4b5563",
    "#6b7280",
    "#9ca3af",
    "#fecaca",
    "#fca5a5",
    "#f87171",
    "#ef4444",
    "#dc2626",
    "#b91c1c",
  ])
  .interpolate(d3.interpolateRgb);

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
    csv(
      "https://raw.githubusercontent.com/tututwo/YPCCC-Hazard-Tool/main/public/data.csv"
    ).then((loadedData) => {
      loadedData.forEach((d) => {
        d.L_cc_heatscore = +d.L_cc_heatscore;
        d.R_heat_worry = +d.R_heat_worry;
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
      <MapProvider>
        <main className="flex-grow h-screen flex flex-col desktop:flex-row desktop:flex-nowrap w-full  relative overflow-hidden ">
          <ExpandableSection
            isExpanded={isExpanded}
            isDesktop={isDesktop}
            categories={categories}
          ></ExpandableSection>
          {/* NOTE: This `flex-grow` here maintains the flex layout, eg. footer stays at the bottom, as overall height growing while the content grows on other parts */}

          <section
            className="w-full desktop:flex-grow desktop:flex-shrink pl-6 pr-4 pb-6 flex flex-col "
            onMouseEnter={handleMouseLeave}
          >
            {isDesktop && (
              <div className="legend mb-4 min-w-[240px]">
                {" "}
                <div className="flex w-full max-w-sm items-center space-x-2 ">
                  <StateButton />
                  {/* <Input type="email" placeholder="Address" />
                <Button type="submit">Search</Button> */}
                </div>
              </div>
            )}
            <div
              className="grow-[2] max-h-[70vh] flex flex-col desktop:flex-row"
              id="map-container"
            >
              <section
                ref={parentRef}
                className="flex-grow h-full md:order-2 relative z-10"
              >
                <DeckglMap
                  width={width}
                  height={height}
                  zoomToWhichState={zoomToWhichState}
                  geographyData={counties}
                  colorScale={colorScale}
                />
              </section>

              {/* <section className="flex-grow md:order-2 relative z-10 ">
                <Map width={1200} height={500} />
                <DeckglMap width={1200} height={500} />
              </section> */}
              {/* <section className="h-64 md:h-auto desktop:w-[100px] md:order-1">
                <Legend></Legend>
              </section> */}
            </div>

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
                      ></Scatterplot>
                    );
                  }}
                </ParentSize>
              </figure>
            </div>
            {isDesktop && (
              <div className="annotation-section mt-4">
                {/* Annotation content */}
              </div>
            )}
          </section>

          {isDesktop ? (
            <aside className="w-full desktop:w-1/3 flex-shrink-0 pr-1 flex flex-col">
              <Button
                asChild
                className="bg-[#E8E8E8] w-full min-h-[4rem] text-xl rounded-none text-slate-950 font-bold"
              >
                <Link href="/login">Explore Mode &gt;&nbsp;</Link>
              </Button>
              <div className="mt-4 mb-1 ">
                <b className="text-xl">3143 Counties</b> in the US
              </div>
              <div className="table-container grow overflow-hidden">
                <ParentSize>
                  {({ width, height }) => {
                    return <DataTableDemo
                      data={data}
                      colorScale={colorScale}
                      height={height}
                    ></DataTableDemo>;
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
          ) : (
            <div className="table-container">
              <DataTableDemo data={data}></DataTableDemo>
            </div>
          )}
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
