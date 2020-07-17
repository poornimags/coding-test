/*
* Post Method 1 / This method is to replace the reference data with the values 
* from reference object using the valueType
*/
exports.getTransformedMethod1 = async (req, res) => {
    const { payload, referenceData } = req.body;

    if (!payload) return res.status(400).json('Payload is required');
    if (!referenceData) return res.status(400).json('Reference Data is required');

    valueLoop(payload.value, referenceData);
    return res.status(200).json(payload);
}

// Loop value and if value type is string then replace the string with reference date
const valueLoop = (value, refData) => {
    for (let ele of value) {
        if (ele.valueType === 'string') {
            ele.value = valueReferenceReplace(ele.value, refData);
        } else if (ele.valueType === 'array') {
            valueLoop(ele.value, refData);
        }
    }
}

// Replace the string with reference data if value contains 'REF_*'.
const valueReferenceReplace = (value, referenceData) => {
    Object.keys(referenceData).forEach(key => {
        value = value.replace(`{${key}}`, referenceData[key]);
    })
    return value;
}

/*
* Post Method 2 / This method is to replace the reference data with the values 
* from reference object without using the valueType
*/
exports.getTransformedMethod2 = async (req, res) => {
    const { payload, referenceData } = req.body;

    if (!payload) return res.status(400).json('Payload is required');
    if (!referenceData) return res.status(400).json('Reference Data is required');

    // const result = data.map;
    for (let prop in payload) {
        if (typeof (payload[prop]) === 'object') {
            valueArrayLoop(payload[prop], referenceData);
        } else {
            payload[prop] = valueReferenceReplace(payload[prop], referenceData);
        }
    }

    return res.status(200).json(payload);
}

// Looping the arrays
const valueArrayLoop = (data, referenceData) => {
    for (let ele of data) {
        for (let prop in ele) {
            if (typeof (ele[prop]) === 'object') {
                valueArrayLoop(ele[prop], referenceData);
            } else {
                ele[prop] = valueReferenceReplace(ele[prop], referenceData);
            }
        }
    }
}