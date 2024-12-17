const express = require("express");
const router = express.Router();
const sinkController = require("../controller/sink");
const existingSinkController = require("../controller/sink");
const renwableController = require("../controller/sink");
const Evemission=require("../controller/evCalculationscontroller")
const requiredland=require('../controller/landRequiredController')

// Route for creating a carbon sink
router.post("/sinks", sinkController.createSink);
router.post("/existing-sinks", existingSinkController.createExistingSink);
router.post("/renewable",renwableController.calculateRenewableImpact)
router.post("/ccs",sinkController.calculateCCS)
router.post("/mcs",sinkController.calculateMCS)
router.post("/ev",Evemission.calculateEmissionSavings)
router.post("/requiredland",requiredland.calculateCarbonSinkLand)

module.exports = router;
