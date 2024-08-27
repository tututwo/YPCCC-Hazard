// @ts-nocheck
"use client";
import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function ExpandableSection({
  isExpanded,
  isDesktop,
  categories,
}) {
  const [expandedCategory, setExpandedCategory] = useState("Heat");
  const [selectedSubcategory, setSelectedSubcategory] = useState("Heat gap");
  const buttonRefs = useRef([]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef(null);
  const toggleCategory = (categoryName) => {
    setExpandedCategory(
      expandedCategory === categoryName ? null : categoryName
    );
  };
  const handleSubcategoryClick = (subcategory, index) => {
    setSelectedSubcategory(subcategory);
    setSelectedIndex(index);
  };
  return (
    <>
      {/* Expandable section */}
      <nav
        aria-label="Sidebar"
        className={`
            overflow-hidden
            absolute
          
         order-1 flex-grow-0 flex-shrink-0
       border-gray-200
       text-white
     z-[111] 
        w-60 h-full transition-all duration-[800] ease-in-out
        space-y-4
         px-4 flex flex-col
        ${
          isExpanded
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        }
      `}
        aria-hidden={!isExpanded}
      >
        <div id="sidebar-background"></div>

        <div className="w-full">
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

        <h1 className="text-xl py-2">Reality- Perception Gap</h1>

        {isDesktop && (
          <>
            <div
              className="flex-grow flex flex-col justify-between"
              id="sidebar-content"
            >
              <section className="mb-4">
                {categories.map((category, i) => (
                  <div key={category.name} className="overflow-hidden ">
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className={`${
                        i === 0 ? "border-t-0" : "border-t-[1px]"
                      }  border-[#3C5A77] w-full py-1 px-2 text-left font-thin flex justify-between items-center text-sm`}
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
                      <ul ref={listRef} className="relative py-1">
                        <li
                          className="absolute left-0 w-full bg-[#415F7B] transition-transform duration-300 ease-in-out"
                          style={{
                            transform: `translateY(calc(${selectedIndex} * 40px + 0px))`,
                            height: "40px",
                          }}
                        />

                        {category.subcategories.map((subcategory, index) => (
                          <li key={subcategory} className="relative">
                            <button
                              onClick={() =>
                                handleSubcategoryClick(subcategory, index)
                              }
                              className={`w-full text-left text-xs p-2 whitespace-pre hover:cursor-pointer relative z-10 ${
                                selectedSubcategory === subcategory
                                  ? "text-white"
                                  : "hover:bg-[#415f7b55]"
                              }`}
                            >
                              {"    " + subcategory}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </section>
              <footer className="mt-auto">2024</footer>
            </div>
          </>
        )}
      </nav>
    </>
  );
}
