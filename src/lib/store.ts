import { create } from 'zustand';
import { scaleThreshold } from "d3-scale";

interface MapState {
  selectedState: { id: number; name: string };
  selectedCounties: string[];
  colorScale: (value: number) => string;
  setSelectedState: (state: { id: number; name: string }) => void;
  updateSelectedCounties: (counties: string[]) => void;
}

const redColors = ["#b91c1c", "#dc2626", "#ef4444", "#f87171", "#fca5a5"];
const grayColors = ["#12375A", "#4E6C8A", "#7590AB", "#A7BDD3", "#D2E4F6"];

const createColorScale = () => {
  const positiveThreshold = scaleThreshold()
    .domain([0.2, 0.4, 0.6, 0.8, 1])
    .range(redColors);

  const negativeThreshold = scaleThreshold()
    .domain([-0.8, -0.6, -0.4, -0.2, 0])
    .range(grayColors.slice().reverse());

  return (value: number) => {
    if (value >= 0) {
      return positiveThreshold(value);
    } else {
      return negativeThreshold(value);
    }
  };
};

export const useMapStore = create<MapState>((set) => ({
  selectedState: { id: 0, name: "US" },
  selectedCounties: [],
  colorScale: createColorScale(),
  setSelectedState: (state) => set({ selectedState: state }),
  updateSelectedCounties: (counties) => set({ selectedCounties: counties }),
}));