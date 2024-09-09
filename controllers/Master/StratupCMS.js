const StartupCMS = require("../../models/Master/StartupCMS");
const fs = require("fs");

exports.listStartupCMS = async (req, res) => {
  const list = await StartupCMS.find().sort({ createdAt: -1 }).exec();

  res.json(list);
};

exports.listContByParams = async (req, res) => {
  let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

  let query = [
    {
      $match: { IsActive: IsActive },
    },
    {
      $facet: {
        stage1: [
          {
            $group: {
              _id: null,
              count: {
                $sum: 1,
              },
            },
          },
        ],
        stage2: [
          {
            $skip: skip,
          },
          {
            $limit: per_page,
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$stage1",
      },
    },
    {
      $project: {
        count: "$stage1.count",
        data: "$stage2",
      },
    },
  ];
  if (match) {
    query = [
      {
        $match: {
          $or: [
            {
              contentFor: { $regex: match, $options: "i" },
            },
          ],
        },
      },
    ].concat(query);
  }

  if (sorton && sortdir) {
    let sort = {};
    sort[sorton] = sortdir == "desc" ? -1 : 1;
    query = [
      {
        $sort: sort,
      },
    ].concat(query);
  } else {
    let sort = {};
    sort["createdAt"] = -1;
    query = [
      {
        $sort: sort,
      },
    ].concat(query);
  }

  const listStartupCMS = await StartupCMS.aggregate(query);

  res.json(listStartupCMS);
};

exports.createStartupCMS = async (req, res) => {
  try {
    const title = await StartupCMS.findOne({ contentFor: req.body.contentFor });
    console.log("rr", title);
    if (title) {
      return res.status(200).json({
        isOk: false,
        field: 1,
        message: "Title with this name already exists!",
      });
    } else {
      const addStartupCMS = await new StartupCMS(req.body).save();
      res.status(200).json({
        isOk: true,
        data: addStartupCMS,
      });
    }
  } catch (err) {
    console.log("Create StartupCMS error", err);
    return res.status(400).send(err);
  }
};

exports.getStartupCMS = async (req, res) => {
  const getStartupCMS = await StartupCMS.findOne({
    _id: req.params._id,
  }).exec();
  console.log("getStartupCMS", getStartupCMS);
  res.status(200).json(getStartupCMS);
};

exports.removeStartupCMS = async (req, res) => {
  try {
    const delStartupCMS = await StartupCMS.findOneAndRemove({
      _id: req.params._id,
    });
    console.log(delStartupCMS);
    res.status(200).json(delStartupCMS);
  } catch (err) {
    console.log("delete StartupCMS error", err);
    return res.status(400).send("delete StartupCMS failed");
  }
};

exports.updateStartupCMS = async (req, res) => {
  try {
    const update = await StartupCMS.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    console.log("edit version", update);
    res.status(200).json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("update StartupCMS failed");
  }
};


exports.getStartupCMSByUrl = async (req, res) => {
  const getStartupCMS = await StartupCMS.findOne({
    URL: req.params._url,
  }).exec();
  console.log("getStartupCMS", getStartupCMS);
  res.status(200).json(getStartupCMS);
};

exports.createimageurl = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/cmscontentImages`)) {
      fs.mkdirSync(`${__basedir}/uploads/cmscontentImages`);
    }

    let blogImage = req.file ? `uploads/cmscontentImages/${req.file.filename}` : null;

    res.status(200).json({ url: blogImage });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};