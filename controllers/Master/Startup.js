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
    if (!fs.existsSync(`${__basedir}/uploads/StartUpCompany`)) {
      fs.mkdirSync(`${__basedir}/uploads/StartUpCompany`);
    }

    // let logo =  `uploads/userImages/${logo[0].filename}` ? `uploads/userImages/${logo[0].filename}` : null;
    // let productImages =  `uploads/userImages/${productImages[0].filename}`? `uploads/userImages/${productImages[0].filename}` : null;
    // let brochure = `uploads/userImages/${brochure[0].filename}` ? `uploads/userImages/${brochure[0].filename}` : null;
    
    let logo = req.files.logo ? `uploads/StartUpCompany/${req.files.logo[0].filename}` : null;
    let productImages = req.files.productImages ? `uploads/StartUpCompany/${req.files.productImages[0].filename}` : null;
    let brochure = req.files.brochure ? `uploads/StartUpCompany/${req.files.brochure[0].filename}` : null;
    
    
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
           IsActive,IsPaid } = req.body;  
    const emailExists = await StartUpDetailsMaster.findOne({
      email: req.body.email,
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
           teamSize,
           IsPaid
      }).save();
      res.status(200).json({ isOk: true, data: add, message: "" });
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
    let logo = req.files.logo ? `uploads/StartUpCompany/${req.files.logo[0].filename}` : null;
    let productImages = req.files.productImages ? `uploads/StartUpCompany/${req.files.productImages[0].filename}` : null;
    let brochure = req.files.brochure ? `uploads/StartUpCompany/${req.files.brochure[0].filename}` : null;

    let fieldvalues = { ...req.body };
    if (logo != null) {
      fieldvalues.logo = logo;
    }
    if (productImages != null) {
      fieldvalues.productImages = productImages;
    }
    if (brochure != null) {
      fieldvalues.brochure = brochure;
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
