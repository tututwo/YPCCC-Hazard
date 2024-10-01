// @ts-nocheck
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as d3 from "d3";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const twoSigFigFormatter = d3.format(".2r");

// Brushing Utils
// Find the nodes within the specified rectangle.
export function search(
  quadtree,
  [[x0, y0], [x3, y3]],
  scanned,
  selected,
  xScale,
  yScale,
  xVariable,
  yVariable
) {
  scanned.length = 0;
  selected.length = 0;
  quadtree.visit((node, x1, y1, x2, y2) => {
    if (!node.length) {
      do {
        const { data: d } = node;
        const test =
          xScale(d[xVariable]) >= x0 &&
          xScale(d[xVariable]) < x3 &&
          yScale(d[yVariable]) >= y0 &&
          yScale(d[yVariable]) < y3;
        (test ? selected : scanned).push(d);
        return test;
      } while ((node = node.next));
    }
    return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
  });
}

// Collapse the quadtree into an array of rectangles.
export function nodes(quadtree) {
  const nodes = [];
  quadtree.visit((node, x0, y0, x1, y1) => void nodes.push({ x0, y0, x1, y1 }));
  return nodes;
}
