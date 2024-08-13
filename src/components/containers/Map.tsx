// @ts-nocheck
"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from 'topojson-client';
import { useMapContext } from "@/lib/context"

const USMap = ({ width = 975, height = 610 }) => {
  const canvasRef = useRef(null);
  const zoomRef = useRef(null);
  const [geographyData, setGeographyData] = useState(null);
  const { selectedState } = useMapContext();

  useEffect(() => {
    d3.json('/counties-10m.json').then(data => {
      const processedData = {
        states: feature(data, data.objects.states),
        counties: feature(data, data.objects.counties),
        nation: feature(data, data.objects.nation),
        statesMesh: mesh(data, data.objects.states, (a, b) => a !== b),
        countiesMesh: mesh(data, data.objects.counties, (a, b) => a !== b && ((a.id / 1000) | 0) === ((b.id / 1000) | 0))
      };
      
      setGeographyData(processedData);
    });
  }, []);

  const projection = d3.geoAlbersUsa().fitSize([width, height], geographyData?.nation);
  const path = d3.geoPath(projection);

  const drawMap = useCallback((transform = d3.zoomIdentity) => {
    if (!canvasRef.current || !geographyData) return;

    const context = canvasRef.current.getContext('2d');
    context.clearRect(0, 0, width, height);

    context.save();
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);

    // Draw states
    context.beginPath();
    path.context(context)(geographyData.states);
    context.fillStyle = '#f0f0f0';
    context.fill();

    // Draw state borders
    context.beginPath();
    path.context(context)(geographyData.statesMesh);
    context.strokeStyle = '#000';
    context.lineWidth = 0.5 / transform.k;
    context.stroke();

    // Draw county borders
    context.beginPath();
    path.context(context)(geographyData.countiesMesh);
    context.strokeStyle = '#aaa';
    context.lineWidth = 0.25 / transform.k;
    context.stroke();

    // Highlight selected state if any
    if (selectedState?.name) {
      const selectedStateFeature = geographyData.states.features.find(
        d => d.properties.name === selectedState.name
      );
      if (selectedStateFeature) {
        context.beginPath();
        path.context(context)(selectedStateFeature);
        context.fillStyle = 'rgba(255, 0, 0, 0.2)';
        context.fill();
      }
    }

    context.restore();
  }, [geographyData, selectedState?.name, width, height]);

  // Set up zoom behavior
  useEffect(() => {
    if (!canvasRef.current || !geographyData) return;

    const canvas = canvasRef.current;
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        drawMap(event.transform);
      });

    zoomRef.current = zoom;

    d3.select(canvas)
      .call(zoom);

  }, [geographyData, drawMap]);

  // Handle state selection and zooming
  useEffect(() => {
    if (!geographyData || !selectedState?.name || !zoomRef.current) return;

    const selectedStateFeature = geographyData.states.features.find(
      d => d.properties.name === selectedState.name
    );

    if (selectedStateFeature) {
      const [[x0, y0], [x1, y1]] = path.bounds(selectedStateFeature);
      const k = Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height));
      const centroid = path.centroid(selectedStateFeature);

      const transform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(k)
        .translate(-centroid[0], -centroid[1]);

      d3.select(canvasRef.current)
        .transition()
        .duration(750)
        .call(zoomRef.current.transform, transform);
    }
  }, [geographyData, selectedState?.name, path, width, height]);

  // Initial draw
  useEffect(() => {
    drawMap();
  }, [drawMap]);

  return (
    <canvas ref={canvasRef} width={width} height={height} />
  );
};

export default USMap;