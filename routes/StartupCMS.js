const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

const {
  listContent,
  listContByParams,
  createContent,
  getContent,
  removeContent,
  updateContent,
  getContentByUrl,
  createimageurl,
  getContentByStartUp
} = require("../controllers/StartupCMS/StartupCMS");
const catchAsync = require("../utils/catchAsync");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cmscontentImages");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
  },
});
const upload = multer({ storage: multerStorage });

router.get("/auth/startup-cms/list-content", catchAsync(listContent));

router.post("/auth/startup-cms/list-content-by-params", catchAsync(listContByParams));

router.post("/auth/startup-cms/create-content", catchAsync(createContent));

router.get("/auth/startup-cms/get-content/:_id", catchAsync(getContent));

router.delete("/auth/startup-cms/remove-content/:_id", catchAsync(removeContent));

router.put("/auth/startup-cms/content-update/:_id", catchAsync(updateContent));

//upload images
router.post(
  "/auth/startup-cms/image-upload",
  upload.single("uploadImg"),
  async (req, res) => {
    console.log(req.file.filename);
    res.json({ url: req.file.filename });
  }
);


router.get("/auth/startup-cms/get-contentByUrl/:_url", catchAsync(getContentByUrl));

router.get("/auth/startup-cms/get-cms-by-startup/:_id", catchAsync(getContentByStartUp));


//get imiage url

module.exports = router;
