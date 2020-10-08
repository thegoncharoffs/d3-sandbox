import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

var data = [
  { label: 'Bob', value: 33, color: 'red' },
  { label: 'Robin', value: 12, color: 'red' },
  { label: 'Anne', value: 41, color: 'red' },
  { label: 'Mark', value: 16, color: 'red' },
  { label: 'Joe', value: 59, color: 'red' },
  { label: 'Eve', value: 38, color: 'red' },
  { label: 'Karen', value: 21, color: 'red' },
  { label: 'Kirsty', value: 25, color: 'red' },
  { label: 'Chris', value: 30, color: 'red' },
  { label: 'Lisa', value: 47, color: 'red' },
  { label: 'Tom', value: 5, color: 'red' },
  { label: 'Stacy', value: 0, color: 'red' },
  { label: 'Charles', value: 13, color: 'orange' },
  { label: 'Mary', value: 29, color: 'yellow' },
];

ReactDOM.render(
  <React.StrictMode>
    <div className="container">
      <App
        data={data}
        showLabels={true}
        showCounts={true}
        clickableBars={true}
        countsAlign={'right'}
        animationDuration={500}
      />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
