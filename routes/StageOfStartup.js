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


router.post("/auth/create/StageOfStartup", catchAsync(createStageOfStartup));

router.get("/auth/list/StageOfStartup", catchAsync(listStageOfStartup));

router.get("/auth/get/StageOfStartup/:_id", catchAsync(getStageOfStartup));

router.put(
  "/auth/update/StageOfStartup/:_id",
  catchAsync(updateStageOfStartup)
);

router.delete(
  "/auth/remove/StageOfStartup/:_id",
  catchAsync(removeStageOfStartup)
);

router.post("/auth/listByparams/StageOfStartup", catchAsync(listStageOfStartupByParams));

router.get("/auth/get/list/StageOfStartup" , catchAsync(listActiveStageOfStartup));

module.exports = router;
