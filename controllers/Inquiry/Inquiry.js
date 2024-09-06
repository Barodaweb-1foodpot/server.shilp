const Inquiry = require("../../models/Inquiry/inquiry");
const fs = require("fs");

exports.getInquiry = async (req, res) => {
  try {
    const find = await Inquiry.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createInquiry = async (req, res) => {
  try {
      let { yourName, subject, yourEmail,yourMessage } = req.body;
      console.log(req.body);  
      const add = await new Inquiry({
        yourName,
        subject,
        yourEmail,
        yourMessage
      }).save();
      res.status(200).json({ isOk: true, data: add, message: "" });
    }
   catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listInquiry = async (req, res) => {
  try {
    const list = await Inquiry.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listInquiryByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match } = req.body;

    let query = [
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
                yourName: { $regex: match, $options: "i" },
              },
              {
                subject: { $regex: match, $options: "i" },
              },
              {
                yourEmail: { $regex: match, $options: "i" },
              },
              {
                yourMessage: { $regex: match, $options: "i" },
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

    const list = await Inquiry.aggregate(query);

    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};



