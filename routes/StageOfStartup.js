const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createStageOfStartup,
    listStageOfStartup,
    listStageOfStartupByParams,
    getStageOfStartup,
    updateStageOfStartup,
    removeStageOfStartup,
    listActiveStageOfStartup,
} = require("../controllers/Master/StageOfStartup");


router.post("/auth/create/categoryMaster", catchAsync(createStageOfStartup));

router.get("/auth/list/categoryMaster", catchAsync(listStageOfStartup));

router.get("/auth/get/categoryMaster/:_id", catchAsync(getStageOfStartup));

router.put(
  "/auth/update/categoryMaster/:_id",
  catchAsync(updateStageOfStartup)
);

router.delete(
  "/auth/remove/categoryMaster/:_id",
  catchAsync(removeStageOfStartup)
);

router.get("/auth/get/list/ActiveCategories" , catchAsync(listActiveStageOfStartup));

module.exports = router;
