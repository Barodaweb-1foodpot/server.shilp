const StartUpDetailsMaster = require("../../models/Master/Startup");
const nodemailer = require('nodemailer');
const StartUpCms = require("../../models/StartupCMS/StartupCMS")
const fs = require("fs");
const sharp = require('sharp');

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
    // console.log("jii", req.body);
    if (!fs.existsSync(`${__basedir}/uploads/Startup`)) {
      fs.mkdirSync(`${__basedir}/uploads/Startup`);
    }

    const compressImage = async (inputPath, outputPath) => {
      await sharp(inputPath)
        .resize(300) 
        .toFile(outputPath);
    };

    let logo = null;
    let productImages = null;
    let brochure = null;

    if (req.files.logo) {
      const inputPath = req.files.logo[0].path;
      const tempOutputPath = `${__basedir}/uploads/Startup/temp_${req.files.logo[0].filename}`;
      const finalOutputPath = `uploads/Startup/${req.files.logo[0].filename}`;
      await compressImage(inputPath, tempOutputPath);
      fs.renameSync(tempOutputPath, finalOutputPath);
      logo = finalOutputPath;
    }

    if (req.files.productImages) {
      const inputPath = req.files.productImages[0].path;
      const tempOutputPath = `${__basedir}/uploads/Startup/temp_${req.files.productImages[0].filename}`;
      const finalOutputPath = `uploads/Startup/${req.files.productImages[0].filename}`;
      await compressImage(inputPath, tempOutputPath);
      fs.renameSync(tempOutputPath, finalOutputPath);
      productImages = finalOutputPath;
    }

    if (req.files.brochure) {
      const inputPath = req.files.brochure[0].path;
      const tempOutputPath = `${__basedir}/uploads/Startup/temp_${req.files.brochure[0].filename}`;
      const finalOutputPath = `uploads/Startup/${req.files.brochure[0].filename}`;
      await compressImage(inputPath, tempOutputPath);
      fs.renameSync(tempOutputPath, finalOutputPath);
      brochure = finalOutputPath;
    }

    let pass = generateOTP();

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
      IsActive,
      IsPaid,
      ticketId
    } = req.body;

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
          path: 'ticketId',  
          populate: {
            path: 'eventId',  
            model: 'EventMaster',  
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

      
      res.status(200).json({
        isOk: true,
        data: {
          ...add.toObject(),  
          Event: populatedStartup.ticketId?.eventId,  
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
    // console.log("Email Body", emailBodyWithoutHtml);
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
    const compressImage = async (inputPath, outputPath) => {
      await sharp(inputPath)
        .resize(300) 
        .toFile(outputPath);
    };

   
    const compressAndRename = async (file, tempDir, finalDir) => {
      const inputPath = file.path;
      const tempOutputPath = `${tempDir}/temp_${file.filename}`;
      const finalOutputPath = `${finalDir}/${file.filename}`;
    
      await sharp(inputPath)
        .resize(300) // Resize to 300px width, adjust as necessary
        .toFile(tempOutputPath);
    
      // Ensure the file is not busy before renaming
      let retries = 5;
      while (retries > 0) {
        try {
          fs.renameSync(tempOutputPath, finalOutputPath);
          break;
        } catch (err) {
          if (err.code === 'EBUSY') {
            retries -= 1;
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100ms before retrying
          } else {
            throw err;
          }
        }
      }
    
      if (retries === 0) {
        throw new Error(`Failed to rename file after multiple attempts: ${tempOutputPath}`);
      }
    
      return finalOutputPath;
    };
    let brochure = null;
    let logo = null;
    let productImages = null;

    const promises = [];

    if (req.files.brochure) {
      console.log("brochure", req.files.brochure);
      promises.push(
        compressAndRename(req.files.brochure[0], 'uploads/userImages', 'uploads/StartUp').then(
          (outputPath) => {
            brochure = outputPath;
          }
        )
      );
    }

    if (req.files.logo) {
      promises.push(
        compressAndRename(req.files.logo[0], 'uploads/userImages', 'uploads/Startup').then(
          (outputPath) => {
            logo = outputPath;
          }
        )
      );
    }

    if (req.files.productImages) {
      promises.push(
        compressAndRename(req.files.productImages[0], 'uploads/userImages', 'uploads/Startup').then(
          (outputPath) => {
            productImages = outputPath;
          }
        )
      );
    }

    await Promise.all(promises);

    let fieldvalues = { ...req.body };
    if (brochure != null) {
      fieldvalues.brochure = brochure;
    }
    if (logo != null) {
      fieldvalues.logo = logo;
    }
    if (productImages != null) {
      fieldvalues.productImages = productImages;
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
