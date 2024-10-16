const Content = require("../../models/StartupCMS/StartupCMS");
const fs = require("fs");

exports.listContent = async (req, res) => {
  const list = await Content.find().sort({ createdAt: -1 }).exec();

  res.json(list);
};

exports.listContByParams = async (req, res) => {
  let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

  let query = [
    {
      $match: { IsActive: IsActive },
    },
    {
      $lookup: {
        from: "startups",
        localField: "startupName",
        foreignField: "_id",
        as: "startup",
      },
    },
    {
      $unwind: {
        path: "$startup",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $set: {
        startup: "$startup.companyName",
      },
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
              Title: { $regex: match, $options: "i" },
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

  const listContent = await Content.aggregate(query);

  res.json(listContent);
};

exports.createContent = async (req, res) => {
  try {
    const title = await Content.findOne({ Title: req.body.Title });
    console.log("rr", title);
    if (title) {
      return res.status(200).json({
        isOk: false,
        field: 1,
        message: "Title with this name already exists!",
      });
    } else {
      const addContent = await new Content(req.body).save();
      res.status(200).json({
        isOk: true,
        data: addContent,
      });
    }
  } catch (err) {
    console.log("Create Content error", err);
    return res.status(400).send(err);
  }
};

exports.getContent = async (req, res) => {
  const getContent = await Content.findOne({
    _id: req.params._id,
  }).exec();
  console.log("getContent", getContent);
  res.status(200).json(getContent);
  // return res.status(400).send(err);
};

exports.removeContent = async (req, res) => {
  try {
    const delContent = await Content.findOneAndRemove({
      _id: req.params._id,
    });
    console.log(delContent);
    res.status(200).json(delContent);
  } catch (err) {
    console.log("delete Content error", err);
    return res.status(400).send("delete Content failed");
  }
};

exports.updateContent = async (req, res) => {
  try {
    const update = await Content.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    console.log("edit version", update);
    res.status(200).json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("update Content failed");
  }
};


exports.getContentByUrl = async (req, res) => {
  const getContent = await Content.findOne({
    URL: req.params._url,
  }).exec();
  console.log("getContent", getContent);
  res.status(200).json(getContent);
  // return res.status(400).send(err);
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


exports.getContentByStartUp = async (req, res) => {
    const getContent = await Content.findOne({
        startupName: req.params._id,
    }).exec();
    console.log("getContent", getContent);
    res.status(200).json(getContent);
    // return res.status(400).send(err);
  };