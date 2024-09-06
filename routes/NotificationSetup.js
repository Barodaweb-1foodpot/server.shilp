const express = require("express");
const catchAsync = require("../utils/catchAsync");
const {
  createNotificationSetup,
  updateNotificationSetup,
  removeNotificationSetup,
  listNotificationSetupByParams,
  listNotificationSetup,
  getNotificationSetup,
  getSetupByName,
  sendEmailNotificationSetup,
} = require("../controllers/Notifications/NotificationSetup");

const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/NotificationSetup");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage: multerStorage });
router.post(
  "/auth/upload/notificationSetup",
  upload.single("uploadImg"),
  async (req, res) => {
    console.log(req.file.filename);
    res.json({ url: req.file.filename });
  }
);

router.post(
  "/auth/create/notificationSetup",
  catchAsync(createNotificationSetup)
);

router.get(
  "/auth/get/notification-setup-name/:formname",
  catchAsync(getSetupByName)
);

router.put(
  "/auth/update/notificationSetup/:_id",
  catchAsync(updateNotificationSetup)
);
router.delete(
  "/auth/remove/notificationSetup/:_id",
  catchAsync(removeNotificationSetup)
);

router.post(
  "/auth/list-by-params/notificationSetup",
  catchAsync(listNotificationSetupByParams)
);
router.get(
  "/auth/list/notificationSetup/:_id",
  catchAsync(listNotificationSetup)
);

router.get(
  "/auth/get/notificationSetup/:_id",
  catchAsync(getNotificationSetup)
);

router.get(
  "/auth/get/notificationSetup/send-email/:_id",
  catchAsync(sendEmailNotificationSetup)
);
module.exports = router;
