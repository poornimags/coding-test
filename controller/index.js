const express = require('express');
const handler = require('./handler');

const router = express.Router();

// Substituted the values with reference data with 2 methods
router.post('/method1', handler.getTransformedMethod1)
router.post('/method2', handler.getTransformedMethod2);

module.exports = router;