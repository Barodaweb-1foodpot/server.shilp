const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createVisitor, listVisitor, listVisitorByParams, getVisitor, updateVisitor, removeVisitor } = require("../controllers/Master/Visitor");

router.post("/auth/visitor", catchAsync(createVisitor));
router.get("/auth/list/visitor", catchAsync(listVisitor));

router.post(
    "/auth/list-by-params/visitor",
    catchAsync(listVisitorByParams)
);

router.get("/auth/get/visitor/:_id", catchAsync(getVisitor));

router.put(
    "/auth/update/visitor/:_id",
    catchAsync(updateVisitor)
);

router.delete(
    "/auth/remove/visitor/:_id",
    catchAsync(removeVisitor)
);


module.exports = router;