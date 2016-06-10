import math from "mathjs";
import R from "ramda";

export const TOTALIZATOR = "totalizator";
export const A_1Y_FORWARD_SHIFT = "a1yForwardShift";
export const A_1M_FORWARD_SHIFT = "a1mForwardShift";
export const A_1W_FORWARD_SHIFT = "a1wForwardShift";
export const A_1D_FORWARD_SHIFT = "a1dForwardShift";
export const A_15MIN_FORWARD_SHIFT = "a15minForwardShift";
export const A_1Y_BACKWARD_SHIFT = "a1yBackwardShift";
export const A_1M_BACKWARD_SHIFT = "a1mBackwardShift";
export const A_1W_BACKWARD_SHIFT = "a1wBackwardShift";
export const A_1D_BACKWARD_SHIFT = "a1dBackwardShift";
export const A_15MIN_BACKWARD_SHIFT = "a15minBackwardShift";

export const SHIFT_OPERATOR_SUFFIX = "wardShift";

function shiftTime (measurements, valTime, val, timeShifter) {
    let shiftedTime = valTime + timeShifter;
    let shiftedMeasurement = R.find(R.propEq("measurementTime", shiftedTime))(measurements);
    return shiftedMeasurement ? shiftedMeasurement.measurementValue : 0;
}

function totalizator (measurements, valTime, val) {
    let valIndex = R.findIndex(R.propEq("measurementTime", valTime))(measurements);
    let prevVal = measurements[valIndex - 1] ? measurements[valIndex - 1].measurementValue : 0;
    return val - prevVal;
}

let loaded = false;
export function loadCustomOperators () {
    if (!loaded) {
        let operators = {};
        operators[TOTALIZATOR] =              totalizator;
        operators[A_1Y_FORWARD_SHIFT] =       R.partialRight(shiftTime, [1000 * 60 * 60 * 24 * 365]);
        operators[A_1M_FORWARD_SHIFT] =       R.partialRight(shiftTime, [1000 * 60 * 60 * 24 * 30]);
        operators[A_1W_FORWARD_SHIFT] =       R.partialRight(shiftTime, [1000 * 60 * 60 * 24 * 7]);
        operators[A_1D_FORWARD_SHIFT] =       R.partialRight(shiftTime, [1000 * 60 * 60 * 24]);
        operators[A_15MIN_FORWARD_SHIFT] =    R.partialRight(shiftTime, [1000 * 60 * 15]);
        operators[A_1Y_BACKWARD_SHIFT] =      R.partialRight(shiftTime, [-(1000 * 60 * 60 * 24 * 365)]);
        operators[A_1M_BACKWARD_SHIFT] =      R.partialRight(shiftTime, [-(1000 * 60 * 60 * 24 * 30)]);
        operators[A_1W_BACKWARD_SHIFT] =      R.partialRight(shiftTime, [-(1000 * 60 * 60 * 24 * 7)]);
        operators[A_1D_BACKWARD_SHIFT] =      R.partialRight(shiftTime, [-(1000 * 60 * 60 * 24)]);
        operators[A_15MIN_BACKWARD_SHIFT] =   R.partialRight(shiftTime, [-(1000 * 60 * 15)]);
        math.import(operators);
        loaded = true;
    }
}

