const express = require("express");
const router = express.Router();
const electricityController = require("../controller/Emission");
const fuelCombustionController = require("../controller/Emission");
const shippingController = require("../controller/Emission");
const explosionController = require("../controller/Emission");
const methaneController = require("../controller/methaneController");


// Route to handle electricity consumption calculation
router.get("/electricity-consumption", electricityController.getElectricityConsumption);
router.get("/fuel-combustion", fuelCombustionController.getFuelCombustion);
router.post("/shipping-emissions", shippingController.calculateShippingEmissions);
router.post("/explosion-emissions", explosionController.calculateExplosionEmissions);
router.post("/coal-emission",electricityController.coalEmission);
router.post("/methane-emission",methaneController.calculateEmissions);


module.exports = router;
