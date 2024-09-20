// @ts-nocheck
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as d3 from "d3";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// IMPORTANT:Scatterplot Utils
export function raise<T>(items: T[], raiseIndex: number) {
  const array = [...items];
  const lastIndex = array.length - 1;
  const [raiseItem] = array.splice(raiseIndex, 1);
  array.splice(lastIndex, 0, raiseItem);
  return array;
}
export const twoSigFigFormatter = d3.format(".2r");

export function drawBackgroundPoints(
  canvas,
  dataset,
  selectedCounties,
  xVariable,
  yVariable,
  colorVariable,
  xScale,
  yScale,
  colorScale
) {
  const ctx = canvas.getContext("2d");
 

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log(dataset)
  dataset.forEach((d) => {
    // NOTE: Smaller circle

    // ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(
      xScale(d[xVariable]),
      yScale(d[yVariable]),
      d.radius,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = colorScale(d[colorVariable]);
    ctx.fill();
    // FIXME: This produce a merging effect
    // ctx.fillStyle = "white";
    // ctx.fill();
    // ctx.strokeStyle = "black";
    // ctx.lineWidth = 2;
    // ctx.stroke();
  });
}
export function drawForegroundPoints(
  canvas,
  dataset,
  selectedCounties,
  xVariable,
  yVariable,
  colorVariable,
  xScale,
  yScale,
  colorScale
) {
  const ctx = canvas.getContext("2d");
 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const shuffledDataset = dataset.sort((a, b) => a[3] - b[3]);
  shuffledDataset.forEach(([a, b, d]) => {
    // NOTE: Larger circle

    // big circle
    ctx.beginPath();
    // circle merge?
    ctx.arc(
      xScale(d[xVariable]),
      yScale(d[yVariable]),
      d.radius * 2.4,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = colorScale(d[colorVariable]);
    ctx.lineWidth = 2;
    ctx.stroke();

    // FIXME: This produce a merging effect
    // ctx.fillStyle = "white";
    // ctx.fill();
    // ctx.strokeStyle = "black";
    // ctx.lineWidth = 2;
    // ctx.stroke();

    // small circle
    ctx.beginPath();

    ctx.arc(
      xScale(d[xVariable]),
      yScale(d[yVariable]),
      d.radius * 1.8,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = colorScale(d[colorVariable]);
    ctx.fill();
  });
}
// Brushing Utils
// Find the nodes within the specified rectangle.
export function search(quadtree, [[x0, y0], [x3, y3]], scanned, selected) {
  scanned.length = 0;
  selected.length = 0;
  quadtree.visit((node, x1, y1, x2, y2) => {
    // console.log(node);
    if (!node.length) {
      do {
        const {
          data: d,
          data: [x, y],
        } = node;
        const test = x >= x0 && x < x3 && y >= y0 && y < y3;
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
