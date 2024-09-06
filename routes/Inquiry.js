const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
    createInquiry,
    listInquiry,
    listInquiryByParams,
  getInquiry,
} = require("../controllers/Inquiry/Inquiry");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/userImages");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });


router.post("/auth/create/Inquiry", catchAsync(createInquiry));

router.get("/auth/list/Inquiry", catchAsync(listInquiry));

router.post("/auth/listByparams/Inquiry", catchAsync(listInquiryByParams));

router.get("/auth/get/Inquiry/:_id", catchAsync(getInquiry));

module.exports = router;
