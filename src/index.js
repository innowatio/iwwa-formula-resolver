import flattendeep from "lodash.flattendeep"; 
import uniq from "lodash.uniq";

import {parse} from "mathjs";

import {
    loadCustomOperators,
    SHIFT_OPERATOR_SUFFIX,
    A_1Y_FORWARD_SHIFT,
    A_1M_FORWARD_SHIFT,
    A_1W_FORWARD_SHIFT,
    A_1D_FORWARD_SHIFT,
    A_15MIN_FORWARD_SHIFT,
    A_1Y_BACKWARD_SHIFT,
    A_1M_BACKWARD_SHIFT,
    A_1W_BACKWARD_SHIFT,
    A_1D_BACKWARD_SHIFT,
    A_15MIN_BACKWARD_SHIFT,
    TOTALIZATOR
} from "./custom-operators";

export {
    A_1Y_FORWARD_SHIFT,
    A_1M_FORWARD_SHIFT,
    A_1W_FORWARD_SHIFT,
    A_1D_FORWARD_SHIFT,
    A_15MIN_FORWARD_SHIFT,
    A_1Y_BACKWARD_SHIFT,
    A_1M_BACKWARD_SHIFT,
    A_1W_BACKWARD_SHIFT,
    A_1D_BACKWARD_SHIFT,
    A_15MIN_BACKWARD_SHIFT,
    TOTALIZATOR
};

export function evaluateFormula (virtualSensor, sensorsData, measurementDelta = 300000) {
    loadCustomOperators();
    const cleanedSensors = getCleanedSensors(sensorsData);
    const formulaCleaner = (prev, sensor) => {
        return prev
            .replace(new RegExp(SHIFT_OPERATOR_SUFFIX + "\\(", "g"), SHIFT_OPERATOR_SUFFIX + "(measurements,valTime,")
            .replace(new RegExp(TOTALIZATOR + "\\(", "g"), TOTALIZATOR + "(measurements,valTime,")
            .replace(new RegExp(sensor.oldSensorId, "g"), sensor.sensorId)
            .replace(new RegExp("measurements,valTime,"+sensor.sensorId, "g"),
                sensor.sensorId + "_measurements," + sensor.sensorId + "_valTime," + sensor.sensorId);
    };
    const cleanedFormula = getCleanedFormula(cleanedSensors, virtualSensor, formulaCleaner);
    const formula = parse(cleanedFormula).compile();
    const measurements = timestampFlatten(processSensorData(cleanedSensors, measurementDelta));
    const timestamps = uniq(measurements.map(x => x.measurementTime));

    const virtualMeasurements = timestamps.reduce((prev, timestamp) => {
        const filtered = measurements
            .filter(x => x.measurementTime === timestamp)
            .reduce((prev, current) => {
                prev[current.sensorId] = current.measurementValue;
                if (cleanedFormula.indexOf("_measurements") > 0) {
                    prev[current.sensorId + "_measurements"] = measurements;
                    prev[current.sensorId + "_valTime"] = timestamp;
                }
                return prev;
            }, {});
        try {
            console.log({
                formula: cleanedFormula,
                var: filtered
            });
            const result = formula.eval(filtered);
            return {
                measurementValues: [...prev.measurementValues, result],
                measurementTimes: [...prev.measurementTimes, timestamp]
            };
        } catch (error) {
            console.log("Error while parsing formula, skipping measurement");
            console.log(error);
        }
        return {
            measurementValues: [...prev.measurementValues],
            measurementTimes: [...prev.measurementTimes]
        };
    }, {
        measurementValues: [],
        measurementTimes: []
    });

    return {
        measurementValues: virtualMeasurements.measurementValues.join(","),
        measurementTimes: virtualMeasurements.measurementTimes.join(",")
    };
}

export function decomposeFormula (virtualSensor, sensorsData, formulaCleaner = (prev, sensor) => {
    return prev.replace(new RegExp(sensor.oldSensorId, "g"), sensor.sensorId);
}) {
    const cleanedSensors = getCleanedSensors(sensorsData);
    const cleanedFormula = getCleanedFormula(cleanedSensors, virtualSensor, formulaCleaner);
    let items = [];
    decomposeParsedFormula(parse(cleanedFormula), items);
    cleanedSensors.forEach(sensor => {
        var idx = items.indexOf(sensor.sensorId);
        while (idx !== -1) {
            items[idx] = sensor.oldSensorId;
            idx = items.indexOf(sensor.sensorId);
        }
    });
    return items;
}

function decomposeParsedFormula (node, items) {
    if (node.isOperatorNode) {
        decomposeParsedFormula(node.args[0], items);
        items.push(node.op);
        decomposeParsedFormula(node.args[1], items);
    }
    if (node.isParenthesisNode) {
        items.push("(");
        decomposeParsedFormula(node.content, items);
        items.push(")");
    }
    if (node.isFunctionNode) {
        items.push(node.name);
        items.push("(");
        node.args.forEach(arg => decomposeParsedFormula(arg, items));
        items.push(")");
    }
    if (node.isSymbolNode) {
        items.push(node.name)
    }
    if (node.isConstantNode) {
        items.push(node.value)
    }
}

function getCleanedSensors (sensorsData) {
    return sensorsData
        .sort((a, b) => b.sensorId.length - a.sensorId.length)
        .reduce((prev, sensor) => {
            console.log(sensor);
            return [...prev, {
                ...sensor,
                oldSensorId: sensor.sensorId,
                sensorId: randomString(8)
            }];
        }, []);
}

function getCleanedFormula (cleanedSensors, virtualSensor, formulaCleaner) {
    return cleanedSensors.reduce(formulaCleaner, virtualSensor.formula);
}

function processSensorData (sensorsData, measurementDelta) {
    return sensorsData.map(sensor => {
        const sensorSplitted = splitMeasurements(sensor, measurementDelta);
        return {
            ...sensorSplitted,
            measurements: sensorSplitted.measurementValues.reduce((prev, measurementValue, index) => {
                return [...prev, {
                    measurementValue,
                    measurementTime: sensorSplitted.measurementTimes[index]
                }];
            }, [])
        };
    });
}

function timestampFlatten (sensors) {
    return flattendeep(sensors.map((sensor) => {
        return sensor.measurements.map(measurement => {
            return {
                sensorId: sensor.sensorId,
                ...measurement
            };
        });
    }));
}

function splitMeasurements (sensor, measurementDelta) {
    return {
        ...sensor,
        measurementValues: sensor.measurementValues.split(",").map(x => parseFloat(x)),
        measurementTimes: normalizeTimestamps(sensor.measurementTimes.split(","), measurementDelta)
    };
}

function normalizeTimestamps (timestamps, measurementDelta) {
    return timestamps.map(timestamp => {
        return timestamp - (timestamp % measurementDelta);
    });
}

function randomString (len) {
    const charSet = "abcdefghijklmnopqrstuvwxyz";
    var randomString = "";
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz+1);
    }
    return randomString;
}