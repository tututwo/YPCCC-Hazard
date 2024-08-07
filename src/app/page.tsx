"use client";
//@ts-nocheck
import Link from "next/link";
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

import { DataTableDemo } from "@/components/containers/Table";

import { useEffect, useState } from "react";
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

export default function Home() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState("Heat");
  const [selectedSubcategory, setSelectedSubcategory] = useState("Heat gap");
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 820);
  }, []);

  const expandCollapseLeft = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategory(
      expandedCategory === categoryName ? null : categoryName
    );
  };
  return (
    <>
      <Button variant={"outline"} onClick={expandCollapseLeft}>
        {" "}
        <svg
          role="graphics-symbol"
          viewBox="0 0 16 16"
          className={`size-[16px] transition-transform duration-300 ${
            isSideBarOpen ? "rotate-0" : "rotate-180"
          }`}
        >
          <path d="M7.07031 13.8887C7.2207 14.0391 7.40527 14.1211 7.62402 14.1211C8.06836 14.1211 8.41699 13.7725 8.41699 13.3281C8.41699 13.1094 8.32812 12.9043 8.17773 12.7539L3.37207 8.05762L8.17773 3.375C8.32812 3.21777 8.41699 3.0127 8.41699 2.80078C8.41699 2.35645 8.06836 2.00781 7.62402 2.00781C7.40527 2.00781 7.2207 2.08984 7.07031 2.24023L1.73828 7.44922C1.56055 7.62012 1.46484 7.8252 1.46484 8.06445C1.46484 8.29688 1.55371 8.49512 1.73828 8.67969L7.07031 13.8887ZM13.1748 13.8887C13.3252 14.0391 13.5098 14.1211 13.7354 14.1211C14.1797 14.1211 14.5283 13.7725 14.5283 13.3281C14.5283 13.1094 14.4395 12.9043 14.2891 12.7539L9.4834 8.05762L14.2891 3.375C14.4395 3.21777 14.5283 3.0127 14.5283 2.80078C14.5283 2.35645 14.1797 2.00781 13.7354 2.00781C13.5098 2.00781 13.3252 2.08984 13.1748 2.24023L7.84961 7.44922C7.66504 7.62012 7.57617 7.8252 7.56934 8.06445C7.56934 8.29688 7.66504 8.49512 7.84961 8.67969L13.1748 13.8887Z"></path>
        </svg>
      </Button>
    

      <main className="flex-grow min-h-screen flex flex-col desktop:flex-row desktop:flex-nowrap w-full border-4 m-4">
        {/* NOTE: This `flex-grow` here maintains the flex layout, eg. footer stays at the bottom, as overall height growing while the content grows on other parts */}
        <aside
          className={`flex-grow flex-shrink-0 p-3 flex flex-col min-h-0 bg-[#E2E2E2] w-full transition-all duration-300 ease-in-out ${
            isSideBarOpen ? "desktop:w-[268px]" : "desktop:w-0 overflow-hidden"
          } space-y-4`}
          id="side-bar"
        >
          <div className="w-[180px] pl-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="US" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="apple">US</SelectItem>
                  <SelectItem value="banana">Canada</SelectItem>
                  <SelectItem value="blueberry">UK</SelectItem>
                  <SelectItem value="grapes">China</SelectItem>
                  <SelectItem value="pineapple">India</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <h1 className="text-3xl font-bold px-4 py-2">
            Reality- Perception Gap
          </h1>

          <div className="flex-grow flex flex-col justify-between">
            <section className="mb-4 p-4 ">
              {categories.map((category, i) => (
                <div
                  key={category.name}
                  className="overflow-hidden "
                >
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className={`${
                      i === 0 ? "border-t-0" : "border-t-2"
                    } border-[lightgrey] w-full py-1 px-2 text-left font-thin flex justify-between items-center text-lg`}
                  >
                    <h3>{category.name}</h3>
                    <svg
                      className={`size-4 transition-transform duration-300 ${
                        expandedCategory === category.name ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      expandedCategory === category.name
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <ul className="py-1">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory} className="">
                          <button
                            onClick={() => setSelectedSubcategory(subcategory)}
                            className={`w-full text-left p-2 hover:cursor-pointer ${
                              selectedSubcategory === subcategory
                                ? "bg-[#B5B5B5]"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {subcategory}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </section>
            {isDesktop && <footer className="mt-auto">2024</footer>}
          </div>
        </aside>

        <section className="w-full desktop:flex-grow desktop:flex-shrink p-4 flex flex-col">
          {isDesktop && (
            <div className="legend mb-4">
              {" "}
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input type="email" placeholder="Address" />
                <Button type="submit">Search</Button>
              </div>
            </div>
          )}
          <div className="flex-grow" id="map-container">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              src="https://observablehq.com/embed/cadb3c4f5452d830?cells=viewof+selectedState%2Cmap"
            ></iframe>
          </div>
          <div className="mt-4" id="scatterplot-container">
            {/* D3.js scatterplot will be rendered here */}
          </div>
          {isDesktop && (
            <div className="annotation-section mt-4">
              {/* Annotation content */}
            </div>
          )}
        </section>

        {isDesktop && (
          <aside className="w-full desktop:w-[388px] flex-shrink-0 p-4">
            <Button
              asChild
              className="bg-slate-400 w-full min-h-[4rem] text-xl "
            >
              <Link href="/login">Explore Mode &gt;&nbsp;</Link>
            </Button>
            <div className="table-container">
              <DataTableDemo></DataTableDemo>
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
        )}
      </main>

      {!isDesktop && (
        <footer className="p-4">
          <button className="download-button w-full">Download data</button>
        </footer>
      )}
    </>
  );
}
