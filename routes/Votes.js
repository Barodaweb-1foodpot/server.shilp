const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
    getVoter,
    createVoter,
    listVoter,
    listVoterByParams,
    countVoters
} = require("../controllers/Votes/Votes");
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

router.post("/auth/create/Voter", catchAsync(createVoter));

router.get("/auth/list/Voter", catchAsync(listVoter));

router.post("/auth/listByparams/Voter", catchAsync(listVoterByParams));

router.get("/auth/get/Voter/:_id", catchAsync(getVoter));

router.get("/auth/count/Voters", catchAsync(countVoters));

module.exports = router;
