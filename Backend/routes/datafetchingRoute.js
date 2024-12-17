const express = require("express");
const router = express.Router();
const datafetching=require("../controller/datafetching")

router.get('/data/:date',datafetching.fetchDateData)
router.get('/data/:startDate/:endDate',datafetching.fetchDateRangeData)
router.delete('/delete/:id',datafetching.deleteById)


module.exports = router;
