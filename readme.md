## Actually accessible react dropdown

A fully [WCAG2.1](https://www.w3.org/WAI/WCAG21/Understanding/) compliant dropdown component.

This includes full keyboard support and will work with the following screen reader pairings:
* Chrome/Windows + Jaws
* Safari/OSX + Voice over

The behaviour in other pairings is not catered for so may or may not function as expected. In general however, testing with NVDA has also yielded good results.

### Installation
```npm i actually-accessible-react-dropdown --save```

### Usage

```
import ReactDOM from 'react-dom';
import React from 'react';
import Dropdown from 'actually-accessible-react-dropdown';

const options = [
    {label: 'Argentina', value: 0},
    {label: 'Australia', value: 1},
    {label: 'Brazil', value: 2},
    {label: 'Bolivia', value: 3, isActive: true},
    {label: 'Botswana', value: 4},
    {label: 'Germany', value: 5},
    {label: 'Italy', value: 6},
    {label: 'Spain', value: 7},
    {label: 'San Marino', value: 8},
    {label: 'Uruguay', value: 9},
    {label: 'The wonderful United States of America', value: 10},
    {label: 'Venezuela', value: 11}
];

ReactDOM.render(
  <Dropdown
    id="demo1"
    label="Select an option"
    placeholder="Please choose a country"
    options={options}
    onSelect={o => console.log(o)}
  />,
  document.getElementById('dropdown')
);
```

### Props
**id** `required` - Unique control identifier

**label** `optional` - Control label

**placeholder** `optional` - Display when there is no active selection

**options** `required` - An array or label/value pairs. One item may have an `isActive` key to identify a selected value

**onSelect** `required` - A function called when a selection is made. The label/value will be passed back as the only parameter

