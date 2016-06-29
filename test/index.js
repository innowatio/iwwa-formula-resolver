import "babel-polyfill";

import {expect} from "chai";

import {evaluateFormula, decomposeFormula} from "index";

describe("`evaluateFormula` function", () => {
    it("return the correct arrays of results", async () => {
        const formula = {
            formula: "(x-1+y7yan-927h-ka+-----)/2"
        };
        const sensorsData = [{
            sensorId: "x-1",
            measurementValues: "1,2,3,4,5,6,7,9,10",
            measurementTimes: "1453939200000,1453939500000,1453939800000,1453940100000,1453940400000,1453940700000,1453941000000,1453941300000,1453941600000"
        }, {
            sensorId: "y7yan-927h-ka",
            measurementValues: "2,3,4,5,6,7,9,10",
            measurementTimes: "1453939500000,1453939800000,1453940100000,1453940400000,1453940700000,1453941000000,1453941300000,1453941600000"
        }, {
            sensorId: "-----",
            measurementValues: "0,0,0,0,0,0,0,10",
            measurementTimes: "1453939500000,1453939800000,1453940100000,1453940400000,1453940700000,1453941000000,1453941300000,1453941600000"
        }];
        const expected = {
            measurementValues: "2,3,4,5,6,7,9,15",
            measurementTimes: "1453939500000,1453939800000,1453940100000,1453940400000,1453940700000,1453941000000,1453941300000,1453941600000"
        };
        const result = await evaluateFormula(formula, sensorsData);
        expect(result).to.deep.equal(expected);
    });
});

describe("`evaluateFormula` function", () => {
    it("return the correct arrays of results with reused sensor", async () => {
        const formula = {
            formula: "((x-1+x-1-x-1)+y7yan-927h-ka+-----)/2"
        };
        const sensorsData = [{
            sensorId: "x-1",
            measurementValues: "1,2,3,4,5,6,7,9,10",
            measurementTimes: "1453939200000,1453939500000,1453939800000,1453940100000,1453940400000,1453940700000,1453941000000,1453941300000,1453941600000"
        }, {
            sensorId: "y7yan-927h-ka",
            measurementValues: "2,3,4,5,6,7,9,10",
            measurementTimes: "1453939500000,1453939800000,1453940100000,1453940400000,1453940700000,1453941000000,1453941300000,1453941600000"
        }, {
            sensorId: "-----",
            measurementValues: "0,0,0,0,0,0,0,10",
            measurementTimes: "1453939500000,1453939800000,1453940100000,1453940400000,1453940700000,1453941000000,1453941300000,1453941600000"
        }];
        const expected = {
            measurementValues: "2,3,4,5,6,7,9,15",
            measurementTimes: "1453939500000,1453939800000,1453940100000,1453940400000,1453940700000,1453941000000,1453941300000,1453941600000"
        };
        const result = await evaluateFormula(formula, sensorsData);
        expect(result).to.deep.equal(expected);
    });
});

describe("`evaluateFormula` function", () => {
    it("return the correct arrays of results with forward shift operator", async () => {
        const formula = {
            formula: "a1dForwardShift(sensor)"
        };
        const sensorsData = [{
            sensorId: "sensor",
            measurementValues: "1,2,3,4,5,6,7,9,10",
            measurementTimes: "1453939200000,1454025600000,1454112000000,1454198400000,1454284800000,1454371200000,1454457600000,1454544000000,1454630400000"
        }];
        const expected = {
            measurementValues: "2,3,4,5,6,7,9,10,0",
            measurementTimes: "1453939200000,1454025600000,1454112000000,1454198400000,1454284800000,1454371200000,1454457600000,1454544000000,1454630400000"
        };
        const result = await evaluateFormula(formula, sensorsData);
        expect(result).to.deep.equal(expected);
    });
});

describe("`evaluateFormula` function", () => {
    it("return the correct arrays of results with backward shift operator", async () => {
        const formula = {
            formula: "a1dBackwardShift(sensor)"
        };
        const sensorsData = [{
            sensorId: "sensor",
            measurementValues: "1,2,3,4,5,6,7,9,10",
            measurementTimes: "1453939200000,1454025600000,1454112000000,1454198400000,1454284800000,1454371200000,1454457600000,1454544000000,1454630400000"
        }];
        const expected = {
            measurementValues: "0,1,2,3,4,5,6,7,9",
            measurementTimes: "1453939200000,1454025600000,1454112000000,1454198400000,1454284800000,1454371200000,1454457600000,1454544000000,1454630400000"
        };
        const result = await evaluateFormula(formula, sensorsData);
        expect(result).to.deep.equal(expected);
    });
});

describe("`evaluateFormula` function", () => {
    it("return the correct arrays of results with mixed shift operators", async () => {
        const formula = {
            formula: "a1dForwardShift(sensor)+a1dBackwardShift(sensor)"
        };
        const sensorsData = [{
            sensorId: "sensor",
            measurementValues: "1,2,3,4,5,6,7,9,10",
            measurementTimes: "1453939200000,1454025600000,1454112000000,1454198400000,1454284800000,1454371200000,1454457600000,1454544000000,1454630400000"
        }];
        const expected = {
            measurementValues: "2,4,6,8,10,12,15,17,9",
            measurementTimes: "1453939200000,1454025600000,1454112000000,1454198400000,1454284800000,1454371200000,1454457600000,1454544000000,1454630400000"
        };
        const result = await evaluateFormula(formula, sensorsData);
        expect(result).to.deep.equal(expected);
    });
});

describe("`evaluateFormula` function", () => {
    it("return the correct arrays of results with totalizator operator", async () => {
        const formula = {
            formula: "totalizator(sensor)"
        };
        const sensorsData = [{
            sensorId: "sensor",
            measurementValues: "1,2,3,4,5,6,7,9,10",
            measurementTimes: "1453939200000,1454025600000,1454112000000,1454198400000,1454284800000,1454371200000,1454457600000,1454544000000,1454630400000"
        }];
        const expected = {
            measurementValues: "1,1,1,1,1,1,1,2,1",
            measurementTimes: "1453939200000,1454025600000,1454112000000,1454198400000,1454284800000,1454371200000,1454457600000,1454544000000,1454630400000"
        };
        const result = await evaluateFormula(formula, sensorsData);
        expect(result).to.deep.equal(expected);
    });
});

describe("`decomposeFormula` function", () => {
    it("return the parsed formula", async () => {
        const formula = {
            formula: "(sensor-34d-slki)^3.2*sensor/totalizator(34d-slki)"
        };
        const sensorsData = [{
            sensorId: "sensor",
            measurementValues: "1,2,3,4,5,6,7,9,10",
            measurementTimes: "1453939200000,1454025600000,1454112000000,1454198400000,1454284800000,1454371200000,1454457600000,1454544000000,1454630400000"
        }, {
            sensorId: "34d-slki",
            measurementValues: "1,2,3,4,5,6,7,9,10",
            measurementTimes: "1453939200000,1454025600000,1454112000000,1454198400000,1454284800000,1454371200000,1454457600000,1454544000000,1454630400000"
        }];
        const result = await decomposeFormula(formula, sensorsData);
        expect(result.reduce((prev, curr) => prev + curr)).to.deep.equal(formula.formula);
    });
});