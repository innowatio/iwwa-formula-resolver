import "babel-polyfill";

import {expect} from "chai";

import {evaluateFormula} from "index";

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