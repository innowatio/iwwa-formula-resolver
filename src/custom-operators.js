import math from "mathjs";
import R from "ramda";

export const TOTALIZATOR = "TOTALIZATOR";
export const A_1Y_FORWARD_SHIFT = "A_1Y_FORWARD_SHIFT";
export const A_1M_FORWARD_SHIFT = "A_1M_FORWARD_SHIFT";
export const A_1W_FORWARD_SHIFT = "A_1W_FORWARD_SHIFT";
export const A_1D_FORWARD_SHIFT = "A_1D_FORWARD_SHIFT";
export const A_15MIN_FORWARD_SHIFT = "A_15MIN_FORWARD_SHIFT";
export const A_1Y_BACKWARD_SHIFT = "A_1Y_BACKWARD_SHIFT";
export const A_1M_BACKWARD_SHIFT = "A_1M_BACKWARD_SHIFT";
export const A_1W_BACKWARD_SHIFT = "A_1W_BACKWARD_SHIFT";
export const A_1D_BACKWARD_SHIFT = "A_1D_BACKWARD_SHIFT";
export const A_15MIN_BACKWARD_SHIFT = "A_15MIN_BACKWARD_SHIFT";

export const SHIFT_OPERATOR_SUFFIX = "WARD_SHIFT";

function shiftTime (measurements, valTime, val, timeShifter) {
    let shiftedTime = valTime + timeShifter;
    let shiftedMeasurement = R.find(R.propEq("measurementTime", shiftedTime))(measurements);
    return shiftedMeasurement ? shiftedMeasurement.measurementValue : 0;
}

function totalizator(measurements, valTime, val) {
    let valIndex = R.findIndex(R.propEq("measurementTime", valTime))(measurements);
    let prevVal = measurements[valIndex - 1] ? measurements[valIndex - 1].measurementValue : 0;
    return val - prevVal;
}

// TODO find a better way to import functions only the first time
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
        console.log(operators);
        math.import(operators);
        loaded = true;
    }
}

