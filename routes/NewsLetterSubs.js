const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const {
  createNewsLetter,
  listNewsLetter,
  listNewsLetterByParams,
  getNewsLetter,
  updateNewsLetter,
  removeNewsLetter,
  getNewsLetterByEmail,
} = require("../controllers/Setup/NewsLetterSubs");

router.post("/auth/create/NewsLetter", catchAsync(createNewsLetter));

router.get("/auth/list/NewsLetter", catchAsync(listNewsLetter));

router.post("/auth/list-by-params/NewsLetter", catchAsync(listNewsLetterByParams));

router.get("/auth/get/NewsLetter/:_id", catchAsync(getNewsLetter));

router.put("/auth/update/NewsLetter/:_id", catchAsync(updateNewsLetter));

router.delete("/auth/remove/NewsLetter/:_id", catchAsync(removeNewsLetter));

router.get("/auth/get/NewsLetterByEmail/:email", catchAsync(getNewsLetterByEmail));

module.exports = router;
