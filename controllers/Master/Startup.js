const StartUpDetailsMaster = require("../../models/Master/Startup");
const nodemailer = require('nodemailer');
const StartUpCms = require("../../models/StartupCMS/StartupCMS")
const fs = require("fs");

exports.getStartUpDetailsMaster = async (req, res) => {
  try {
    const find = await StartUpDetailsMaster.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.getpopulatedStartUpDetailsMaster = async (req, res) => {
  try {
    const find = await StartUpDetailsMaster.findById(req.params._id)
      .populate('participantCategoryId')
      .populate('ticketId')
      .populate('categoryId')
      .populate('stageOfStartup')
      .populate('StateID')
      .populate('CountryID')
      .exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


exports.createStartUpDetailsMaster = async (req, res) => {
  try {
    console.log("jii", req.body)
    if (!fs.existsSync(`${__basedir}/uploads/Startup`)) {
      fs.mkdirSync(`${__basedir}/uploads/Startup`);
    }

    // let logo =  uploads/userImages/${logo[0].filename} ? uploads/userImages/${logo[0].filename} : null;
    // let productImages =  uploads/userImages/${productImages[0].filename}? uploads/userImages/${productImages[0].filename} : null;
    // let brochure = uploads/userImages/${brochure[0].filename} ? uploads/userImages/${brochure[0].filename} : null;

    let logo = req.files.logo ? `uploads/Startup/${req.files.logo[0].filename}` : null;
    let productImages = req.files.productImages ? `uploads/Startup/${req.files.productImages[0].filename}` : null;
    let brochure = req.files.brochure ? `uploads/Startup/${req.files.brochure[0].filename}` : null;
    // let AchievementImage3 = req.files.AchievementImage3 ? uploads/speakerImages/${req.files.AchievementImage3[0].filename} : null;

    let pass = generateOTP()

    let {
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
      countryCode,
      legalName,
      founderName,
      stageOfStartup,
      yearFounded,
      teamSize,

      IsActive, IsPaid,
      ticketId } = req.body;
    const emailExists = await StartUpDetailsMaster.findOne({
      email: req.body.email,
      participantCategoryId: req.body.participantCategoryId
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
        password: pass,
        companyName,
        description,
        remarks,
        StateID,
        CountryID,
        City,
        address,
        pincode,
        IsActive,
        logo: logo,
        brochure: brochure,
        productImages: productImages,
        countryCode,
        legalName,
        founderName,
        stageOfStartup,
        yearFounded,

        teamSize,
        ticketId,
        IsPaid
      }).save();




      const populatedStartup = await StartUpDetailsMaster.findById(add._id)
        .populate({
          path: 'ticketId',  // First, populate ticketId
          populate: {
            path: 'eventId',  // Then, populate eventId inside ticketId
            model: 'EventMaster',  // Specify the Event model
          },
        });

      const cmsRecord = await new StartUpCms({
        startupName: add._id,
        Title: "",
        Content: "",
        IsActive: true
      }).save();

      if (!cmsRecord) {
        return res.status(500).json({
          isOk: false,
          message: "Failed to create StartupCMS record",
        });
      }


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

exports.sendOTPEmail = async (req, res) => {
  let { email, password } = req.body
  try {

    if (!email) {
      throw new Error("Email details not found in notification");
    }
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAILID,
        pass: process.env.PASSWORD,
      },
    });
    const emailBodyWithoutHtml = "THis is you password to login into Admin Panel"
    console.log("Email Body", emailBodyWithoutHtml);
    // console.log("EmailSignature", notification.EmailSignature);
    const mailOptions = {
      to: email,
      subject: "Login Cradentails",
      html: `${emailBodyWithoutHtml} ${password}`, // Use html property to render HTML content
    };
    const response = transporter.sendMail(mailOptions);
    res.status(200).json({ response, isOk: true, message: "Mail send successfully" })
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
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
        $lookup: {
          from: "ticketmasters",
          localField: "ticketId",
          foreignField: "_id",
          as: "ticketDetails",
        },
      },
      {
        $unwind: {
          path: "$ticketDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          ticket: "$ticketDetails.name",
        },
      },
      {
        $lookup: {
          from: "categorymasters",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDetail",
        },
      },
      {
        $unwind: {
          path: "$categoryDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          category: "$categoryDetail.categoryName",
        },
      },
      {
        $match: {
          $or: [
            {
              companyName: { $regex: match, $options: "i" },
            },
            {
              ticket: { $regex: match, $options: "i" },
            },
            {
              contactPersonName: { $regex: match, $options: "i" },
            },
            {
              email: { $regex: match, $options: "i" },
            },
            {
              contactNo: { $regex: match, $options: "i" },
            },
            {
              category: { $regex: match, $options: "i" },
            },
          ],
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

    let logo = req.files.logo ? `uploads/Startup/${req.files.logo[0].filename}` : null;
    let fieldvalues = { ...req.body };
    if (bannerImage != null) {
      fieldvalues.bannerImage = bannerImage;
    }
    if (logo != null) {
      fieldvalues.logo = logo;
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

exports.voteNow = async (req, res) => {
  try {
    const find = await StartUpCms.findById({
      _id: req.params._id,
    });

    const updatedStartup = await StartUpDetailsMaster.findOneAndUpdate(
      { _id: find.startupName },
      { $inc: { votes: 1 } },
      { new: true }
    );

    console.log(updatedStartup)

    if (!updatedStartup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    res.status(200).json({
      message: "Vote updated successfully",
      data: updatedStartup,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating vote", error });
  }
};
