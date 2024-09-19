const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
    createAwardVoting,
    listAwardVoting,
    listAwardVotingByParams,
    getAwardVoting,
    updateAwardVoting,
    removeAwardVoting,
    sendOTP,
    resendOtp,
    verifyOTP,
} = require("../controllers/Master/AwardVoting");
router.post("/auth/create/AwardVoting", catchAsync(createAwardVoting));

router.get("/auth/list/AwardVoting", catchAsync(listAwardVoting));


router.post(
    "/auth/list-by-params/AwardVoting",
    catchAsync(listAwardVotingByParams)
);

router.get("/auth/get/AwardVoting/:_id", catchAsync(getAwardVoting));

router.put(
    "/auth/update/AwardVoting/:_id",
    catchAsync(updateAwardVoting)
);

router.delete(
    "/auth/remove/AwardVoting/:_id",
    catchAsync(removeAwardVoting)
);

router.post("/auth/send-otp/AwardVoting", catchAsync(sendOTP));

router.post("/auth/resend-otp/AwardVoting", catchAsync(resendOtp));

router.post("/auth/verify-otp/AwardVoting", catchAsync(verifyOTP));

module.exports = router;
