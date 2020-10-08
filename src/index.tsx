import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

const data = [
  { label: 'Bob', value: 33, color: 'red', loading: true },
  { label: 'Robin', value: 12, color: 'red', loading: true },
  { label: 'Anne', value: 41, color: 'red', loading: true },
  { label: 'Mark', value: 16, color: 'red', loading: true },
  { label: 'Joe', value: 59, color: 'red', loading: true },
  { label: 'Eve', value: 38, color: 'red', loading: true },
  { label: 'Karen', value: 21, color: 'red' },
  { label: 'Kirsty', value: 25, color: 'red' },
  { label: 'Chris', value: 30, color: 'red', loading: true },
  { label: 'Lisa', value: 47, color: 'red', loading: true },
  { label: 'Tom', value: 5, color: 'red' },
  { label: 'Stacy', value: 60, color: '#fgfgfg', loading: true },
  { label: 'Charles', value: 13, color: 'orange', loading: true },
  { label: 'Mary', value: 29, color: 'yellow' },
];

const data2 = [
  { label: 'КИБ', value: 50 },
  { label: 'СМБ', value: 12 },
  { label: 'РБ', value: 41 },
];

const data3 = [
  { label: 'КИБ', value: 50, color: '#00AAFF' },
  { label: 'СМБ', value: 12, color: '#B5E6FF' },
  { label: 'РБ', value: 41, color: '#EBEEF2' },
];

ReactDOM.render(
  <React.StrictMode>
    <div className="container">
      <App
        data={data}
        showLabels={true}
        showCounts={true}
        clickableBars={true}
        animationDuration={1000}
        animationStepDelay={100}
        fontSize={14}
        barWidth={8}
        margin={{ top: 20, right: 80, bottom: 20, left: 60 }}
        onChartClick={(item) => console.log(item)}
      />
      <hr />
      <App
        data={data2}
        showLabels={true}
        showCounts={true}
        clickableBars={true}
        animationDuration={1000}
        animationStepDelay={0}
        onChartClick={(item) => console.log(item)}
      />
      <hr />
      <App
        data={data3}
        showLabels={true}
        loading={true}
        showCountsInsteadLabels={true}
        animationDuration={1000}
        animationStepDelay={100}
      />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
