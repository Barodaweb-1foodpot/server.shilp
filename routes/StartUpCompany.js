const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
    createStartUpCompany,
    listStartUpCompany,
    listStartUpCompanyByParams,
  getStartUpCompany,
  updateStartUpCompany,
  removeStartUpCompany
} = require("../controllers/StartUpCompany/StartUpCompany");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/StartUpCompany");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });
router.post("/auth/create/StartUpCompany",upload.single("bannerImage"), catchAsync(createStartUpCompany));

router.get("/auth/list/StartUpCompany", catchAsync(listStartUpCompany));

router.post("/auth/listByparams/StartUpCompany", catchAsync(listStartUpCompanyByParams));

router.get("/auth/get/StartUpCompany/:_id", catchAsync(getStartUpCompany));

router.put("/auth/update/StartUpCompany/:_id",upload.single("bannerImage"), catchAsync(updateStartUpCompany));

router.delete("/auth/remove/StartUpCompany/:_id", catchAsync(removeStartUpCompany));


module.exports = router;
