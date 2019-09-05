import ReactDOM from 'react-dom';
import React from 'react';
import Dropdown from './Dropdown';

const options = [
    {label: 'Argentina', value: 0},
    {label: 'Australia', value: 1},
    {label: 'Brazil', value: 2},
    {label: 'Bolivia', value: 3},
    {label: 'Botswana', value: 4, isActive: true},
    {label: 'Germany', value: 5},
    {label: 'Italy', value: 6},
    {label: 'Spain', value: 7},
    {label: 'San Marino', value: 8},
    {label: 'Uruguay', value: 9},
    {label: 'United States of America', value: 10},
    {label: 'Venezuela', value: 11}
];

ReactDOM.render(
    <Dropdown
      id="demo1"
      label="Select an option"
      options={options}
      onSelect={o => console.log(o)}
    />,
    document.getElementById('dropdown')
);
