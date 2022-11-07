const express = require('express');
const router = express.Router();
const inverterController = require('../controllers/inverter-controller');

//get brand list as per skutype
router.get('/brand/:skuType', inverterController.getBrandDetails);


//get capacity of inverter as per brand ID and skuType
router.get('/capacity/:skuType/:brandID', inverterController.getCapacityDetails);

module.exports = router;