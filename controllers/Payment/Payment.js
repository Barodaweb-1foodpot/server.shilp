const Payment = require("../../models/Payment/Payment");

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Key Secret
});

exports.checkout = async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      //   receipt,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
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
      orderId,
      paymentId,
      signature,
      amount,
      currency,
      eventId,
    } = req.body;

    const body = orderId + "|" + paymentId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === signature) {
      if (expectedSignature === signature) {
        const payment = new Payment({
          participantCategoryId: participantCategoryId,
          startupId: startupId,
          investorId: investorId,
          visitorId: visitorId,
          amount,
          currency,
          eventId,
          paymentStatus: "Success",
          razorpay_orderId: orderId,
          razorpay_paymentId: paymentId,
          razorpay_signature: signature,
        });

        try {
          await payment.save();
          return res.redirect(
            `${REACT_APP_API_URL}/payment-success/${paymentId}`
          );
        } catch (error) {
          return res.status(500).json({ success: false, error: error.message });
        }
        // res.json({ success: true });
      } else {
        return res.redirect(
          `${REACT_APP_API_URL}/payment-failed/${paymentId}`
        );
        res.json({ success: false });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
