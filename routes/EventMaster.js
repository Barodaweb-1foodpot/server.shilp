const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createEventMaster, listEventMaster, listEventMasterByParams, getEventMaster, updateEventMaster, removeEventMaster } = require("../controllers/Master/EventMaster");

router.post("/auth/eventMaster", catchAsync(createEventMaster));
router.get("/auth/list/eventMaster", catchAsync(listEventMaster));

router.post(
    "/auth/list-by-params/eventMaster",
    catchAsync(listEventMasterByParams)
);

router.get("/auth/get/eventMaster/:_id", catchAsync(getEventMaster));

router.put(
    "/auth/update/eventMaster/:_id",
    catchAsync(updateEventMaster)
);

router.delete(
    "/auth/remove/eventMaster/:_id",
    catchAsync(removeEventMaster)
);


module.exports = router;