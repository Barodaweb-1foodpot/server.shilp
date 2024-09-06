const NotificationSetup = require("../../models/Notifications/NotificationSetup");
var nodemailer = require("nodemailer");
const NewsLetterSubs = require("../../models/Setup/NewsLetterSubs");

exports.createNotificationSetup = async (req, res) => {
  try {
    const {
      formName,
      emailSubject,
      MailerName,
      CCMail,
      EmailFrom,
      EmailPassword,
      OutgoingServer,
      OutgoingPort,
      EmailSignature,
      EmailSent,
      ToAllUser,
      IsActive,
    } = req.body;

    const name = await NotificationSetup.findOne({ formName: formName });
    if (name) {
      return res.status(200).json({
        isOk: false,
        message: "Form name already exists!",
      });
    }
    let modSignature = EmailSignature.split(/\\|\n|\t/);
    modSignature = modSignature.join("");
    const addNotificationSetup = await new NotificationSetup({
      formName,
      emailSubject,
      MailerName,
      CCMail,
      EmailFrom,
      EmailPassword,
      OutgoingServer,
      OutgoingPort,
      EmailSignature: modSignature,
      EmailSent,
      ToAllUser,
      IsActive,
    }).save();
    return res.status(200).json({
      isOk: true,
      message: "Added",
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.listNotificationSetup = async (req, res) => {
  const setup = await NotificationSetup.find().sort({ createdAt: -1 }).exec();
  res.json(setup);
};

exports.listNotificationSetupByParams = async (req, res) => {
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
              formName: { $regex: match, $options: "i" },
            },
            {
              MailerName: { $regex: match, $options: "i" },
            },
            {
              EmailFrom: { $regex: match, $options: "i" },
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

  const list = await NotificationSetup.aggregate(query);
  res.json(list);
};
exports.updateNotificationSetup = async (req, res) => {
  try {
    const {
      formName,
      emailSubject,
      MailerName,
      CCMail,
      EmailFrom,
      EmailPassword,
      OutgoingServer,
      OutgoingPort,
      EmailSignature,
      EmailSent,
      ToAllUser,
      IsActive,
    } = req.body;
    console.log(req.body);

    //   const adminListIds = adminList.map((adminId) =>
    //     mongoose.Types.ObjectId(adminId)
    //   );
    let modSignature = EmailSignature.split(/\\|\n|\t/);
    modSignature = modSignature.join("");
    const update = await NotificationSetup.findOneAndUpdate(
      { _id: req.params._id },
      {
        formName,
        emailSubject,
        MailerName,
        CCMail,
        EmailFrom,
        EmailPassword,
        OutgoingServer,
        OutgoingPort,
        EmailSignature: modSignature,
        EmailSent,
        ToAllUser,
        IsActive,
      },
      { new: true }
    );
    console.log(update);
    res.json(update);
  } catch {
    res.status(400).send("update notification setup fail");
  }
};

exports.removeNotificationSetup = async (req, res) => {
  try {
    const delNotificationSetup = await NotificationSetup.findOneAndDelete({
      _id: req.params._id,
    });
    res.json(delNotificationSetup);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getNotificationSetup = async (req, res) => {
  try {
    const notification = await NotificationSetup.findOne({
      _id: req.params._id,
    });
    res.json(notification);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getSetupByName = async (req, res) => {
  try {
    const notification = await NotificationSetup.findOne({
      formName: req.params.formname,
    }).exec();
    res.json(notification);
  } catch (err) {
    res.status(400).json("form name", err);
  }
};

exports.sendEmailNotificationSetup = async (req, res) => {
  try {
    const notification = await NotificationSetup.findOne({
      _id: req.params._id,
    });

    let transporter;

    console.log("hh", notification)

    if (notification) {
      transporter = nodemailer.createTransport({
        service: notification.OutgoingServer,
        port: notification.OutgoingPort,
        secure: true,
        auth: {
          user: notification.EmailFrom,
          pass: notification.EmailPassword,
        },
      });

      if (notification.ToAllUser) {
        const users = await NewsLetterSubs.find({}).exec();

        const emailPromises = users.map((user) => {
          const mailOptions = {
            from: notification.MailerName,
            to: user.email,
            subject: notification.emailSubject,
            html: notification.EmailSignature,
          };

          return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.error("Error sending email to", user.email, error);
                return reject(error);
              } else {
                console.log("Email sent to", user.email, ":", info.response);
                return resolve(info);
              }
            });
          });
        });

        await Promise.all(emailPromises);

        res
          .status(200)
          .json({ isOk: true, message: "Emails sent successfully" });
      } else if (notification.EmailSent) {
        // Create mail options
        var mailOptions = {
          from: notification.MailerName,
          to: notification.EmailSent,
          subject: notification.emailSubject,
          html: notification.EmailSignature,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.error(
              "Error sending email to",
              notification.EmailSent,
              error
            );
            return res.status(500).json({ error: "Failed to send email" });
          } else {
            console.log(
              "Email sent to",
              notification.EmailSent,
              ":",
              info.response
            );
            return res
              .status(200)
              .json({ isOk: true, message: "Email sent successfully" });
          }
        });
      } else {
        res
          .status(200)
          .json({ isOk: false, message: "Recipient email not specified" });
      }
    } else {
      res
        .status(500)
        .json({ isOk: false, message: "notifcation details not found!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
