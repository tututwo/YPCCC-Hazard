import React from "react";
import { useMapStore } from "@/lib/store";
const ColorLegend = ({ colors, data, width, height, colorVariable }) => {
  const { updateSelectedCounties, setSelectedState } = useMapStore();
  return (
    <div className="flex flex-col justify-around w-full h-full">
      <div className="text-xs text-gray-600 mt-1 mb-4 self-center">
        Select to highlight
      </div>
      <div className="flex-grow flex gap-2">
        {/* GAP text */}
        <div className="flex flex-col justify-between text-base text-gray-500 relative font-bold">
          <div className="flex items-center flex-col">
            <span className="inline-block text-right" style={{color: colors[0].color}}>Bigger gap</span>
          </div>
          <div className="w-8 h-px bg-gray-900  text-right"></div>
          <div className="flex items-center  flex-col text-right">
            <span className="inline-block" style={{color: colors[colors.length - 1].color}}>Smaller gap</span>
          </div>
        </div>
        {/* Color Bars */}
        {/* IMPORTANT: gap-2 to control the gap between color bars */}
        <div className=" flex flex-col items-start mr-1 gap-2">
          {colors.slice(0, 10).map((color, index) => (
            <div key={index} className="h-[10%] flex items-start  gap-2">
              {/* IMPORTANT: aspect-square h-full makes the color bar square */}
              <button
                className="mb-[2px] cursor-pointer transition-opacity hover:opacity-80 focus:outline-none focus:ring-4 focus:ring-offset-2  aspect-square h-full"
                style={{
                  backgroundColor: color.color,
                  "--tw-ring-color": color.color
                }}
                onClick={() => {
                  const filteredDataID = data
                    .filter((d) => {
                    
                      return (
                        +d[colorVariable] <= +color.value &&
                        +d[colorVariable] >= +color.value - 0.2
                      );
                    })
                    .map((d) => d.geoid);
                //   console.log(filteredDataID);
                  updateSelectedCounties(filteredDataID);
                  // setSelectedState({id: 0, name: "US"})
                }}
                aria-label={`Select color for value ${color.value}`}
              />
              <span className="text-xs font-bold text-gray-500 mr-1 translate-y-[-50%]">
                {color.value.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorLegend;
