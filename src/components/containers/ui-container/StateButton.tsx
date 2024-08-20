import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import { useMapContext } from "@/lib/context";
const people = [
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
  {
    id: 15,
    name: "Hawaii",
  },
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
  {
    id: 2,
    name: "Alaska",
  },
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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function StateButton() {
  const { selectedState, setSelectedState } = useMapContext();

  return (
    <Listbox value={selectedState} onChange={setSelectedState}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-lg font-bold w-[200px] text-gray-900">
            Heat Gap
          </Listbox.Label>
          in
          <div className="relative mt-2 w-full z-50">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="block truncate">{selectedState.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {people.map((person) => (
                  <Listbox.Option
                    key={person.id}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-[#CFCFCF] text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-8 pr-4"
                      )
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {person.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 left-0 flex items-center pl-1.5"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
