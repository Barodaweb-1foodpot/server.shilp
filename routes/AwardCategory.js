const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
    createAwardCategory,
    listAwardCategory,
    listAwardCategoryByParams,
    getAwardCategory,
    updateAwardCategory,
    removeAwardCategory,
    listActiveAwardCategory,
} = require("../controllers/Category/AwardCategory");

router.post("/auth/create/AwardCategory", catchAsync(createAwardCategory));

router.get("/auth/list/AwardCategory", catchAsync(listAwardCategory));

router.get(
  "/auth/list-active/AwardCategory",
  catchAsync(listActiveAwardCategory)
);

router.post(
  "/auth/list-by-params/AwardCategory",
  catchAsync(listAwardCategoryByParams)
);

router.get("/auth/get/AwardCategory/:_id", catchAsync(getAwardCategory));

router.put(
  "/auth/update/AwardCategory/:_id",
  catchAsync(updateAwardCategory)
);

router.delete(
  "/auth/remove/AwardCategory/:_id",
  catchAsync(removeAwardCategory)
);



module.exports = router;
