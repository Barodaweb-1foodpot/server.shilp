const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createParticipantCategoryMaster, listParticipantCategoryMaster, listParticipantCategoryMasterByParams, getParticipantCategoryMaster, updateParticipantCategoryMaster, removeParticipantCategoryMaster } = require("../controllers/Category/ParticipantCategory");

router.post("/auth/create/participantCategoryMaster", catchAsync(createParticipantCategoryMaster));

router.get("/auth/list/participantCategoryMaster", catchAsync(listParticipantCategoryMaster));

router.post(
    "/auth/list-by-params/participantCategoryMaster",
    catchAsync(listParticipantCategoryMasterByParams)
);

router.get("/auth/get/participantCategoryMaster/:_id", catchAsync(getParticipantCategoryMaster));

router.put(
    "/auth/update/participantCategoryMaster/:_id",
    catchAsync(updateParticipantCategoryMaster)
);

router.delete(
    "/auth/remove/participantCategoryMaster/:_id",
    catchAsync(removeParticipantCategoryMaster)
);

module.exports = router;
