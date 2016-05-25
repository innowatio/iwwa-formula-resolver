import "babel-polyfill";

import {expect} from "chai";

import {evaluateFormula} from "index";

describe("`evaluateFormula` function", () => {
    it("return the correct arrays of results", async () => {
        const formula = {
            formula: "(x+y+z)/2"
        };
        const sensorsData = [{
            sensorId: "x",
            measurementValues: "1,2,3,4,5,6,7,9,10",
            measurementTimes: "1453939200000,1453939500000,1453939800000,1453940100000,1453940400000,1453940700000,1453941000000,1453941300000,1453941600000"
        }, {
            sensorId: "y",
            measurementValues: "2,3,4,5,6,7,9,10",
            measurementTimes: "1453939500000,1453939800000,1453940100000,1453940400000,1453940700000,1453941000000,1453941300000,1453941600000"
        }, {
            sensorId: "z",
            measurementValues: "0,0,0,0,0,0,0,10",
            measurementTimes: "1453939500000,1453939800000,1453940100000,1453940400000,1453940700000,1453941000000,1453941300000,1453941600000"
        }];
        const expected = {
            measurementValues: "2,3,4,5,6,7,9,15",
            measurementTimes: "1453939500000,1453939800000,1453940100000,1453940400000,1453940700000,1453941000000,1453941300000,1453941600000"
        };
        const result = evaluateFormula(formula, sensorsData);
        expect(result).to.deep.equal(expected);
    });
});