const Payment = require("../../models/Payment/Payment");

const Razorpay = require("razorpay");
const crypto = require("crypto");
const Startup = require("../../models/Master/Startup");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Key Secret
});

exports.checkout = async (req, res) => {
  const { amount, currency, startupId } = req.body;

  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      //   receipt,
    };

    const order = await razorpay.orders.create(options);

    console.log("order on checkout", order)
   
    const find = await Startup.findByIdAndUpdate(
      startupId, 
      { orderId: order.id },
      { new: true } 
    ).exec();

    console.log("find startup", find)


    res.status(200).json({
      success: true,
      order
      // orderId: order.id,
      // amount: order.amount,
      // currency: order.currency,
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
      // orderId,
      // paymentId,
      // signature,
      amount,
      currency,
      eventId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = req.body;

    console.log("body of pay ver",req.body)

    let paymentId = razorpay_payment_id;
    let orderId = razorpay_order_id;
    let signature = razorpay_signature;

    const body = orderId + "|" + paymentId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === signature) {
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

          const find = await Startup.findOneAndUpdate(
            { orderId: orderId },
            { new: true } 
          ).exec();
          // return res.redirect(
          //   `${REACT_APP_API_URL}/payment-success?reference=${paymentId}`
          // );
          return res.redirect(
            `${REACT_APP_API_URL}/register`
          );
        } catch (error) {
          return res.status(500).json({ success: false, error: error.message });
        }
        // res.json({ success: true });
      } else {
        // return res.redirect(
        //   `${REACT_APP_API_URL}/payment-failed?reference=${paymentId}`
        // );
        res.json({ success: false });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
