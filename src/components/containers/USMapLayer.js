
import * as d3 from 'd3';
import {CompositeLayer} from '@deck.gl/core';
import {GeoJsonLayer} from '@deck.gl/layers';

export default class USMapLayer extends CompositeLayer {
  renderLayers() {
    const {geographyData, colorScale, colorVariable, alphaValues, selectedCounties} = this.props;

    // const stateLayer = new GeoJsonLayer({
    //   id: 'state-layer',
    //   data: geographyData,
    //   getFillColor: d => {
    //     const {r, g, b} = d3.color(colorScale(d.properties[colorVariable]));
    //     const a = alphaValues[d.properties.STATENAME] * 0.77 || 255;
    //     return [r, g, b, a];
    //   },
    //   getLineColor: [205, 209, 209, 100],
    //   getLineWidth: 0.5,
    //   lineWidthUnits: 'pixels',
    //   lineWidthScale: 1,
    //   lineWidthMinPixels: 0.4,
    //   lineWidthMaxPixels: 10,
    //   updateTriggers: {
    //     getFillColor: [colorScale, alphaValues],
    //   },
    // });

    const countyLayer = new GeoJsonLayer({
      id: 'county-layer',
      data: geographyData,
      getFillColor: d => {
        const {r, g, b} = d3.color(colorScale(d.properties[colorVariable]));
        const a = selectedCounties.length == 0 ? 255 : selectedCounties.includes(d.properties.GEOID) ? 255 : 100;
        return [r, g, b, a];
      },
      pickable: true,
      autoHighlight: false,
      getLineColor: [255, 255, 255, 200],
      getLineWidth: 0,
      lineWidthUnits: 'pixels',
      lineWidthScale: 1,
      // lineWidthMinPixels: 1,
      // lineWidthMaxPixels: 1,
      transitions: {
        getFillColor: 500,
        getLineColor: 500,
      },
      updateTriggers: {
        getFillColor: [colorScale, selectedCounties],
      },
    });

    return [countyLayer];
  }
}