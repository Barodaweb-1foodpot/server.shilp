const Applications = require("../../models/Applications/Applications");
const fs = require("fs");

exports.uplodaImages = async (req, res) => {
  try {
    const imageFile = req.file.filename;
    const ImagePath = req.file.destination;
    const path = ImagePath + "/" + imageFile;
    let updatefield = { photo: path };
    if (req.body.filefor == "photo") {
      updatefield = { photo: path };
      const fs = require("fs");
      const source = path;
      const destination = "uploads/applications/photo.png";
      fs.copyFile(source, destination, (err) => {
        if (err) throw err;
        console.log(
          "photo png was copied to uploads/applications/photo.png"
        );
      });
    } else if (req.body.filefor == "incomeCertificate") {
      updatefield = { incomeCertificate: path };
    } else if (req.body.filefor == "studentAadharCard") {
      updatefield = { studentAadharCard: path };
    } else if (req.body.filefor == "parentAadharCard") {
      updatefield = { parentAadharCard: path };
    } else if (req.body.filefor == "panCard") {
      updatefield = { panCard: path };
    } else if (req.body.filefor == "ssc") {
      updatefield = { ssc: path };
    } else if (req.body.filefor == "schoolLeavingCertificate") {
      updatefield = { schoolLeavingCertificate: path };
    } else if (req.body.filefor == "itReturn") {
      updatefield = { itReturn: path };
    } else if (req.body.filefor == "deathCertificate") {
      updatefield = { deathCertificate: path };
    } else if (req.body.filefor == "recommendationLetter") {
      updatefield = { recommendationLetter: path };
    }
    const newrec = await Applications.findOneAndUpdate(
      { _id: req.body._id },
      updatefield
    );
    res.json({ isOk: true, url: path });
  } catch (error) {
    res.json({ isOk: false, error });
  }
};

exports.getApplication = async (req, res) => {
  try {
    const find = await Applications.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (err) {
    console.log(err);
  }
};

exports.listApplications = async (req, res) => {
  try {
    const find = await Applications.find().exec();
    res.json(find);
  } catch (err) {
    console.log(err);
  }
};

exports.createApplications = async (req, res) => {
  try {
    console.log("details", req.body);
    const add = await new Applications(req.body).save();
    res.json(add);
  } catch (err) {
    console.log("log error from create Applications", err);
    return res
      .status(400)
      .send("create dynamic content failed from Applications");
  }
};

exports.listApplicationsByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive, IsApproved: false },
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
                contactNo: { $regex: match, $options: "i" },
              },
              {
                middleName: { $regex: match, $options: "i" },
              },
              {
                currentGrade: { $regex: match, $options: "i" },
              }
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

    const list = await Applications.aggregate(query);

    res.json(list);
      
  } catch (err) {
    console.log(err);
  }
};

exports.listApprovedByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive, IsApproved: true },
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
                contactNo: { $regex: match, $options: "i" },
              },
              {
                middleName: { $regex: match, $options: "i" },
              },
              {
                currentGrade: { $regex: match, $options: "i" },
              }
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

    const list = await Applications.aggregate(query);

    res.json(list);
      
  } catch (err) {
    console.log(err);
  }
};

exports.updateApplications = async (req, res) => {
  try {
    const update = await Applications.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("update details failed");
  }
};

exports.createApplicationsByFrontend = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/applications`)) {
      fs.mkdirSync(`${__basedir}/uploads/applications`);
    }

    // Extract file paths
    let {
      incomeCertificate,
      passportPhoto,
      studentAadharCard,
      parentAadharCard,
      panCard,
      sscMarksheet,
      schoolLeavingCertificate,
      itReturn,
      deathCertificate,
      recommendationLetter
    } = req.files;

    let incomeCertificatePath = incomeCertificate ? `uploads/applications/${incomeCertificate[0].filename}` : null;
    let passportPhotoPath = passportPhoto ? `uploads/applications/${passportPhoto[0].filename}` : null;
    let studentAadharCardPath = studentAadharCard ? `uploads/applications/${studentAadharCard[0].filename}` : null;
    let parentAadharCardPath = parentAadharCard ? `uploads/applications/${parentAadharCard[0].filename}` : null;
    let panCardPath = panCard ? `uploads/applications/${panCard[0].filename}` : null;
    let sscMarksheetPath = sscMarksheet ? `uploads/applications/${sscMarksheet[0].filename}` : null;
    let schoolLeavingCertificatePath = schoolLeavingCertificate ? `uploads/applications/${schoolLeavingCertificate[0].filename}` : null;
    let itReturnPath = itReturn ? `uploads/applications/${itReturn[0].filename}` : null;
    let deathCertificatePath = deathCertificate ? `uploads/applications/${deathCertificate[0].filename}` : null;
    let recommendationLetterPath = recommendationLetter ? `uploads/applications/${recommendationLetter[0].filename}` : null;

    let {
      firstName,
      middleName,
      lastName,
      email,
      mobile,
      currentGrade,
      IsApproved
    } = req.body;

    // Save application details to the database
    const add = await new Applications({
      firstName,
      middleName,
      lastName,
      email,
      contactNo:mobile,
      currentGrade,
      incomeCertificate: incomeCertificatePath,
      photo: passportPhotoPath,
      studentAadharCard: studentAadharCardPath,
      parentAadharCard: parentAadharCardPath,
      panCard: panCardPath,
      ssc: sscMarksheetPath,
      schoolLeavingCertificate: schoolLeavingCertificatePath,
      itReturn: itReturnPath,
      deathCertificate: deathCertificatePath,
      recommendationLetter: recommendationLetterPath,
      IsApproved
    }).save();

    res.status(200).json({ isOk: true, data: add, message: "", status: 200 });
  } catch (err) {
    console.log("log error from create Applications", err);
    return res.status(400).send("Create dynamic content failed from Applications");
  }
};