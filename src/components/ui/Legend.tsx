import React from "react";

const ColorLegend = ({ onSelectColor, width, height }) => {
  const colors = [
    { value: 1.0, color: "#b91c1c" },
    { value: 0.8, color: "#dc2626" },
    { value: 0.6, color: "#ef4444" },
    { value: 0.4, color: "#f87171" },
    { value: 0.2, color: "#fca5a5" },
    { value: 0.0, color: "#fecaca" },
    { value: -0.2, color: "#9ca3af" },
    { value: -0.4, color: "#6b7280" },
    { value: -0.6, color: "#4b5563" },
    { value: -0.8, color: "#374151" },
    { value: -1.0, color: "none" },
  ];

  const containerHeight = colors.length * 24 + (colors.length - 1) * 2; // 24px for each color bar, 2px for gaps

  return (
    <div className="inline-flex flex-col items-start w-full h-full">
      <div className="flex items-start mb-2">
        <div className="flex flex-col items-end mr-1">
          {colors.map((color, index) => (
            <div key={index} className="flex items-start">
              <span className="text-xs text-gray-500 mr-1 translate-y-[-50%]">
                {color.value.toFixed(1)}
              </span>
              <button
                className="w-6 h-6 mb-[2px] cursor-pointer transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{ backgroundColor: color.color }}
                onClick={() => onSelectColor(color.value)}
                aria-label={`Select color for value ${color.value}`}
              />
            </div>
          ))}
        </div>
        <div
          className="flex flex-col justify-between text-xs text-gray-500 relative"
          style={{ height: `${containerHeight}px` }}
        >
          <div className="flex items-center flex-col">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
              />
            </svg>
            <span
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
              className="inline-block"
            >
              Bigger gap
            </span>
          </div>
          <div className="w-4 h-px bg-gray-300 absolute "  style={{ top: `${containerHeight/2}px` }}/>
          <div className="flex items-center  flex-col">
            <span
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
              className="inline-block"
            >
              Smaller gap
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
              />
            </svg>
          </div>
        </div>
      </div>
      <span className="text-xs text-gray-600 mt-1 self-center">
        Select to highlight a group
      </span>
    </div>
  );
};

export default ColorLegend;
