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
  // createContext,
  // useContext,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import * as turf from "@turf/turf";
// import { WebMercatorViewport } from "@deck.gl/core";
// import calculateStateViewsFromCounties from "@/lib/calculateStateViews";
import { zoomToWhichState, zoomToWhichCounty } from "@/lib/calculateStateViews";
import { useParentSize, ParentSize } from "@visx/responsive";
// NOTE: Custom UI Components
import { Scatterplot } from "@/components/containers/Scatterplot";
import Map from "@/components/containers/Map";
import DeckglMap from "@/components/containers/DeckglMap";
import Legend from "@/components/ui/Legend";
import LegendResponsive from "@/components/ui/LegendResponsive";
import ExpandableSection from "@/components/containers/ExpandableSection";
import ExpandButton from "@/components/ui/expandButton";

import DownloadButton from "@/components/containers/DownloadButton";
import { HeatGapHeader } from "@/components/containers/Header";
import { LoadingComponent } from "@/components/containers/LoadingComponent";
// NOTE: Styles
import "../styles/InputButton.css";
import { useMapStore } from "@/lib/store";
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
const colors = [
  { value: 1.0, color: "#B11B42" },
  { value: 0.8, color: "#DE3C47" },
  { value: 0.6, color: "#F36F5F" },
  { value: 0.4, color: "#FD9F8C" },
  { value: 0.2, color: "#FFCEC8" },
  { value: 0.0, color: "#D9D9D9" },
  { value: -0.2, color: "#B4B8B8" },
  { value: -0.4, color: "#8F979B" },
  { value: -0.6, color: "#6D7881" },
  { value: -0.8, color: "#505965" },
  { value: -1.0, color: "none" },
];
gsap.registerPlugin(useGSAP);

// NOTE: zoom-to-state metrics

// const DynamicCalculateStateViews = dynamic(
//   () =>
//     import("@/lib/calculateStateViews").then(
//       (mod) => mod.calculateStateViewsFromCounties
//     ),
//   { ssr: false }
// );
export default function Home() {
  const { data, filteredData, isDataLoaded } = useMapStore();

  const [isDesktop, setIsDesktop] = useState(false);
  // const [data, setData] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // NOTE: Parent size for the deckgl map
  const { parentRef, width, height } = useParentSize();

  const handleMouseEnter = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsExpanded(false);
  }, []);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 820);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {false ? (
        <LoadingComponent />
      ) : (
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

          <header className="w-full bg-[#D2E4F6] mb-4">
            <HeatGapHeader />
          </header>
          <main className="flex-grow desktop:h-[900px] flex flex-col desktop:flex-nowrap w-full  relative pr-10 pl-6 ">
            {/* IMPORTANT: This `flex-grow` here maintains the flex layout, eg. footer stays at the bottom, as overall height growing while the content grows on other parts */}
            {/* NOTE:Map Section */}
            <section
              className="w-full min-h-[400px] max-h-[600px] desktop:flex-grow desktop:flex-shrink flex flex-col desktop:flex-row gap-4"
              onMouseEnter={handleMouseLeave}
            >
              {/* NOTE:Actual Map */}
              <figure
                ref={parentRef}
                className="flex-grow h-full relative z-10 "
              >
                <DeckglMap
                  width={width}
                  height={height}
                  zoomToWhichState={zoomToWhichState}
                  zoomToWhichCounty={zoomToWhichCounty}
                  geographyData={counties}
                  colorVariable={colorVariable}
                  xVariable={xVariable}
                  yVariable={yVariable}
                />
              </figure>

              {/*NOTE: Legend */}
              {isDesktop && (
                <div className="legend desktop:w-[144px]">
                  <ParentSize>
                    {({ width, height }) => (
                      <LegendResponsive
                        colors={colors}
                        data={data}
                        colorVariable={colorVariable}
                        width={width}
                        height={height}
                      />
                    )}
                  </ParentSize>
                </div>
              )}
            </section>

            {/* Table + Plots Section */}

            <section className="min-h-[400px] w-full flex-grow flex flex-col desktop:flex-row gap-2">
              {/* NOTE: Scatterplot */}
              <div
                className="mt-4 flex-grow flex flex-col h-[400px] desktop:h-auto"
                id="scatterplot-container"
              >
                <h2 className="text-lg font-bold ml-8">
                  Heat worry and Heat rating of all counties
                </h2>
                <figure className="w-full flex-grow">
                  <ParentSize>
                    {({ width, height, top, left }) => {
                      return (
                        <Scatterplot
                          data={filteredData}
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

              <aside className="w-full desktop:w-2/5 flex-shrink-0 pr-1 flex flex-col">
                <div className="table-container grow overflow-hidden max-h-[800px]">
                  <ParentSize>
                    {({ width, height }) => {
                      return (
                        <DataTableDemo
                          data={data.slice(0,30)}
                          height={height}
                          xVariable={xVariable}
                          yVariable={yVariable}
                          colorVariable={colorVariable}
                        ></DataTableDemo>
                      );
                    }}
                  </ParentSize>
                </div>

                <DownloadButton />
              </aside>
            </section>
          </main>
        </>
      )}
    </>
  );
}
