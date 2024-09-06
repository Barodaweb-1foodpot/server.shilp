const CompanyDetails = require("../../models/Setup/CompanyDetails");

exports.uplodaImages = async (req, res) => {
  try {
    const imageFile = req.file.filename;
    const ImagePath = req.file.destination;
    const path = ImagePath + "/" + imageFile;
    let updatefield = { Favicon: path };
    if (req.body.filefor == "Favicon") {
      updatefield = { Favicon: path };
      //copy this file and overwrite default
      const fs = require("fs");
      const source = path;
      //set destination as uploads/companydetails
      const destination = "uploads/companydetails/favicon.png";
      fs.copyFile(source, destination, (err) => {
        if (err) throw err;
        console.log(
          "favicon png was copied to uploads/companydetails/favicon.png"
        );
      });
    } else if (req.body.filefor == "Icon") {
      updatefield = { Icon: path };
    } else if (req.body.filefor == "Logo") {
      updatefield = { Logo: path };
    } else if (req.body.filefor == "DigitalSignature") {
      updatefield = { DigitalSignature: path };
    }
    const newrec = await CompanyDetails.findOneAndUpdate(
      { _id: req.body._id },
      updatefield
    );
    res.json({ isOk: true, url: path });
  } catch (error) {
    res.json({ isOk: false, error });
  }
};

exports.getDetail = async (req, res) => {
  try {
    const find = await CompanyDetails.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (err) {
    console.log(err);
  }
};

exports.createCompanyDetails = async (req, res) => {
  try {
    console.log("details", req.body);
    const add = await new CompanyDetails(req.body).save();
    res.json(add);
  } catch (err) {
    console.log("log error from create comany details", err);
    return res
      .status(400)
      .send("create dynamic content failed from company details");
  }
};

// exports.listCompanyDetails = async (req, res) => {
//  try{
//   const list = await CompanyDetails.find().sort({ createdAt: -1 }).exec();
//   res.json(list);
//  }catch(err){
//   console.log(err);
//  }
// };

exports.listCompanyDetails = async (req, res) => {
  try {
    let query = [
      {
        $lookup: {
          from: "countries",
          localField: "CountryID",
          foreignField: "_id",
          as: "country",
        },
      },
      {
        $unwind: {
          path: "$country",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "StateID",
          foreignField: "_id",
          as: "state",
        },
      },
      {
        $unwind: {
          path: "$state",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          CompanyName: 1,
          ContactPersonName: 1,
          CountryID: 1,
          countryName: "$country.CountryName",
          stateName: "$state.StateName",
          StateID: 1,
          City: 1,
          Address: 1,
          Pincode: 1,
          ContactNo_Office: 1,
          EmailID_Office: 1,
          Favicon: 1,
          Icon: 1,
          DigitalSignature: 1,
          Website1: 1,
          createdAt: 1,
          updatedAt: 1,
          IsActive: 1,
          IsShowAllLocations: 1,
          Logo: 1,
        },
      },
    ];
    const list = await CompanyDetails.aggregate(query).exec();

    //  const list = await CompanyDetails.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (err) {
    console.log(err);
  }
};
exports.updateDetails = async (req, res) => {
  try {
    const update = await CompanyDetails.findOneAndUpdate(
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

exports.updateCompanyLocationsToggle = async (req, res) => {
  try {
    const companyDetails = await CompanyDetails.findOne().exec();

    if (!companyDetails) {
      return res.status(404).json({ isOk: false, message: 'Company details not found' });
    }

    companyDetails.IsShowAllLocations = req.body.showAllLocations;
    await companyDetails.save();

    res.json({ isOk: true, message: "Updated!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, message: 'Internal server error' });
  }
};

