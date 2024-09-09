const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createAdminUser,
  listAdminUser,
  listAdminUserByParams,
  getAdminUser,
  updateAdminUser,
  removeAdminUser,
  userLoginAdmin,
} = require("../controllers/Auth/User/AdminUsers");
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
router.post("/auth/create/adminUserMaster",upload.single("myFile"), catchAsync(createAdminUser));

router.get("/auth/list/adminUserMaster", catchAsync(listAdminUser));

router.post("/auth/listByparams/adminUserMaster", catchAsync(listAdminUserByParams));

router.get("/auth/get/adminUserMaster/:_id", catchAsync(getAdminUser));

router.put("/auth/update/adminUserMaster/:_id",upload.single("myFile"), catchAsync(updateAdminUser));

router.delete("/auth/remove/adminUserMaster/:_id", catchAsync(removeAdminUser));

router.post("/adminMasterLogin", catchAsync(userLoginAdmin));

module.exports = router;
