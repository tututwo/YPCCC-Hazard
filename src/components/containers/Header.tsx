// @ts-nocheck
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useMapStore } from "@/lib/store";

export const HeatGapHeader = () => {
  const { USStates, selectedState, setSelectedState } = useMapStore();
  //   const [selectedState, setSelectedState] = useState({
  //     id: 0,
  //     name: "US",
  //   });

  const getStateDataViaId = (id: string) => {
    const state = USStates.find((state) => state.id.toString() === id);
    return {
      id: state.id,
      name: state.name,
    };
  };
  return (
    <div className=" mx-auto bg-blue-50 py-2 px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold text-blue-900">Heat gap</h2>
        <span className="text-gray-600">in</span>
        <Select
          defaultValue={selectedState.name}
          onValueChange={(value) => setSelectedState(getStateDataViaId(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>{selectedState.name}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {USStates.map((state) => (
              <SelectItem key={state.id} value={state.id.toString()}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select disabled={selectedState.name === "US" ? true : false}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="County" />
          </SelectTrigger>
          <SelectContent>
            {USStates.filter(
              (state) => state.name === selectedState.name
            )[0]?.counties.map((county: string) => (
              <SelectItem
                key={county.geoID}
                value={county.countyName.toString()}
              >
                {county.countyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
