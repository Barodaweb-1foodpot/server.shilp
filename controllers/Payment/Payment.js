const Payment = require("../../models/Payment/Payment");

const Razorpay = require("razorpay");
const crypto = require("crypto");
const Startup = require("../../models/Master/Startup");
const TicketMaster = require("../../models/Master/TicketMaster");
const Visitor = require("../../models/Master/Visitor");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Key Secret
});

exports.checkout = async (req, res) => {
  const { currency, startupIds, ticketIds } = req.body;

  try {

    const tickets = await TicketMaster.find({ _id: { $in: ticketIds } });

    const amount = tickets.reduce((acc, ticket) => acc + ticket.amount, 0);

    const options = {
      amount: amount * 100,
      currency: currency || "INR",
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

      if (participantCategoryId === "66deba2b8d13756fe2697bee" || "66deba1c8d13756fe2697beb") {
        return Startup.findByIdAndUpdate(
          _id,
          { orderId: order.id, amount },
          { new: true }
        ).exec();
      } else if (participantCategoryId === "66deba3b8d13756fe2697bf1") {
        return Investor.findByIdAndUpdate(
          _id,
          { orderId: order.id, amount },
          { new: true }
        ).exec();
      } else if (participantCategoryId === "66e1617c158fdfa7198f4763") {
        return Visitor.findByIdAndUpdate(
          _id,
          { orderId: order.id, amount },
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
      participantCategoryId,
      startupId,
      investorId,
      visitorId,
      amount,
      currency,
      eventId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = req.body;

    console.log("body of pay ver", req.body)

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

        const find = await Startup.updateMany(
          { orderId: orderId },
          { IsPaid: true },
          { new: true }
        ).exec();
        // return res.redirect(
        //   `${REACT_APP_API_URL}/payment-success?reference=${paymentId}`
        // );
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

      const find = await Startup.updateMany(
        { orderId: orderId },
        { IsPaid: false },
        { new: true }
      ).exec();
      res.json({ success: false });
    }

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
