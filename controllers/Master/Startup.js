const StartUpDetailsMaster = require("../../models/Master/Startup");
const fs = require("fs");

exports.getStartUpDetailsMaster = async (req, res) => {
  try {
    const find = await StartUpDetailsMaster.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createStartUpDetailsMaster = async (req, res) => {
  try {
    console.log("jii", req.body)
    if (!fs.existsSync(`${__basedir}/uploads/Startup`)) {
      fs.mkdirSync(`${__basedir}/uploads/Startup`);
    }

    // let logo =  `uploads/userImages/${logo[0].filename}` ? `uploads/userImages/${logo[0].filename}` : null;
    // let productImages =  `uploads/userImages/${productImages[0].filename}`? `uploads/userImages/${productImages[0].filename}` : null;
    // let brochure = `uploads/userImages/${brochure[0].filename}` ? `uploads/userImages/${brochure[0].filename}` : null;
    
    let logo = req.files.logo ? `uploads/Startup/${req.files.logo[0].filename}` : null;
    let productImages = req.files.productImages ? `uploads/Startup/${req.files.productImages[0].filename}` : null;
    let brochure = req.files.brochure ? `uploads/Startup/${req.files.brochure[0].filename}` : null;
    // let AchievementImage3 = req.files.AchievementImage3 ? `uploads/speakerImages/${req.files.AchievementImage3[0].filename}` : null;


      let { 
        participantCategoryId, 
        categoryId, 
        contactPersonName,
        contactNo,
         email ,
          password , 
          companyName ,
           description,
           remarks,
           StateID,
           CountryID,
           City,
           address,
           pincode,
           countryCode,
           legalName,
           founderName,
           stageOfStartup,
           yearFounded,
           teamSize,
           IsActive ,
           ticketId} = req.body;  
    const emailExists = await StartUpDetailsMaster.findOne({
      email: req.body.email,
      participantCategoryId:req.body.participantCategoryId
    }).exec();

    if (emailExists) {
      return res.status(200).json({
        isOk: false,
        message: "Email already exists",
      });
    } else {
      const add = await new StartUpDetailsMaster({
        participantCategoryId,
        categoryId,
        contactPersonName,
        contactNo,
        email,
        password,
        companyName,
        description,
        remarks,
        StateID,
        CountryID,
        City,
        address,
        pincode,
        IsActive,
        logo:logo,
        brochure:brochure,
        productImages:productImages,
        countryCode,
           legalName,
           founderName,
           stageOfStartup,
           yearFounded,
           teamSize,ticketId
      }).save();
      const populatedStartup = await StartUpDetailsMaster.findById(add._id)
      .populate({
        path: 'ticketId',  // First, populate ticketId
        populate: {
          path: 'eventId',  // Then, populate eventId inside ticketId
          model: 'EventMaster',  // Specify the Event model
        },
      });

    // Respond with the populated data
    res.status(200).json({
      isOk: true,
      data: {
        ...add.toObject(),  // Include all startup details
        Event: populatedStartup.ticketId?.eventId,  // Add populated event from ticketId
      },
      message: "",
    });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listStartUpDetailsMaster = async (req, res) => {
  try {
    const list = await StartUpDetailsMaster.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listStartUpDetailsMasterByParams = async (req, res) => {
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
                companyName: { $regex: match, $options: "i" },
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

    const list = await StartUpDetailsMaster.aggregate(query);

    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.updateStartUpDetailsMaster = async (req, res) => {
  try {
    let bannerImage = req.file
      ? `uploads/userImages/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (bannerImage != null) {
      fieldvalues.bannerImage = bannerImage;
    }
    const update = await StartUpDetailsMaster.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeStartUpDetailsMaster = async (req, res) => {
  try {
    const del = await StartUpDetailsMaster.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.userLoginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usermp = await StartUpDetailsMaster.findOne({ email: email }).exec();
    if (usermp.IsActive) {
      if (usermp.password !== password) {
        return res.status(200).json({
          isOk: false,
          filed: 1,
          message: "Authentication Failed",
        });
      } else {
        res.status(200).json({
          isOk: true,
          message: "Authentication Successfull",
          data: usermp,
        });
      }
    } else {
      res.status(200).json({
        isOk: false,
        message: "Admin User not Found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(200).json({
      isOk: false,
      message: "An error occurred while logging in adminpanel",
    });
  }
};
