import React, { FC, useCallback, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import classNames from 'classnames';
import './HorizontalHistogramm.scss';

type Props = {
  data: any[];
  showLabels?: boolean;
  showCounts?: boolean;
  showTotal?: boolean;
  showCountsInsteadLabels?: boolean;
  clickableBars?: boolean;
  loading?: boolean;
  barWidth?: number;
  barGutter?: number;
  animationDuration?: number;
  animationStepDelay?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  fontSize?: number;
  onChartClick?: (item: any) => void;
};

export const HorizontalHistogramm: FC<Props> = ({
  data,
  showLabels = false,
  showCounts = false,
  showTotal = true,
  showCountsInsteadLabels = false,
  clickableBars = false,
  loading = false,
  barWidth = 8,
  barGutter = 16,
  animationDuration = 300,
  animationStepDelay = 0,
  margin = { top: 10, right: 38, bottom: 10, left: 38 },
  fontSize = 14,
  onChartClick,
}) => {
  const container = useRef<SVGSVGElement>(null);

  const classes = classNames('chart container-fluid', {
    'clickable-bars': clickableBars,
    loading,
  });

  let bars: any;
  let width: any;
  let height: any;
  let xScale: any;
  let yScale: any;
  let counts: any;
  let labels: any;
  let total: any;
  let xDomain: any;
  let yDomain: any;

  const createChart = (): void => {
    const element = container.current;
    if (!element) {
      return;
    }

    width = element.clientWidth - margin.left - margin.right;
    height = element.clientHeight - margin.top - margin.bottom;
    height = Math.min(height, (barWidth + barGutter) * data.length);

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

    labels = svg.append('g').attr('transform', `translate(0, ${margin.top})`);

    total = svg.append('g').attr('transform', `translate(0, ${margin.top})`);

    xScale = d3.scaleLinear().domain(xDomain).range([0, width]);

    yScale = d3.scaleBand().domain(yDomain).rangeRound([0, height]);
  };

  const drawBars = (): void => {
    // Draw bars
    bars
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', (d: any) => 'bar')
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('fill', (d: any) => (d.color ? d.color : '#2375E1'))
      .attr('x', () => 2)
      .attr('y', (d: any) => yScale(d.label))
      .attr('height', () => (barWidth ? barWidth : yScale.bandwidth()))
      .attr('index', (d: any, i: number) => i);

    // Animate bars
    bars
      .selectAll('.bar')
      .transition()
      .duration(animationDuration)
      .attr('width', (d: any) => xScale(d.value))
      .delay((d: any, i: number) => i * animationStepDelay);
  };

  const drawCounts = (): void => {
    if (loading) {
      counts
        .selectAll('.count-skeleton')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'count-skeleton')
        .attr('x', () => 0)
        .attr('y', (d: any) => yScale(d.label) - fontSize / 2 + barWidth / 2)
        .attr('width', fontSize * 2)
        .attr('height', fontSize)
        .attr('fill', '#E5F8FF');

      counts
        .selectAll('.count-skeleton')
        .transition()
        .duration(animationDuration)
        .attr('x', (d: any) => xScale(d.value) + (d.value === 0 ? 0 : 12))
        .delay((d: any, i: number) => i * animationStepDelay);
    } else {
      counts
        .selectAll('.count')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'count')
        .attr('x', () => 0)
        .attr('y', (d: any) => yScale(d.label) + barWidth / 2)
        .attr('font-family', 'Roboto')
        .attr('font-size', fontSize + 'px')
        .attr('font-weight', 'normal')
        .attr('fill', '#1556BB')
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'middle');

      counts
        .selectAll('.count')
        .transition()
        .duration(animationDuration)
        .attr('x', (d: any) => xScale(d.value) + (d.value === 0 ? 0 : 12))
        .tween('text', function (d: any, i: any, n: any) {
          const interpolator = d3.interpolateNumber(0, d.value); // d3 interpolator
          const selection = d3.select(n[i]);
          return (t: any) =>
            selection.text(loading ? 'xx' : Math.round(interpolator(t))); // return value
        })
        .delay((d: any, i: number) => i * animationStepDelay);
    }
  };

  const drawLabels = (): void => {
    if (loading) {
      labels
        .selectAll('.label-skeleton')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'label-skeleton')
        .attr('x', () => 0)
        .attr('y', (d: any) => yScale(d.label) - fontSize / 2 + barWidth / 2)
        .attr('width', fontSize * 2)
        .attr('height', fontSize)
        .attr('fill', showCountsInsteadLabels ? '#E5F8FF' : '#DDE0E6');
    } else {
      labels
        .selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', () => 0)
        .attr('y', (d: any) => yScale(d.label) + barWidth / 2)
        .attr('font-family', 'Roboto')
        .attr('font-size', fontSize + 'px')
        .attr('font-weight', 'normal')
        .attr('fill', showCountsInsteadLabels ? '#1556BB' : '#7F828A')
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'middle')
        .text((d: any) =>
          showCountsInsteadLabels ? (loading ? 'xx' : d.value) : d.label
        );
    }
  };

  const drawTotal = (): void => {
    if (loading) {
      total
        .append('rect')
        .attr('x', 0)
        .attr('y', height)
        .attr('width', 120)
        .attr('height', fontSize * 1.2)
        .attr('fill', '#DDE0E6');
    } else {
      total
        .append('text')
        .attr('class', 'total')
        .attr('x', 0)
        .attr('y', height + 9)
        .attr('font-family', 'Roboto')
        .attr('font-size', fontSize + 'px')
        .attr('font-weight', 'normal')
        .attr('fill', '#7F828A')
        .attr('alignment-baseline', 'top')
        .text('Всего: ')
        .append('tspan')
        .attr('class', 'total-count')
        .attr('font-family', 'Roboto')
        .attr('font-size', fontSize + 'px')
        .attr('font-weight', 'normal')
        .attr('fill', '#1556BB')
        .attr('alignment-baseline', 'top');

      total
        .selectAll('.total-count')
        .transition()
        .duration(animationDuration + data.length * animationStepDelay)
        .tween('text', function (d: any, i: any, n: any) {
          const total = data.reduce((prev, curr) => (prev += curr.value), 0);
          const interpolator = d3.interpolateNumber(0, total); // d3 interpolator
          const selection = d3.select(n[i]);
          return (t: any) => selection.text(Math.round(interpolator(t))); // return value
        });
    }
  };

  const clickHandler = (event: MouseEvent): void => {
    const target = event.target as SVGRectElement;
    const attributes = target.attributes;

    if (
      !loading &&
      clickableBars &&
      attributes.getNamedItem('class')?.nodeValue === 'bar'
    ) {
      const index = attributes.getNamedItem('index')?.nodeValue;
      // @ts-ignore
      onChartClick(data[index]);
    }
  };

  // eslint-disable-next-line
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

      if (showTotal) {
        drawTotal();
      }

      container.current.addEventListener('click', clickHandler);
    }
  };

  const memoizedCallback = useCallback(() => {
    update();
  }, [update]);

  useEffect(() => {
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
      // eslint-disable-next-line
      container.current?.removeEventListener('click', clickHandler);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    memoizedCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, update]);

  return <svg className={classes} ref={container}></svg>;
};
