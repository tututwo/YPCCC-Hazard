"use client";
//@ts-nocheck
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
  // NOTE: State
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState("Heat");
  const [selectedSubcategory, setSelectedSubcategory] = useState("Heat gap");
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
    
      <Button variant={"outline"}>
        {" "}
        <svg
          role="graphics-symbol"
          viewBox="0 0 16 16"
          className={`size-[16px] transition-transform duration-300 ${
            isSideBarOpen ? "rotate-0" : "rotate-180"
          }`}
          onClick={expandCollapseLeft}
        >
          <path d="M7.07031 13.8887C7.2207 14.0391 7.40527 14.1211 7.62402 14.1211C8.06836 14.1211 8.41699 13.7725 8.41699 13.3281C8.41699 13.1094 8.32812 12.9043 8.17773 12.7539L3.37207 8.05762L8.17773 3.375C8.32812 3.21777 8.41699 3.0127 8.41699 2.80078C8.41699 2.35645 8.06836 2.00781 7.62402 2.00781C7.40527 2.00781 7.2207 2.08984 7.07031 2.24023L1.73828 7.44922C1.56055 7.62012 1.46484 7.8252 1.46484 8.06445C1.46484 8.29688 1.55371 8.49512 1.73828 8.67969L7.07031 13.8887ZM13.1748 13.8887C13.3252 14.0391 13.5098 14.1211 13.7354 14.1211C14.1797 14.1211 14.5283 13.7725 14.5283 13.3281C14.5283 13.1094 14.4395 12.9043 14.2891 12.7539L9.4834 8.05762L14.2891 3.375C14.4395 3.21777 14.5283 3.0127 14.5283 2.80078C14.5283 2.35645 14.1797 2.00781 13.7354 2.00781C13.5098 2.00781 13.3252 2.08984 13.1748 2.24023L7.84961 7.44922C7.66504 7.62012 7.57617 7.8252 7.56934 8.06445C7.56934 8.29688 7.66504 8.49512 7.84961 8.67969L13.1748 13.8887Z"></path>
        </svg>
      </Button>

      <main className="container mx-auto p-4 flex flex-col lg:flex-row gap-4">
        <aside
          className={`transition-all duration-300 ease-in-out ${
            isSideBarOpen ? "lg:w-1/4" : "lg:w-0 overflow-hidden"
          } space-y-4 `}
          id="side-bar"
        >
          <section className="bg-gray-100 p-4 rounded">
            {/* <h2 className="sr-only">Navigation</h2> */}

            <nav>Country Selector</nav>
          </section>
          <section className="bg-gray-100 p-4 rounded h-96">
            <nav>
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="bg-gray-100 rounded-lg overflow-hidden mb-2"
                >
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full p-4 text-left font-semibold flex justify-between items-center"
                  >
                    <h3>{category.name}</h3>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
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
                    <ul className="p-4">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory} className="py-1">
                          <button
                            onClick={() => setSelectedSubcategory(subcategory)}
                            className={`w-full text-left p-2 rounded ${
                              selectedSubcategory === subcategory
                                ? "bg-gray-200"
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
            </nav>
          </section>
        </aside>

        <div className="lg:w-1/2 space-y-4">
          <section className="bg-gray-100 p-4 rounded h-96">
            <h2 className="text-lg font-semibold mb-2">Main Visualization</h2>
          </section>
          <div className="flex gap-4">
            <section className="bg-gray-100 p-4 rounded flex-1 h-48">
              <h2 className="text-lg font-semibold mb-2">Chart 1</h2>
            </section>
            <section className="bg-gray-100 p-4 rounded flex-1 h-48">
              <h2 className="text-lg font-semibold mb-2">Chart 2</h2>
            </section>
          </div>
        </div>

        <aside className="lg:w-1/4 space-y-4">
          <section className="bg-gray-100 p-4 rounded h-64">
            <h2 className="text-lg font-semibold mb-2">Data Details</h2>
          </section>
          <section className="bg-gray-100 p-4 rounded h-64">
            <h2 className="text-lg font-semibold mb-2">Additional Info</h2>
          </section>
        </aside>
      </main>
    </>
  );
}
