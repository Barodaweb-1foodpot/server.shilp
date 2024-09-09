const StartUpCompany = require("../../models/StartupsCompany/StartupComapny");
const fs = require("fs");

exports.getStartUpCompany = async (req, res) => {
  try {
    const find = await StartUpCompany.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createStartUpCompany = async (req, res) => {
  try {

    if (!fs.existsSync(`${__basedir}/uploads/StartUpCompany`)) {
      fs.mkdirSync(`${__basedir}/uploads/StartUpCompany`);
    }

    let Logo = req.file
      ? `uploads/StartUpCompany/${req.file.filename}`
      : null;


      let { CategoryID, CompanyName,ContactNo, Email , Description , IsActive } = req.body;  
      const add = await new StartUpCompany({
        CategoryID,
        CompanyName,
        ContactNo,
        Email,
        Logo,
        Description,
        IsActive
        
      }).save();
      res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listStartUpCompany = async (req, res) => {
  try {
    const list = await StartUpCompany.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listStartUpCompanyByParams = async (req, res) => {
  try {
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
                firstName: { $regex: match, $options: "i" },
              },
              {
                lastName: { $regex: match, $options: "i" },
              },
              {
                email: { $regex: match, $options: "i" },
              },
              {
                password: { $regex: match, $options: "i" },
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

    const list = await StartUpCompany.aggregate(query);

    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.updateStartUpCompany = async (req, res) => {
  try {
    let bannerImage = req.file
      ? `uploads/userImages/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (bannerImage != null) {
      fieldvalues.bannerImage = bannerImage;
    }
    const update = await StartUpCompany.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeStartUpCompany = async (req, res) => {
  try {
    const del = await StartUpCompany.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};

