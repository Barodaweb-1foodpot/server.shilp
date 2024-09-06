const NewsLetter = require("../../models/Setup/NewsLetterSubs");

exports.getNewsLetter = async (req, res) => {
  try {
    const find = await NewsLetter.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.getNewsLetterByEmail = async (req, res) => {
  try {
    const find = await NewsLetter.findOne({ email: req.params.email, IsActive: true }).exec();
    if(find){
      res.status(200).json({ isOk: true, data: find })
    }else{
      res.status(200).json({ isOk: false })
    }
    
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createNewsLetter = async (req, res) => {
  try {
    const add = await new NewsLetter(req.body).save();
    res.json(add);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.listNewsLetter = async (req, res) => {
  try {
    const list = await NewsLetter.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listNewsLetterByParams = async (req, res) => {
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
                NewsLetter: { $regex: match, $options: "i" },
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

    const list = await NewsLetter.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateNewsLetter = async (req, res) => {
  try {
    const update = await NewsLetter.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeNewsLetter = async (req, res) => {
  try {
    const del= await NewsLetter.findOneAndRemove({
      _id: req.params._id,
    });
    console.log(del);
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};
