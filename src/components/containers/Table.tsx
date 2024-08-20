// @ts-nocheck
"use client";
/* eslint-disable react/display-name */

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  flexRender,
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

import TableTailwind from "./TableTailwindCSS";

import * as d3 from "d3";

const formatDecimal = d3.format(".1f");

const createSortableHeader =
  (label: string) =>
  ({ column }) =>
    (
      <Button
        variant="ghost"
        className="px-0 whitespace-nowrap group"
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
    accessorKey: "county",
    header: createSortableHeader("County"),
    cell: ({ getValue }) => getValue().replace(" County", ""),
    size: 150,
  },
  {
    accessorKey: "state",
    header: createSortableHeader("State"),
    size: 150,
  },
  {
    accessorKey: "gap_cc_heatscore",
    header: createSortableHeader("Gap"),
    cell: ({ getValue }) => formatDecimal(getValue()),
    size: 50,
  },
  {
    accessorKey: "L_cc_heatscore",
    header: createSortableHeader("Risk"),
    cell: ({ getValue }) => formatDecimal(getValue()),
  },
  {
    accessorKey: "R_heat_worry",
    header: createSortableHeader("Worry"),
    cell: ({ getValue }) => formatDecimal(getValue()),
  },
];
// eslint-disable-next-line react/display-name
export default function DataTableDemo({ data,colorScale }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState([]);
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
      globalFilter: filterValue, // Use globalFilter instead of columnFilters
    },
    onGlobalFilterChange: setFilterValue,
  });
  const [hoveredRowIndex, setHoveredRowIndex] = React.useState<number | null>(
    null
  );

  const { rows } = table.getRowModel();

  const parentRef = React.useRef<HTMLDivElement>(null);
  const tableRef = React.useRef<HTMLTableElement>(null);

  // Update the virtualizer to use the filtered rows count
  const virtualizer = useVirtualizer({
    count: table.getFilteredRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 20, // 20 rows to render before and after the visible area
    initialOffset: 0, // start at the top of the table
  });

  return (
    <div className="">
      <Input
        placeholder="Filter counties..."
        value={(table.getColumn("county")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("county")?.setFilterValue(event.target.value)
        }
        className="max-w-sm mb-4"
      />

      <div ref={parentRef} className="h-screen overflow-auto relative">
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
            className="grid relative"
            style={{ height: virtualizer.getTotalSize() + "px" }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              if (!row) return null;
              return (
                <TableRow
                  key={row.id}
                  data-index={virtualRow.index}
                  ref={(node) => virtualizer.measureElement(node)}
                  className="flex absolute w-full z-30 transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  onMouseEnter={() => setHoveredRowIndex(virtualRow.index)}
                  onMouseLeave={() => setHoveredRowIndex(null)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="flex py-1 pl-0 truncate z-10 pointer-events-none"
                      style={{
                        width: cell.column.getSize() + "px",
                        backgroundColor:
                          cell.column.id === "gap_cc_heatscore"
                            ? colorScale(cell.getValue())
                            : "transparent",
                      }}
                    >
                      <div className="truncate">
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
    </div>
  );
}
