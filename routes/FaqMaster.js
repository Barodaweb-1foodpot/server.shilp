const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createFaqMaster,
    listFaqMaster,
    listFaqMasterByParams,
    getFaqMaster,
    updateFaqMaster,
    removeFaqMaster,
    listActiveFaqMaster,
} = require("../controllers/FaqMaster/FaqMaster");


router.post("/auth/create/FaqMaster", catchAsync(createFaqMaster));

router.get("/auth/list/FaqMaster", catchAsync(listFaqMaster));

router.get("/auth/get/FaqMaster/:_id", catchAsync(getFaqMaster));

router.put(
  "/auth/update/FaqMaster/:_id",
  catchAsync(updateFaqMaster)
);

router.delete(
  "/auth/remove/FaqMaster/:_id",
  catchAsync(removeFaqMaster)
);

router.post("/auth/listByparams/FaqMaster", catchAsync(listFaqMasterByParams));

router.get("/auth/get/list/FaqMaster" , catchAsync(listActiveFaqMaster));

module.exports = router;
