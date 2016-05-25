[![Build Status](https://travis-ci.org/innowatio/iwwa-formula-resolver.svg?branch=master)](https://travis-ci.org/innowatio/iwwa-formula-resolver)
[![codecov.io](https://codecov.io/github/innowatio/iwwa-formula-resolver/coverage.svg?branch=master)](https://codecov.io/github/iwwa-formula-resolver?branch=master)
[![Dependency Status](https://david-dm.org/innowatio/iwwa-formula-resolver.svg)](https://david-dm.org/innowatio/iwwa-formula-resolver)
[![devDependency Status](https://david-dm.org/innowatio/iwwa-formula-resolver/dev-status.svg)](https://david-dm.org/innowatio/iwwa-formula-resolver#info=devDependencies)


# Iwwa-formula-resolver

Utility lib for resolving virtual sensor's formulas.

## Installation
```bash
npm install iwwa-formula-resolver --save
```
## Usage

### evaluateFormula

```js
import {evaluateFormula} from "iwwa-formula-resolver";

const result = evaluateFormula(formula, sensorsData);
```

#### formula
##### object containing the formula to be resolved, data struct:
```js
{
    formula: "(x+y+z)/2"
}
```

#### sensorsData
##### an array containing all objects data to be evaluated within the formula
```js
[{
    sensorId: "x",
    measurementValues: "1,2,3,4,5,6,7,9,10",
    measurementTimes: "1453939200000,1453939500000,1453939800000,1453940100000,1453940400000,1453940700000,1453941000000,1453941300000,1453941600000"
}, ... ]
```