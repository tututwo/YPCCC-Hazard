// @ts-nocheck
"use client";
/* eslint-disable react/display-name */

import {
  useEffect,
  useState,
  useMemo,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  flexRender,
  RowPinningState,
} from "@tanstack/react-table";

import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import TableTailwind from "./TableTailwindCSS";
import { useMapContext } from "@/lib/context";

import * as d3 from "d3";

const formatDecimal = d3.format(".1f");

const createSortableHeader =
  (label: string) =>
  ({ column }) =>
    (
      <Button
        variant="ghost"
        className="px-0 whitespace-nowrap group text-[black]"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {label}
        <svg
          className="mx-1 size-4 opacity-0 group-hover:opacity-100 transition-opacity"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </Button>
    );
const columns = [
  {
    accessorKey: "County_name",
    header: createSortableHeader("County"),
    cell: ({ getValue }) => getValue().replace(" County", ""),
    size: 120,
  },
  {
    accessorKey: "state",
    header: createSortableHeader("State"),
    size: 80,
  },
  {
    accessorKey: "gap",
    header: createSortableHeader("Gap"),
    cell: ({ getValue }) => formatDecimal(getValue()),
    size: 80,
  },
  {
    accessorKey: "xValue",
    header: createSortableHeader("Risk"),
    cell: ({ getValue }) => formatDecimal(getValue()),
    size: 80,
  },
  {
    accessorKey: "yValue",
    header: createSortableHeader("Worry"),
    cell: ({ getValue }) => formatDecimal(getValue()),
    size: 80,
  },
];
// eslint-disable-next-line react/display-name
export default function DataTableDemo({
  data,

  height,
  xVariable,
  yVariable,
  colorVariable,
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterValue, setFilterValue] = useState("");

  const [rowPinning, setRowPinning] = useState({});

  const { colorScale, selectedCounties, updateSelectedCounties } =
    useMapContext();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    globalFilterFn: "includesString", // Use the built-in filter function
    state: {
      sorting,
      rowPinning,
      globalFilter: filterValue, // Use globalFilter instead of columnFilters
    },
    onGlobalFilterChange: setFilterValue,
    onRowPinningChange: setRowPinning,
    enableRowPinning: true,
    keepPinnedRows: false,
  });

  // const combinedPinnedRows = useMemo(() => {
  //   console.log(rowPinning);
  //   const tablePinnedRows = table.getTopRows().map((row) => row.id);
  // const selectedCountyRows = table
  //   .getCenterRows()
  //   .filter((row) => selectedCounties.includes(row.original.geoid));
  //   return [...new Set([...selectedCountyRows, ...tablePinnedRows])];
  // }, [selectedCounties, table.getTopRows()]);

  useEffect(() => {
    const newPinning: RowPinningState = {
      top: table
        .getCenterRows()
        .filter((row) => selectedCounties.includes(row.original.geoid))
        .map((row) => row.id),
    };

    setRowPinning(newPinning);
  }, [selectedCounties, table]);

  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  const { rows } = table.getRowModel();

  const parentRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  // Update the virtualizer to use the filtered rows count
  const virtualizer = useVirtualizer({
    count: table.getCenterRows().length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 20, // 20 rows to render before and after the visible area
    initialOffset: 0, // start at the top of the table
    scrollMargin: table.getTopRows().length * 35 + 10, // Add this line
  });


  return (
    <>
      <Input
        placeholder="Filter counties..."
        value={
          (table.getColumn("County_name")?.getFilterValue() as string) ?? ""
        }
        onChange={(event) =>
          table.getColumn("County_name")?.setFilterValue(event.target.value)
        }
        className="w-full mb-4 "
      />

      <div ref={parentRef} className="overflow-scroll relative h-full">
        <Table className="grid">
          <TableHeader className="grid sticky top-0 z-50 bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="flex"
                    style={{ width: header.getSize() + "px" }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            className="flex flex-col relative"
            style={{
              height: `${
                virtualizer.getTotalSize() + table.getTopRows().length * 35
              }px`,
            }}
          >
            {table.getTopRows().map((row, rowIndex) => (
              <TableRow
                data-index={rowIndex}
                onClick={() => {
                  // const isCurrentlyPinned = selectedCounties.includes(row.id);

                  // const newSelectedCounties = isCurrentlyPinned
                  //   ? selectedCounties.filter((id) => id !== row.id)
                  //   : [...selectedCounties, row.original];
                  // updateSelectedCounties(newSelectedCounties[0].geoid);
                  row.pin("top");
                }}
                key={row.id}
                ref={(node) => virtualizer.measureElement(node)}
                className="flex  bg-white w-full z-40 transition-colors duration-200 hover:bg-gray-300 cursor-pointer  py-0.5"
                style={{
                  top: `${rowIndex * 35 + 50}px`, // because header is 50px
                  height: "35px",
                  borderBottom:
                    rowIndex === table.getTopRows().length - 1
                      ? "2px solid #E0E0E0"
                      : "none",
                }}

                // onMouseEnter={() => setHoveredRowIndex(virtualRow.index)}
                // onMouseLeave={() => setHoveredRowIndex(null)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="flex py-1 pl-0 truncate z-10 pointer-events-none w-full"
                    style={{
                      width: cell.column.getSize() + "px",
                      backgroundColor: (() => {
                        if (cell.column.id === colorVariable) {
                          const { h, s, l, opacity } = d3.hsl(
                            colorScale(cell.getValue())
                          );
                          // Adjust the lightness (l) value as needed
                          // You can change this value to adjust the lightness
                          return d3
                            .hsl(h, s * 1, 0.61, opacity * 0.8)
                            .toString();
                        } else if (rowIndex % 2 === 1) {
                          return "#F0F0F0";
                        } else {
                          return "transparent";
                        }
                      })(),
                    }}
                  >
                    <div
                      className="truncate text-xs text-right"
                      style={{
                        color:
                          cell.column.id === colorVariable &&
                          cell.getValue() > 0.9
                            ? "white"
                            : "black",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {virtualizer.getVirtualItems().map((virtualRow, rowIndex) => {
              const row = table.getCenterRows()[virtualRow.index];
              if (!row) return null;

              return (
                <TableRow
                  key={row.id}
                  data-index={virtualRow.index}
                  ref={(node) => virtualizer.measureElement(node)}
                  className="flex absolute w-full z-30 transition-colors duration-200 hover:bg-gray-300 cursor-pointer  py-0.5"
                  style={{
                    //  add this, table.getTopRows().length * 35 +, to translateY is like add scrollMargin
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  onClick={() => {
                    const isCurrentlyPinned = selectedCounties.includes(row.id);

                    const newSelectedCounties = isCurrentlyPinned
                      ? selectedCounties.filter((id) => id !== row.id)
                      : [...selectedCounties, row.original];
                    console.log(newSelectedCounties[0].geoid);
                    // updateSelectedCounties(newSelectedCounties[0].geoid);
                    row.pin("top");
                  }}
                  // onMouseEnter={() => setHoveredRowIndex(virtualRow.index)}
                  // onMouseLeave={() => setHoveredRowIndex(null)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="flex py-1 pl-0 truncate z-10 pointer-events-none w-full"
                      style={{
                        width: cell.column.getSize() + "px",
                        backgroundColor: (() => {
                          if (cell.column.id === colorVariable) {
                            const { h, s, l, opacity } = d3.hsl(
                              colorScale(cell.getValue())
                            );
                            // Adjust the lightness (l) value as needed
                            // You can change this value to adjust the lightness
                            return d3
                              .hsl(h, s * 1, 0.61, opacity * 0.8)
                              .toString();
                          } else if (rowIndex % 2 === 1) {
                            return "#F0F0F0";
                          } else {
                            return "transparent";
                          }
                        })(),
                      }}
                    >
                      <div
                        className="truncate text-xs text-right"
                        style={{
                          color:
                            cell.column.id === colorVariable &&
                            cell.getValue() > 0.9
                              ? "white"
                              : "black",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function getCellBackgroundColor(cell, colorVariable, colorScale, rowIndex) {
  if (cell.column.id === colorVariable) {
    const { h, s, l, opacity } = d3.hsl(colorScale(cell.getValue()));
    return d3.hsl(h, s * 1, 0.61, opacity * 0.8).toString();
  } else if (rowIndex % 2 === 1) {
    return "#F0F0F0";
  }
  return "transparent";
}

function getCellTextColor(cell, colorVariable) {
  return cell.column.id === colorVariable && cell.getValue() > 0.9
    ? "white"
    : "black";
}
