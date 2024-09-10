const express = require("express");

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
} = require("../controllers/Master/Startup");
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
router.post("/auth/create/StartUpDetailsMaster",upload.single("bannerImage"), catchAsync(createStartUpDetailsMaster));

router.get("/auth/list/StartUpDetailsMaster", catchAsync(listStartUpDetailsMaster));

router.post("/auth/listByparams/StartUpDetailsMaster", catchAsync(listStartUpDetailsMasterByParams));

router.get("/auth/get/StartUpDetailsMaster/:_id", catchAsync(getStartUpDetailsMaster));

router.put("/auth/update/StartUpDetailsMaster/:_id",upload.single("bannerImage"), catchAsync(updateStartUpDetailsMaster));

router.delete("/auth/remove/StartUpDetailsMaster/:_id", catchAsync(removeStartUpDetailsMaster));

router.post("/adminLogin", catchAsync(userLoginAdmin));

module.exports = router;
