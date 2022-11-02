const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand-controller');

router.get('/brand/:skuType', brandController.getBrandDetails);

module.exports = router;