const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createInvestor, listInvestor, listInvestorByParams, getInvestor, updateInvestor, removeInvestor } = require("../controllers/Master/Investor");

router.post("/auth/investor", catchAsync(createInvestor));
router.get("/auth/list/investor", catchAsync(listInvestor));

router.post(
    "/auth/list-by-params/investor",
    catchAsync(listInvestorByParams)
);

router.get("/auth/get/investor/:_id", catchAsync(getInvestor));

router.put(
    "/auth/update/investor/:_id",
    catchAsync(updateInvestor)
);

router.delete(
    "/auth/remove/investor/:_id",
    catchAsync(removeInvestor)
);


module.exports = router;