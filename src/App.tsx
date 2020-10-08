import React, { FC, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import classNames from 'classnames';
import './App.css';

enum BarVerticalAlignment {
  SpaceBetween,
  Top,
  Bottom,
}

type Props = {
  data: any[];
  barWidth?: number;
  barVerticalAlignment?: BarVerticalAlignment;
  clickableBars?: boolean;
};

const App: FC<Props> = ({ data, barWidth = 4, clickableBars }) => {
  const container = useRef<SVGSVGElement>(null);

  const classes = classNames('container-fluid', {
    'clickable-bars': clickableBars,
  });

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  let chart: any;
  let width: any;
  let height: any;
  let xScale: any;
  let yScale: any;
  let xAxis: any;
  let yAxis: any;
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

    xAxis = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top + height})`);

    yAxis = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    chart = svg
      .append('g')
      .attr('class', 'bars')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    xScale = d3.scaleLinear().domain(xDomain).range([width, 0]);

    yScale = d3
      .scaleBand()
      .padding(0.3)
      .domain(yDomain)
      .rangeRound([0, height]);
  };

  const drawBars = (): void => {
    // Draw bars
    chart
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('fill', (d: any) => d.color)
      .attr('x', () => 0)
      .attr('y', (d: any) => yScale(d.label))
      .attr('width', (d: any) => 1)
      .attr('height', () => (barWidth ? barWidth : yScale.bandwidth()))
      .attr('value', (d: any) => d.value);

    // Animate bars
    chart
      .selectAll('.bar')
      .transition()
      .duration(300)
      .attr('width', (d: any) => width - xScale(d.value))
      .delay(100);
    // .delay((d: any, i: number) => i * 100);
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
