const express = require("express");
const path= require('path')
const fs= require('fs')

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createStartUpDetailsMaster,
  listStartUpDetailsMaster,
  listStartUpDetailsMasterByParams,
  getStartUpDetailsMaster,
  updateStartUpDetailsMaster,
  removeStartUpDetailsMaster,
  userLoginAdmin,
  sendOTPEmail
} = require("../controllers/Master/Startup");
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
router.post("/auth/create/StartUpDetailsMaster", upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'brochure', maxCount: 1 },
  { name: 'productImages', maxCount: 1 },
]), catchAsync(createStartUpDetailsMaster));

router.get("/auth/list/StartUpDetailsMaster", catchAsync(listStartUpDetailsMaster));

router.post("/auth/listByparams/StartUpDetailsMaster", catchAsync(listStartUpDetailsMasterByParams));

router.get("/auth/get/StartUpDetailsMaster/:_id", catchAsync(getStartUpDetailsMaster));

router.put("/auth/update/StartUpDetailsMaster/:_id",upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'brochure', maxCount: 1 },
  { name: 'productImages', maxCount: 1 }]), catchAsync(updateStartUpDetailsMaster));

router.delete("/auth/remove/StartUpDetailsMaster/:_id", catchAsync(removeStartUpDetailsMaster));

router.post("/adminLogin", catchAsync(userLoginAdmin));

router.post("/sendOTPEmail", catchAsync(sendOTPEmail));

module.exports = router;
