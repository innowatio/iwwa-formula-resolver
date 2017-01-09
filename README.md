[![npm version](https://badge.fury.io/js/iwwa-formula-resolver.svg)](https://badge.fury.io/js/iwwa-formula-resolver)
[![Build Status](https://travis-ci.org/innowatio/iwwa-formula-resolver.svg?branch=master)](https://travis-ci.org/innowatio/iwwa-formula-resolver)
[![codecov](https://codecov.io/gh/innowatio/iwwa-formula-resolver/branch/master/graph/badge.svg)](https://codecov.io/gh/innowatio/iwwa-formula-resolver)
[![Dependency Status](https://david-dm.org/innowatio/iwwa-formula-resolver.svg)](https://david-dm.org/innowatio/iwwa-formula-resolver)
[![devDependency Status](https://david-dm.org/innowatio/iwwa-formula-resolver/dev-status.svg)](https://david-dm.org/innowatio/iwwa-formula-resolver#info=devDependencies)

Utility lib for resolving virtual sensor's formulas.

## Installation
```bash
npm install iwwa-formula-resolver --save
```
## Usage

### evaluateFormula

```js
import {evaluateFormula} from "iwwa-formula-resolver";

const result = evaluateFormula(formula, sensorsData, measurementDelta);
```

###### formula
Object containing the formula to be resolved, aka:
```js
{
    formula: "(x+y+z)/2"
}
```

###### sensorsData
An array containing all objects data to be evaluated within the formula, aka:
```js
[{
    symbol: "x",
    measurementValues: "1,2,3,4,5,6,7,9,10",
    measurementTimes: "1453939200000,1453939500000,1453939800000,1453940100000,1453940400000,1453940700000,1453941000000,1453941300000,1453941600000"
}, ... ]
```

###### measurementDelta
Measurement sample delta (not mandatory, if not specified 300000)

### decomposeFormula

```js
import {decomposeFormula} from "iwwa-formula-resolver";

const result = decomposeFormula(formula, sensorsData, measurementDelta);
```

###### formula
Object containing the formula to be decomposed, aka:
```js
{
    formula: "(x-y-z)^3.2*x/totalizator(y)"
}
```

###### sensorsData
An array containing all objects id to be decomposed within the formula, aka:
```js
[{
    symbol: "x"
}, {
    symbol: "y"
}, ... ]
```

## Custom operators
Following custom operators are provided:
- totalizator: returns the difference with the previous available value
- time shift: returns the value in the moment specified by the shifter

#### usage
```js
import {
    A_1D_FORWARD_SHIFT,
    TOTALIZATOR
} from "iwwa-formula-resolver";

const formula = TOTALIZATOR + "(sensorX)*" + A_1D_FORWARD_SHIFT + "(sensorY)";
const result = evaluateFormula(formula, sensorsData, measurementDelta);
```
