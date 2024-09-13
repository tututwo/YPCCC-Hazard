import { create } from "zustand";
import { scaleQuantize } from "d3-scale";
import { csv } from "d3-fetch";

interface MapState {
  selectedState: { id: number; name: string };
  selectedCounties: string[];
  colorScale: (value: number) => string;
  data: any[]; // Add this line
  filteredData: any[]; // Add this line
  setSelectedState: (state: { id: number; name: string }) => void;
  updateSelectedCounties: (counties: string[]) => void;
  fetchData: () => Promise<void>; // Add this line
  filterDataByState: (stateName: string) => void; // Add this line
}

const createColorScale = () => {
  const domain = [-1, 1]; // Min and max of your domain
  const range = [
    "#11375A",
    "#4E6C8A",
    "#7590AB",
    "#A7BDD3",
    "#D2E4F6",
    "#FBCFDA",
    "#E69FB0",
    "#D6798F",
    "#C6536F",
    "#AE1C3E",
  ];

  return scaleQuantize().domain(domain).range(range);
};

const USStates = [
  {
    id: 10,
    name: "Delaware",
  },
  {
    id: 11,
    name: "District of Columbia",
  },
  {
    id: 12,
    name: "Florida",
  },
  {
    id: 13,
    name: "Georgia",
  },
  // {
  //   id: 15,
  //   name: "Hawaii",
  // },
  {
    id: 16,
    name: "Idaho",
  },
  {
    id: 17,
    name: "Illinois",
  },
  {
    id: 18,
    name: "Indiana",
  },
  {
    id: 19,
    name: "Iowa",
  },
  {
    id: 20,
    name: "Kansas",
  },
  {
    id: 21,
    name: "Kentucky",
  },
  {
    id: 22,
    name: "Louisiana",
  },
  {
    id: 23,
    name: "Maine",
  },
  {
    id: 24,
    name: "Maryland",
  },
  {
    id: 25,
    name: "Massachusetts",
  },
  {
    id: 26,
    name: "Michigan",
  },
  {
    id: 27,
    name: "Minnesota",
  },
  {
    id: 28,
    name: "Mississippi",
  },
  {
    id: 29,
    name: "Missouri",
  },
  {
    id: 30,
    name: "Montana",
  },
  {
    id: 31,
    name: "Nebraska",
  },
  {
    id: 32,
    name: "Nevada",
  },
  {
    id: 33,
    name: "New Hampshire",
  },
  {
    id: 34,
    name: "New Jersey",
  },
  {
    id: 35,
    name: "New Mexico",
  },
  {
    id: 36,
    name: "New York",
  },
  {
    id: 37,
    name: "North Carolina",
  },
  {
    id: 38,
    name: "North Dakota",
  },
  {
    id: 39,
    name: "Ohio",
  },
  {
    id: 40,
    name: "Oklahoma",
  },
  {
    id: 41,
    name: "Oregon",
  },
  {
    id: 42,
    name: "Pennsylvania",
  },
  {
    id: 44,
    name: "Rhode Island",
  },
  {
    id: 45,
    name: "South Carolina",
  },
  {
    id: 46,
    name: "South Dakota",
  },
  {
    id: 47,
    name: "Tennessee",
  },
  {
    id: 48,
    name: "Texas",
  },
  {
    id: 49,
    name: "Utah",
  },
  {
    id: 50,
    name: "Vermont",
  },
  {
    id: 51,
    name: "Virginia",
  },
  {
    id: 53,
    name: "Washington",
  },
  {
    id: 54,
    name: "West Virginia",
  },
  {
    id: 55,
    name: "Wisconsin",
  },
  {
    id: 56,
    name: "Wyoming",
  },
  {
    id: 1,
    name: "Alabama",
  },
  // {
  //   id: 2,
  //   name: "Alaska",
  // },
  {
    id: 4,
    name: "Arizona",
  },
  {
    id: 5,
    name: "Arkansas",
  },
  {
    id: 6,
    name: "California",
  },
  {
    id: 8,
    name: "Colorado",
  },
  {
    id: 9,
    name: "Connecticut",
  },
  {
    id: 0,
    name: "US",
  },
];
USStates.sort((a, b) => a.name.localeCompare(b.name));
export const useMapStore = create<MapState>((set, get) => ({
  selectedState: { id: 0, name: "US" },
  selectedCounties: [],
  data: [],
  filteredData: [],
  colorScale: createColorScale(),
  setSelectedState: (state) => {
    set({ selectedState: state });
    const { data } = get();
    const filtered = state.name === "US" 
      ? data 
      : data.filter((d) => d.state === state.name);
    set({ filteredData: filtered });
  },
  updateSelectedCounties: (counties) => set({ selectedCounties: counties }),
  USStates: USStates,
  fetchData: async () => {
    const loadedData = await csv("/data.csv");
    const processedData = loadedData.map((d) => ({
      ...d,
      xValue: +d.xValue,
      yValue: +d.yValue,
      gap: +d.gap,
      radius: 3,
      isBrushed: false,
    }));
    set({ data: processedData, filteredData: processedData });
  },
  filterDataByState: (stateName) => {
    const { data } = get();
    const filtered =
      stateName === "US" ? data : data.filter((d) => d.state === stateName);
    set({ filteredData: filtered });
  },
}));
