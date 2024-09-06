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
  createimageurl
} = require("../controllers/CMS/cmsContent");
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

router.get("/auth/cms/list-content", catchAsync(listContent));

router.post("/auth/cms/list-content-by-params", catchAsync(listContByParams));

router.post("/auth/cms/create-content", catchAsync(createContent));

router.get("/auth/cms/get-content/:_id", catchAsync(getContent));

router.delete("/auth/cms/remove-content/:_id", catchAsync(removeContent));

router.put("/auth/cms/content-update/:_id", catchAsync(updateContent));

//upload images
router.post(
  "/auth/cms/image-upload",
  upload.single("uploadImg"),
  async (req, res) => {
    console.log(req.file.filename);
    res.json({ url: req.file.filename });
  }
);


router.get("/auth/cms/get-contentByUrl/:_url", catchAsync(getContentByUrl));

//get imiage url
router.post(
  "/auth/create/createimageurl",
  upload.single("myFile"),
  catchAsync(createimageurl)
);

module.exports = router;
