import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useMapStore } from "@/lib/store";

export const HeatGapHeader = () => {
  const { USStates, selectedState, setSelectedState, selectedZoomCounty, setSelectedZoomCounty } =
    useMapStore();

  const getStateDataViaId = (id: string) => {
    const state = USStates.find((state) => state.id.toString() === id);
    return {
      id: state!.id,
      name: state!.name,
    };
  };

  const handleStateChange = (value: string) => {
    setSelectedState(getStateDataViaId(value));
    setSelectedZoomCounty({ countyName: "", geoID: "" });
    // setKey((prevKey) => prevKey + 1); // was needed for manually trigger second selector to re-render
  };

  const handleCountyChange = (value: string) => {
    const selectedCountyData = USStates.find(
      (state) => state?.name === selectedState.name
    )?.counties.find((county) => county.geoID.toString() === value);

    if (selectedCountyData) {
      setSelectedZoomCounty({
        geoID: selectedCountyData.geoID,
        countyName: selectedCountyData.countyName,
      });
    }
  };

  return (
    <div className="mx-auto bg-blue-50 py-2 px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold text-blue-900">Heat gap</h2>
        <span className="text-gray-600">in</span>
        <Select defaultValue={selectedState.name} onValueChange={handleStateChange}>
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
        <Select
          disabled={selectedState.name === "US"}
          value={selectedZoomCounty.geoID || ""}
          onValueChange={handleCountyChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="County">
              {selectedZoomCounty.countyName || "County"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {USStates.find(
              (state) => state.name === selectedState.name && state.name !== "US"
            )?.counties.map((county) => (
              <SelectItem key={county.geoID} value={county.geoID.toString()}>
                {county.countyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
