const Payment = require("../../models/Payment/Payment");
var nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Startup = require("../../models/Master/Startup");
const Investor = require("../../models/Master/Investor");
const TicketMaster = require("../../models/Master/TicketMaster");
const Visitor = require("../../models/Master/Visitor");
const NotificationSetup = require("../../models/Notifications/NotificationSetup");
const { register } = require("module");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Key Secret
});

exports.checkout = async (req, res) => {
  const { startupIds, selectedTicket } = req.body;

  try {

    // const tickets = await TicketMaster.find({ _id: { $in: ticketIds } });

    // const amount = tickets.reduce((acc, ticket) => acc + ticket.amount, 0);

    const ticket = await TicketMaster.findOne({ _id: selectedTicket });

    let amount = startupIds.length * ticket.amount;

    const options = {
      amount: amount * 100,
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);
    console.log("Order created on checkout:", order);

    // const updatePromises = startupIds.map((startupId) =>
    //   Startup.findByIdAndUpdate(
    //     startupId._id,
    //     { orderId: order.id, amount },
    //     { new: true }
    //   ).exec()
    // );


    const updatePromises = startupIds.map((participant) => {
      const { participantCategoryId, _id } = participant;
      console.log("rere", participantCategoryId);

      if (participantCategoryId == "66deba2b8d13756fe2697bee" || participantCategoryId == "66deba1c8d13756fe2697beb") {
        console.log("1,2");
        return Startup.findByIdAndUpdate(
          _id,
          { orderId: order.id, amount, ticketId: selectedTicket },
          { new: true }
        ).exec();
      } else if (participantCategoryId === "66deba3b8d13756fe2697bf1") {
        console.log("3");
        return Investor.findByIdAndUpdate(
          _id,
          { orderId: order.id, amount, ticketId: selectedTicket },
          { new: true }
        ).exec();
      } else if (participantCategoryId === "66e1617c158fdfa7198f4763") {
        console.log("4");
        return Visitor.findByIdAndUpdate(
          _id,
          { orderId: order.id, amount, ticketId: selectedTicket },
          { new: true }
        ).exec();
      }
    });

    const updatedStartups = await Promise.all(updatePromises);

    console.log("Updated startups:", updatedStartups);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.paymentVerification = async (req, res) => {
  try {
    const {
      // participantCategoryId,
      // startupId,
      // investorId,
      // visitorId,
      // amount,
      // currency,
      // eventId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      // startupIds
    } = req.body;

    console.log("body of pay ver", req.body, "paramssssssss", req.params.customActiveTab)

    let paymentId = razorpay_payment_id;
    let orderId = razorpay_order_id;
    let signature = razorpay_signature;

    const body = orderId + "|" + paymentId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");


    if (expectedSignature === signature) {
      try {
        const payment = new Payment({
          // participantCategoryId: participantCategoryId ? participantCategoryId : null,
          // startupId: startupId ? startupId : null,
          // investorId: investorId? investorId : null,
          // visitorId: visitorId?  visitorId : null,
          // amount : amount ? amount : 0,
          // currency : 'INR',
          // eventId : eventId ? eventId : null,
          paymentStatus: "Success",
          razorpay_orderId: orderId,
          razorpay_paymentId: paymentId,
          razorpay_signature: signature,
        });

        await payment.save();

        let find;

        if (req.params.customActiveTab == '1' || req.params.customActiveTab == '2') {

          find = await Startup.updateMany(
            { orderId: orderId },
            { IsPaid: true },
            { new: true }
          ).exec();
        }
        else if (req.params.customActiveTab == '3') {
          find = await Investor.updateMany(
            { orderId: orderId },
            { IsPaid: true },
            { new: true }
          ).exec();
        }
        else if (req.params.customActiveTab == '4') {
          find = await Visitor.updateMany(
            { orderId: orderId },
            { IsPaid: true },
            { new: true }
          ).exec();
        }

        // console.log("qq", find);

        const registerData = JSON.parse(decodeURIComponent(req.query.registerData));

        const notification = await NotificationSetup.findOne({ formName: "Registration Email" }).exec();

        let list = registerData.map((detail) => `
        <tr>
            <td style="text-align: center;">${detail?.contactPersonName || detail?.name}</td>
            <td style="text-align: center;">${detail?.companyName || "-"}</td>
            <td style="text-align: center;">${detail?.contactNo} || ${detail?.email}</td>
            <td style="text-align: center;">₹${req.params.amount / (registerData?.length * 100)}</td>
        </tr>
    `).join('');

        const updatePromises = registerData.map(async (participant) => {
          const { participantCategoryId, _id } = participant;

          let entity, emailTemplate;

          if (participantCategoryId == "66deba2b8d13756fe2697bee" || participantCategoryId == "66deba1c8d13756fe2697beb") {
            entity = await Startup.findById(_id).exec();
          } else if (participantCategoryId === "66deba3b8d13756fe2697bf1") {
            entity = await Investor.findById(_id).exec();
          } else if (participantCategoryId === "66e1617c158fdfa7198f4763") {
            entity = await Visitor.findById(_id).exec();
          }

          if (entity) {
            const ticket = await TicketMaster.findById(entity.ticketId).populate('eventId').exec();
            emailTemplate = notification.EmailSignature
              // .replace("{{orderId}}", entity?.orderId)
              .replace("{{registrationDate}}", formatDate(entity?.createdAt))
              .replace("{{eventName}}", ticket?.eventId?.name)
              .replace("{{eventPassName}}", ticket?.name)
              .replace("{{total}}", `₹${(req.params.amount) / 100}`)
              .replace("{{registrationDetails}}", list);

            const transporter = nodemailer.createTransport({
              // service: 'gmail',
              host: notification.OutgoingServer,
              port: notification.OutgoingPort,
              secure: true,
              auth: {
                user: notification.EmailFrom,
                pass: notification.EmailPassword,
              },
            });

            const mailOptions = {
              from: notification.EmailFrom,
              to: entity?.email,
              subject: 'Registration Confirmation for Startup Fest Gujarat',
              html: emailTemplate,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log('Error sending email: ', error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          }
        });

        await Promise.all(updatePromises);


        return res.redirect(
          `${process.env.REACT_APP_API_URL}/register`
        );
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    } else {
      // return res.redirect(
      //   `${REACT_APP_API_URL}/payment-failed?reference=${paymentId}`
      // );

      const payment = new Payment({
        paymentStatus: "Failed",
        razorpay_orderId: orderId,
        razorpay_paymentId: paymentId,
        razorpay_signature: signature,
      });

      await payment.save();


      res.json({ success: false });
    }

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');  // Get day and ensure two digits
  const month = String(date.getMonth() + 1).padStart(2, '0');  // Get month (0-indexed) and ensure two digits
  const year = date.getFullYear();  // Get full year
  return `${day}/${month}/${year}`;  // Return formatted date
};

exports.sendEmailOnRegistration = async (req, res) => {
  try {
    const { order, registerData } = req.body;

    console.log("send invoice", req.body);

    const notification = await NotificationSetup.findOne({ formName: "Registration Email" }).exec();

    let list = registerData.map((detail) => `
    <tr>
        <td style="text-align: center;">${detail?.contactPersonName || detail?.name}</td>
        <td style="text-align: center;">${detail?.companyName || "-"}</td>
        <td style="text-align: center;">${detail?.contactNo} || ${detail?.email}</td>
        <td style="text-align: center;">₹${order.amount / (registerData?.length * 100)}</td>
    </tr>
`).join('');

    let startup;

    const updatePromises = registerData.map(async (participant) => {
      const { participantCategoryId, _id } = participant;
      console.log("rere", participantCategoryId);

      if (participantCategoryId == "66deba2b8d13756fe2697bee" || participantCategoryId == "66deba1c8d13756fe2697beb") {
        console.log("1,2");
        startup = await Startup.findById(
          _id,
        ).exec();

        if (startup) {
          const ticket = await TicketMaster.findById(startup.ticketId).populate('eventId').exec();

          var body2 = notification.EmailSignature
            .replace("{{orderId}}", startup?.orderId)
            .replace("{{registrationDate}}", formatDate(startup?.createdAt))
            .replace("{{eventName}}", ticket?.eventId?.name)
            .replace("{{eventPassName}}", ticket?.name)
            .replace("{{total}}", `₹${(order?.amount) / 100}`)
            // .replace("{{subtotal}}", `₹${(order?.amount)/100}`)
            .replace("{{registrationDetails}}", list)

          const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change the email provider or use SMTP
            auth: {
              user: notification.EmailFrom,  // Your email address
              pass: notification.EmailPassword,   // Your email password or app password
            },
          });

          const mailOptions = {
            from: notification.EmailFrom,
            to: startup?.email,
            subject: 'Registration Confirmation for Startup Fest Gujarat',
            html: body2
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log('Error sending email: ', error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        }
      } else if (participantCategoryId === "66deba3b8d13756fe2697bf1") {
        console.log("3");
        startup = await Investor.findById(
          _id,
        ).exec();

        console.log("invee", startup);

        if (startup) {
          const ticket = await TicketMaster.findById(startup.ticketId).populate('eventId').exec();

          var body2 = notification.EmailSignature
            // .replace("{{orderId}}", startup?.orderId)
            .replace("{{registrationDate}}", formatDate(startup?.createdAt))
            .replace("{{eventName}}", ticket?.eventId?.name)
            .replace("{{eventPassName}}", ticket?.name)
            .replace("{{total}}", `₹${(order?.amount) / 100}`)
            // .replace("{{subtotal}}", `₹${(order?.amount)/100}`)
            .replace("{{registrationDetails}}", list)

          const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change the email provider or use SMTP
            auth: {
              user: notification.EmailFrom,  // Your email address
              pass: notification.EmailPassword,   // Your email password or app password
            },
          });

          const mailOptions = {
            from: notification.EmailFrom,
            to: startup?.email,
            subject: 'Registration Confirmation for Startup Fest Gujarat',
            html: body2
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log('Error sending email: ', error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        }
      } else if (participantCategoryId === "66e1617c158fdfa7198f4763") {
        console.log("4");
        startup = await Visitor.findById(
          _id,
        ).exec();

        console.log("visitor", startup);

        if (startup) {
          const ticket = await TicketMaster.findById(startup.ticketId).populate('eventId').exec();

          var body2 = notification.EmailSignature
            .replace("{{orderId}}", startup?.orderId)
            .replace("{{registrationDate}}", formatDate(startup?.createdAt))
            .replace("{{eventName}}", ticket?.eventId?.name)
            .replace("{{eventPassName}}", ticket?.name)
            .replace("{{total}}", `₹${(order?.amount) / 100}`)
            // .replace("{{subtotal}}", `₹${(order?.amount)/100}`)
            .replace("{{registrationDetails}}", list)

          const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change the email provider or use SMTP
            auth: {
              user: notification.EmailFrom,  // Your email address
              pass: notification.EmailPassword,   // Your email password or app password
            },
          });

          const mailOptions = {
            from: notification.EmailFrom,
            to: startup?.email,
            subject: 'Registration Confirmation for Startup Fest Gujarat',
            html: body2
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log('Error sending email: ', error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        }
      }
    });

    const updatedStartups = await Promise.all(updatePromises);

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
