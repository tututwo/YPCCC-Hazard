"use client";
/* eslint-disable react/display-name */
// @ts-nocheck
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

import { format } from "d3-format";

const formatDecimal = format(".1f");

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
  },
  {
    accessorKey: "state",
    header: createSortableHeader("State"),
  },
  {
    accessorKey: "gap_cc_heatscore",
    header: createSortableHeader("Gap Score"),
    cell: ({ getValue }) => formatDecimal(getValue()),
  },
  {
    accessorKey: "L_cc_heatscore",
    header: createSortableHeader("Heat Risk"),
    cell: ({ getValue }) => formatDecimal(getValue()),
  },
  {
    accessorKey: "R_heat_worry",
    header: createSortableHeader("Heat Worry"),
    cell: ({ getValue }) => formatDecimal(getValue()),
  },
];
// eslint-disable-next-line react/display-name
export default function DataTableDemo({ data }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Add this line
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters, // Add this line
    state: {
      sorting,
      columnFilters, // Add this line
    },
  });

  const { rows } = table.getRowModel();

  const parentRef = React.useRef<HTMLDivElement>(null);

  // Update the virtualizer to use the filtered rows count
  const virtualizer = useVirtualizer({
    count: table.getFilteredRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 10,
  });

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) =>
      row
        .getValue("county")
        .toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    );
  }, [rows, filterValue]);

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

      <div
        ref={parentRef}
        className="max-h-screen"
        style={{ overflow: "auto" }}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="pl-0">
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
          <TableBody>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index];
              if (!row) return null; // Add this check
              return (
                <TableRow key={row.id} data-index={virtualRow.index}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-1 pl-0 text-nowrap min-w-[144px]">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
