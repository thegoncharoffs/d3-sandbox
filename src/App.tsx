import React, { FC, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import classNames from 'classnames';
import './App.css';

type Props = {
  data: any[];
  barWidth?: number;
  clickableBars?: boolean;
  countsAlign?: 'left' | 'right';
  animationDuration?: number;
  showLabels?: boolean;
  showCounts?: boolean;
};

const App: FC<Props> = ({
  data,
  barWidth = 8,
  clickableBars,
  countsAlign = 'right',
  animationDuration = 300,
  showLabels = false,
  showCounts = false,
}) => {
  const container = useRef<SVGSVGElement>(null);

  const classes = classNames('container-fluid', {
    'clickable-bars': clickableBars,
  });

  const margin = { top: 20, right: 80, bottom: 30, left: 80 };
  let bars: any;
  let width: any;
  let height: any;
  let xScale: any;
  let yScale: any;
  let counts: any;
  let labels: any;
  let xDomain: any;
  let yDomain: any;

  const createChart = (): void => {
    const element = container.current;
    if (!element) {
      return;
    }

    width = element.clientWidth - margin.left - margin.right;
    height = element.clientHeight - margin.top - margin.bottom;

    // Clear previous graph
    d3.select(element).selectAll('*').remove();

    const svg = d3
      .select(element)
      .attr('width', element.clientWidth)
      .attr('height', element.clientHeight);

    // Define X, Y domains
    xDomain = [0, d3.max(data, (d) => d.value) as number];
    yDomain = data.map((d) => d.label);

    bars = svg
      .append('g')
      .attr('class', 'bars')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    counts = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    labels = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    xScale = d3.scaleLinear().domain(xDomain).range([0, width]);

    yScale = d3
      .scaleBand()
      .padding(0.3)
      .domain(yDomain)
      .rangeRound([0, height]);
  };

  const drawBars = (): void => {
    // Draw bars
    bars
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('fill', (d: any) => d.color)
      .attr('x', () => 2)
      .attr('y', (d: any) => yScale(d.label))
      .attr('height', () => (barWidth ? barWidth : yScale.bandwidth()))
      .attr('value', (d: any) => d.value);

    // Animate bars
    bars
      .selectAll('.bar')
      .transition()
      .duration(animationDuration)
      .attr('width', (d: any) => xScale(d.value))
      .delay(100);
    // .delay((d: any, i: number) => i * 100);
  };

  const drawCounts = (): void => {
    counts
      .selectAll('.count')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'count')
      .attr('x', (d: any) => 0)
      .attr('y', (d: any) => yScale(d.label) + 6 + barWidth / 2)
      .attr('font-size', '16px')
      .attr('font-weight', '700')
      .attr('fill', 'blue')
      .attr('text-anchor', countsAlign === 'right' ? 'start' : 'end')
      // .attr('height', () => (barWidth ? barWidth : yScale.bandwidth()))
      .text((d: any) => 0);

    counts
      .selectAll('.count')
      .transition()
      .duration(animationDuration)
      .attr('x', (d: any) =>
        countsAlign === 'right' ? xScale(d.value) + (d.value === 0 ? 0 : 8) : -8
      )
      .tween('text', function (d: any, i: any, n: any) {
        const interpolator = d3.interpolateNumber(0, d.value); // d3 interpolator
        const selection = d3.select(n[i]);
        return (t: any) => selection.text(Math.round(interpolator(t))); // return value
      })
      .delay(100);
  };

  const drawLabels = (): void => {
    labels
      .selectAll('.count')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'count')
      .attr('x', (d: any) => -8)
      .attr('y', (d: any) => yScale(d.label) + 6 + barWidth / 2)
      .attr('font-size', '16px')
      .attr('font-weight', '700')
      .attr('fill', 'grey')
      .attr('text-anchor', 'end')
      .text((d: any) => d.label);
  };

  const clickHandler = (event: MouseEvent): void => {
    const target = event.target as SVGRectElement;
    const attributes = target.attributes;

    if (
      clickableBars &&
      attributes.getNamedItem('class')?.nodeValue === 'bar'
    ) {
      console.log(attributes.getNamedItem('value')?.nodeValue);
    }
  };

  const update = () => {
    if (data && container.current) {
      createChart();
      drawBars();
      if (showCounts) {
        drawCounts();
      }
      if (showLabels) {
        drawLabels();
      }

      container.current.removeEventListener('click', clickHandler);
      container.current.addEventListener('click', clickHandler);
    }
  };

  useEffect(() => {
    update();

    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
      container.current?.removeEventListener('click', clickHandler);
    };
  }, []);

  return <svg className={classes} ref={container}></svg>;
};

export default App;
