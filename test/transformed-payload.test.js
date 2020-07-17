const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const { json } = require('body-parser');

const { expect } = chai;

chai.use(chaiHttp);

const url = '/transformed-payload';
const payload = {
    name: 'subscriber',
    valueType: 'array',
    value: [
        {
            name: 'MN',
            valueType: 'string',
            value: '{REF_MSISDN}'
        },
        {
            name: 'IM',
            valueType: 'string',
            value: '{REF_IMSI}'
        },
        {
            name: 'NT',
            valueType: 'string',
            value: 'G'
        },
        {
            name: 'privateUser',
            valueType: 'array',
            value: [
                {
                    name: 'privateUserId',
                    valueType: 'string',
                    value: '{REF_IMSI}@ims.mnc001.mcc505.3gppnetwork.org'
                },
                {
                    name: 'roamingAllowed',
                    valueType: 'string',
                    value: 'false'
                },
                {
                    name: 'publicUser',
                    valueType: 'array',
                    value: [
                        {
                            name: 'publicIdValue',
                            valueType: 'string',
                            value: 'sip:{REF_IMSI}@ims.mnc001.mcc505.3gppnetwork.org'
                        },
                        {
                            name: 'implicitRegSet',
                            valueType: 'string',
                            value: '1'
                        },
                        {
                            name: 'serviceProfileId',
                            valueType: 'string',
                            value: '{REF_SERVPROFID}'
                        },
                        {
                            name: 'testUser',
                            valueType: 'array',
                            value: [
                                {
                                    name: 'testIdValue',
                                    valueType: 'string',
                                    value: 'sip:{REF_IMSI}@ims.mod-connect.com'
                                },
                                {
                                    name: 'implicitRegSet',
                                    valueType: 'string',
                                    value: '2'
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'userImsi',
                    valueType: 'string',
                    value: '{REF_IMSI}'
                }
            ]
        },
        {
            name: 'PO',
            valueType: 'string',
            value: '0'
        }
    ]
};

const validReferenceData = {
    REF_MSISDN: '0406679321',
    REF_IMSI: '50002312344314',
    REF_SERVPROFID: '2'
}

const invalidReferenceData = {
    REF_MS: '0406679321',
    REF_IM: '50002312344314',
    REF_SE: '2'
}
let result1 = {};
let result2 = {};

describe('Positive test case for Substituting the values in payload using referenceData', () => {
    /*
    * Test the POST route / Substituting the values using valueType
    */
    it('It should substitute the values with reference data using valueType', done => {
        chai
            .request(server)
            .post(`${url}/method1`)
            .send({
                payload,
                referenceData: validReferenceData
            })
            .end((err, res) => {
                result1 = JSON.stringify(res.body);
                expect(res.status).to.equal(200);
                expect(res.body).to.not.equal(0);
                done();
            })
    });

    /*
    * Test the POST route / Substituting the values without using valueType
    */
    it('It should substitute the values with reference data witout using valueType', done => {
        chai
            .request(server)
            .post(`${url}/method2`)
            .send({
                payload,
                referenceData: validReferenceData
            })
            .end((err, res) => {
                result2 = JSON.stringify(res.body);
                expect(res.status).to.equal(200);
                expect(res.body).to.not.equal(0);
                expect(result2).to.equal(result1);
                done();
            })
    });
});


describe('Negative test cases for substituting the values in payload using reference data', () => {

    /*
    * Test the POST route // Input json request is not passed
    */
    it('It should not substitute the payload values with reference data', done => {
        chai
            .request(server)
            .post(`${url}/method1`)
            .send({})
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.not.equal(0);
                done();
            })
    });

    /*
    * Test the POST route // Input json request is not passed
    */
    it('It should not substitute the payload values with reference data', done => {
        chai
            .request(server)
            .post(`${url}/method2`)
            .send({})
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.not.equal(0);
                done();
            })
    });

    /*
    * Test the POST route // Reference data object is not having the same keys available in payload 
    */
    it('It should not substitute the payload values with reference data', done => {
        chai
            .request(server)
            .post(`${url}/method1`)
            .send({
                payload,
                referenceData: invalidReferenceData
            })
            .end((err, res) => {
                result3 = JSON.stringify(res.body);
                expect(res.status).to.equal(200);
                expect(res.body).to.not.equal(0);
                expect(result3).to.not.equal(result1);
                done();
            })
    });
});