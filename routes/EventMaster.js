const express = require("express");
const path= require('path')
const fs= require('fs')

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createEventMaster,
  listEventMaster,
  listEventMasterByParams,
  getEventMaster,
  updateEventMaster,
  removeEventMaster,
} = require("../controllers/Master/EventMaster");
const multer = require("multer");

const directories = ["uploads/StartUpCompany"];
directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/StartUpCompany");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});


const upload = multer({ storage: multerStorage });


router.post("/auth/eventMaster",upload.single("logo") , catchAsync(createEventMaster));
router.get("/auth/list/eventMaster", catchAsync(listEventMaster));

router.post(
  "/auth/list-by-params/eventMaster",
  catchAsync(listEventMasterByParams)
);

router.get("/auth/get/eventMaster/:_id", catchAsync(getEventMaster));

router.put("/auth/update/eventMaster/:_id",upload.single("logo"), catchAsync(updateEventMaster));

router.delete("/auth/remove/eventMaster/:_id", catchAsync(removeEventMaster));

module.exports = router;
