const Votes = require("../../models/Votes/Votes");
const fs = require("fs");

exports.getVoter = async (req, res) => {
  try {
    const find = await Votes.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createVoter = async (req, res) => {
  try {
      let { StartupID, VoterName, Voteremail,VotercontactNo , Remarks } = req.body;
      console.log(req.body);  
      const add = await new Votes({
        StartupID,
        VoterName,
        Voteremail,
        VotercontactNo,
        Remarks
      }).save();
      res.status(200).json({ isOk: true, data: add, message: "" });
    }
   catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listVoter = async (req, res) => {
  try {
    const list = await Votes.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listVoterByParams = async (req, res) => {
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

    const list = await Votes.aggregate(query);

    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.countVoters = async (req, res) => {
    try {
      const count = await Votes.countDocuments().exec();
      res.json({ totalEntries: count });
    } catch (error) {
      return res.status(400).send(error);
    }
};




