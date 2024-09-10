import React, { useMemo } from "react";
import { useMapStore } from "@/lib/store";

const Tooltip = ({ left, top, county, state, gap, worry, rating }) => {
  const { colorScale } = useMapStore();

  // Memoize the styles to avoid creating new objects on each render
  const tooltipStyle = useMemo(() => ({
    left: left,
    top: top,
    boxShadow: "#B5B5B5 1.5px 1.5px",
  }), [left, top]);

  // Memoize the color style for the gap div
  const gapStyle = useMemo(() => ({
    backgroundColor: colorScale(gap),
  }), [colorScale, gap]);

  return (
    <div style={tooltipStyle} className="absolute desktop:min-w-[350px] z-[1000] pointer-events-none max-w-md min-w-[200px] bg-white rounded-sm overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] px-2 border-2 border-[#B5B5B5]">
      <div className="px-4 py-2 border-b border-gray-200 ">
        <h2 className="text-base font-bold text-gray-800 text-center">
          {county}, {state}
        </h2>
      </div>
      <div className="px-4 py-2">
        <div className="flex justify-between">
          <div className="text-center">
            <p className="text-sm text-gray-600">Gap</p>
            <div className="mt-1">
              <div className="h-6 w-16" style={gapStyle}>
                <p className="text-white font-bold leading-6">{gap}</p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Worry</p>
            <p className="text-xl font-bold">{worry}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Rating</p>
            <p className="text-xl font-bold">{rating}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize the entire component to prevent unnecessary re-renders
export default React.memo(Tooltip);
