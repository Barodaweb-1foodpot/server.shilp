const express = require("express");
const multer = require("multer");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  listApplications,
  uplodaImages,
  createApplications,
  updateApplications,
  getApplication,
  listApprovedByParams,
  listApplicationsByParams,
  createApplicationsByFrontend
} = require("../controllers/Applications/Applications");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/applications");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: multerStorage });

router.get("/auth/list/applications", catchAsync(listApplications));
router.post(
  "/auth/upload/applications",
  upload.single("file"),
  catchAsync(uplodaImages)
);
router.post("/auth/create/applications", catchAsync(createApplications));
router.post(
  "/auth/list-by-params/applications",
  catchAsync(listApplicationsByParams)
);

router.post(
    "/auth/list-by-params/approved",
    catchAsync(listApprovedByParams)
  );
router.put("/auth/update/applications/:_id", catchAsync(updateApplications));
router.get("/auth/get/applications/:_id", catchAsync(getApplication));
router.post("/auth/create/applicationsByFrontend",
  upload.fields([
    { name: 'incomeCertificate', maxCount: 1 },
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'studentAadharCard', maxCount: 1 },
    { name: 'parentAadharCard', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'sscMarksheet', maxCount: 1 },
    { name: 'schoolLeavingCertificate', maxCount: 1 },
    { name: 'itReturn', maxCount: 1 },
    { name: 'deathCertificate', maxCount: 1 },
    { name: 'recommendationLetter', maxCount: 1 }
  ]),
  catchAsync(createApplicationsByFrontend)
);
module.exports = router;
