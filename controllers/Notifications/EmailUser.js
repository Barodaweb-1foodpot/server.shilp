var nodemailer = require("nodemailer");
require("dotenv").config();
const Orders = require("../../models/Products/Orders/OrderNew");
const orderDetails = require("../../models/Products/Orders/OrderDetailsNew");
const moment = require("moment");
const UserShippingAddress = require("../../models/Auth/User/UserShippingAddressMaster");
const Users = require("../../models/Auth/User/Users");
const mongoose = require("mongoose");
const State = require("../../models/Location/State");
const Country = require("../../models/Location/Country");
const CompanyDetails = require("../../models/Setup/CompanyDetails");
const DeliveryOptions = require("../../models/DeliveryOptions/DeliveryOption");
const CompanyLocation = require("../../models/Location/Location");
exports.sendEmailOnOrderPlaced = async (req, res) => {
  try {
    const {
      emailFrom,
      emailPassword,
      CCMail,
      emailSubject,
      emailBody,
      outServer,
      outPort,
      orderid,
    } = req.body;

    // const { orderid } = req.body;

    console.log("email parameters ", req.body);
    // const orderData = await Orders.findOne({ _id: orderid });

    let query = [
      {
        $match: { _id: new mongoose.Types.ObjectId(orderid) },
      },

      {
        $lookup: {
          from: "usershippingaddressmasters",
          localField: "shippingAddress",
          foreignField: "_id",
          as: "shippAddress", // Temporary field to hold the product details
        },
      },
      {
        $addFields: {
          shippAddress: {
            $arrayElemAt: ["$shippAddress", 0], // Retrieve the first element from the productDetailsTemp array
          },
        },
      },

      {
        $unwind: { path: "$orderId", preserveNullAndEmptyArrays: true },
      },

      {
        $lookup: {
          from: "ordersdetilsnews",
          localField: "orderId",
          foreignField: "_id",
          as: "orderDetails",
        },
      },
      {
        $unwind: { path: "$orderDetails", preserveNullAndEmptyArrays: true },
      },

      {
        $lookup: {
          from: "productdetailsnews",
          localField: "orderDetails.productId",
          foreignField: "_id",
          as: "productDetailsTemp", // Temporary field to hold the product details
        },
      },
      {
        $addFields: {
          "orderDetails.productDetails": {
            $arrayElemAt: ["$productDetailsTemp", 0], // Retrieve the first element from the productDetailsTemp array
          },
        },
      },

      {
        $lookup: {
          from: "productvariants",
          localField: "orderDetails.productVariantsId",
          foreignField: "_id",
          as: "productvariantsTemp",
        },
      },
      {
        $unwind: {
          path: "$productvariantsTemp",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "parametervalues",
          localField: "productvariantsTemp.productVariants",
          foreignField: "_id",
          as: "parametervalues",
        },
      },
      {
        $unwind: {
          path: "$parametervalues",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "parametermasters",
          localField: "parametervalues.parameterId",
          foreignField: "_id",
          as: "parametermaster",
        },
      },
      {
        $unwind: {
          path: "$parametermaster",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          parameterName: "$parametermaster.parameterName",
        },
      },

      {
        $set: {
          parameter: {
            parameterName: "$parameterName",
            parameterValue: "$parametervalues.parameterValue",
          },
        },
      },

      {
        $project: {
          productDetailsTemp: 0, // Exclude the temporary field from the output
          "orderDetails.productDetails.productDescription": 0, // Exclude unwanted fields from productDetails
          "orderDetails.productDetails.basePrice": 0,
          "orderDetails.productDetails.weight": 0,
          "orderDetails.productDetails.unit": 0,
          "orderDetails.productDetails.productOptionId": 0,
          "orderDetails.productDetails.productVariantsId": 0,
          "orderDetails.productDetails.isOutOfStock": 0,
          "orderDetails.productDetails.isSubscription": 0,
          "orderDetails.productDetails.IsActive": 0,
          "orderDetails.productDetails.createdAt": 0,
          "orderDetails.productDetails.updatedAt": 0,
          "orderDetails.productDetails.categories": 0,
          "orderDetails.productDetails._id": 0,
          "orderDetails.productDetails.__v": 0,
        },
      },
      {
        $lookup: {
          from: "subscriptionmasters",
          localField: "orderDetails.subsId",
          foreignField: "_id",
          as: "subsDetialsTemp", // Temporary field to hold the product details
        },
      },
      {
        $addFields: {
          "orderDetails.SubscriptionDetails": {
            $arrayElemAt: ["$subsDetialsTemp", 0], // Retrieve the first element from the productDetailsTemp array
          },
        },
      },
      {
        $project: {
          subsDetialsTemp: 0, // Exclude the temporary field from the output
          "orderDetails.SubscriptionDetails.savePercentage": 0, // Exclude unwanted fields from productDetails
          "orderDetails.SubscriptionDetails.days": 0,
          "orderDetails.SubscriptionDetails.IsActive": 0,
          "orderDetails.SubscriptionDetails.createdAt": 0,
          "orderDetails.SubscriptionDetails.updatedAt": 0,
          "orderDetails.SubscriptionDetails.categories": 0,
          "orderDetails.SubscriptionDetails._id": 0,
          "orderDetails.SubscriptionDetails.__v": 0,
        },
      },

      {
        $group: {
          _id: "$orderDetails.productVariantsId",
          // orderId: "$orderId",
          productName: {
            $first: "$orderDetails.productDetails.productName",
          },
          productImage: {
            $first: "$orderDetails.productDetails.productImage",
          },
          subtitle: {
            $first: "$orderDetails.SubscriptionDetails.title",
          },
          amount: { $first: "$orderDetails.amount" },
          quantity: { $first: "$orderDetails.quantity" },

          // orderId: { $push: "$orderId" },
          userId: { $first: "$userId" },
          // orderId: { $first: "$orderId" },
          randomOrderId: { $first: "$randomOrderId" },
          totalAmount: { $first: "$totalAmount" },
          userId: { $first: "$userId" },
          subTotal: { $first: "$subTotal" },
          orderComment: { $first: "$orderComment" },
          deliveryData: { $first: "$deliveryData" },
          shippingCharge: { $first: "$shippingCharge" },
          createdAt: { $first: "$createdAt" },
          billingAddress: { $first: "$billingAddress" },
          OrderStatus: { $first: "$OrderStatus" },
          isPaid: { $first: "$isPaid" },
          parameter: { $push: "$parameter" },
          shippAddress: { $first: "$shippAddress" },
          DeliveryType: { $first: "$DeliveryType" },
        },
      },

      {
        $project: {
          _id: 1,
          // userId: 1,
          orderId: 1,
          userId: 1,
          totalAmount: 1,
          subTotal: 1,
          orderComment: 1,
          shippingCharge: 1,
          randomOrderId: 1,
          createdAt: 1,
          // billingAddress: 1,
          deliveryData: 1,
          OrderStatus: 1,
          isPaid: 1,
          parameter: 1,
          productName: 1,
          productImage: 1,
          subtitle: 1,
          amount: 1,
          quantity: 1,
          DeliveryType: 1,
          "shippAddress._id": 1,
          "shippAddress.addressLine1": 1,
          // "shippAddress.addressLine2": 1,
          "shippAddress.stateId": 1,
          "shippAddress.countryId": 1,
          "shippAddress.contactNo": 1,
          // "shippAddress.zipCode": 1,
          "shippAddress.firstName": 1,
          // "shippAddress.lastName": 1,
        },
      },
    ];

    const OrdersData = await Orders.aggregate(query).exec();

    console.log("email order OrdersData", OrdersData[0]);
    const usersData = await Users.findOne({ _id: OrdersData[0].userId });
    const delivery = await DeliveryOptions.findOne({
      _id: OrdersData[0]?.DeliveryType,
    });

    if (!OrdersData[0].shippAddress) {
      OrdersData.map((order) => {
        order.shippAddress = null;
        return order;
      });

      let delOption = "";
      let companyLocationList = "";
      delOption = await DeliveryOptions.findOne({
        _id: OrdersData?.DeliveryType,
      });

      companyLocationList = await CompanyLocation.findOne({
        _id: delOption?.DeliveryAddress[0],
      });
      const statenameCA = await State.findOne({
        _id: companyLocationList?.StateID,
      });

      const countrynameCA = await Country.findOne({
        _id: companyLocationList?.CountryID,
      });

      OrdersData.map((order) => {
        order.companyAddress = {
          addressLine1: companyLocationList ? companyLocationList.Address : "",
          stateId: statenameCA ? statenameCA.StateName : "",
          countryId: countrynameCA ? countrynameCA.CountryName : "",
          contactNo: companyLocationList ? companyLocationList.ContactNo : "",
          // zipCode: companyLocationList.Pincode,
          firstName: companyLocationList ? companyLocationList.CompanyName : "",
        };
        return order;
      });

      console.log(OrdersData);
    } else {
      // if (OrdersData[0].shippAddress._id !== null) {
      const state = await State.findOne({
        _id: OrdersData[0].shippAddress.stateId,
      });

      const country = await Country.findOne({
        _id: OrdersData[0].shippAddress.countryId,
      });

      OrdersData.map((order) => {
        order.shippAddress.stateId = state ? state.StateName : "";
        order.shippAddress.countryId = country ? country.CountryName : "";
        return order;
      });
      // }
    }

    const orderNumber = OrdersData[0].randomOrderId;
    const orderDate = moment(new Date(OrdersData[0].createdAt)).format(
      "MMMM DD, YYYY"
    );
    let list = [];

    OrdersData.forEach((product, index) => {
      let parametersHTML = ""; // Initialize an empty string to store HTML for parameters
      let subscriptionHTML = "";
      if (product.parameter && product.parameter.length > 0) {
        product.parameter.forEach((param) => {
          if (param.parameterName && param.parameterValue) {
            // Check if both name and value are defined
            parametersHTML += `<p><strong>${param.parameterName}:</strong> ${param.parameterValue}</p>`;
          }
        });
      }
      if (product.subtitle !== null) {
        subscriptionHTML += `<p><strong>Subscribed:</strong> ${product.subtitle}</p>`;
      }

      list += `

        <tr>
          <td><img src="${
            process.env.API_URL_COFFEE + "/" + product.productImage
          }" alt="image" width="80" height="80"></td>
          <td style="font-size: 14px;">${
            product.productName
          }         ${parametersHTML} 
          ${subscriptionHTML}
          </td>
          <td style="font-size: 14px;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${
            product.quantity
          }</td>
          <td style="font-size: 14px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${product.amount.toFixed(
            2
          )}</td>
          
    
        </tr>
      `;
    });

    // console.log("list", list);

    var body2 = emailBody
      .replace("{{orderNo}}", orderNumber)
      .replace("{{orderDate}}", orderDate)
      .replace("{{shippinginfo}}", delivery.DeliveryType)

      .replace(
        "{{addressline1}}",
        OrdersData[0].shippAddress
          ? OrdersData[0].shippAddress.addressLine1
          : OrdersData[0].companyAddress.addressLine1
      )
      // .replace("{{addressline2}}", OrdersData.shippAddress.addressLine2)
      .replace(
        "{{statename}}",
        OrdersData[0].shippAddress
          ? OrdersData[0].shippAddress.stateId
          : OrdersData[0].companyAddress.stateId
      )
      .replace(
        "{{countryname}}",
        OrdersData[0].shippAddress
          ? OrdersData[0].shippAddress.countryId
          : OrdersData[0].companyAddress.countryId
      )
      .replace(
        "{{firstname}}",
        OrdersData[0].shippAddress
          ? OrdersData[0].shippAddress.firstName
          : OrdersData[0].companyAddress.firstName
      )
      // .replace(
      //   "{{lastname}}",
      //   OrdersData[0].shippAddress ? OrdersData[0].shippAddress.lastName : null
      // )
      // .replace(
      //   "{{zipcode}}",
      //   OrdersData[0].shippAddress
      //     ? OrdersData[0].shippAddress.zipCode
      //     : OrdersData[0].companyAddress.zipCode
      // )
      .replace(
        "{{contactNo}}",
        OrdersData[0].shippAddress
          ? OrdersData[0].shippAddress.contactNo
          : OrdersData[0].companyAddress.contactNo
      )
      .replace(
        "{{subtotal}}",
        `<span style="font-size: 16px;">${OrdersData[0].subTotal.toFixed(
          2
        )}</span>`
      )

      .replace("{{productDetails}}", list)
      .replace(
        "{{total}}",
        `<span style="font-size: 16px;">${OrdersData[0].totalAmount.toFixed(
          2
        )}</span>`
      )
      .replace(
        "{{shipping}}",
        `<span style="font-size: 16px;">${OrdersData[0].shippingCharge.toFixed(
          2
        )}</span>`
      )

      .replace(
        "{{discount}}",
        `<span style="font-size: 16px;">${OrdersData[0].discount}</span>`
      );

    // .replace("{{tax}}", `<span style="font-size: 16px;">${0.0}</span>`)
    // .replace(
    //   "{{discount}}",
    //   `<span style="font-size: 16px;">${OrdersData[0].discount}</span>`
    // );

    var transpoter = nodemailer.createTransport({
      service: outServer,
      port: outPort,
      auth: {
        user: emailFrom,
        pass: emailPassword,
      }, 
    });

    const emailTo = usersData.email;

    console.log("email to", emailTo, emailFrom);
    var mailOptions = {
      from: emailFrom,
      to: `${emailTo} <${emailTo}>`,
      // bcc: sentemailTo,
      subject: emailSubject,
      html: body2,
    };

    transpoter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.json(error);
      } else {
        console.log("Email sent: " + info.response);
        res.json("Email sent: " + info.response);
      }
    });

    // transpoter.verify(function(error, info) {
    //   if (error) {
    //     console.log('Error:', error);
    //   } else {
    //     console.log('Server is ready to take our messages', info);
    //   }
    // });

    // res.json(OrdersData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.sendEmail = async (req, res) => {
  try {
    const {
      emailFrom,
      emailPassword,
      CCMail,
      emailSubject,
      emailBody,
      outServer,
      outPort,
      emailTo,
    } = req.body;

    // console.log("send email parameters ", req.body);

    // var transpoter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: emailFrom,
    //     pass: emailPassword,
    //   },
    // });

    var transpoter = nodemailer.createTransport({
      service: outServer,
      port: outPort,
      auth: {
        user: emailFrom,
        pass: emailPassword,
      }, 
    });

    var body2 = emailBody;

    var mailOptions = {
      from: emailFrom,
      to: `${emailTo} <${emailTo}>`,
      bcc: CCMail,
      subject: emailSubject,
      html: body2,
    };

    transpoter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.json(error);
      } else {
        console.log("Email sent: " + info.response);
        res.json("Email sent: " + info.response);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.emailOnBulk = async (req, res) => {
  try {
    // const SMTP_SERVER = "smtp.example.com";
    // const SMTP_PORT = 587;
    // const SMTP_USERNAME = "your_smtp_username";
    // const SMTP_PASSWORD = "your_smtp_password";
    // const FROM_EMAIL = "your_email@example.com";
    // const SUBJECT = "Your Subject";
    // const BODY = "Your Email Body";

    const body2 = `
  <html>
    <head>
      <style>
        /* Add your CSS styles here */
        body {
          font-family: Arial, sans-serif;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #663300;
        }
        .content {
          text-align: justify;
          line-height: 1.5;
        }
        .cta-button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #663300;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Nick's Roasting Co.</h1>
        </div>
        <div class="content">
          <p>Dear Coffee Lover,</p>
          <p>Are you ready to awaken your senses with the finest coffee beans from around the world?</p>
          <p>At Nick's Roasting Co., we're passionate about delivering exceptional coffee experiences. Our carefully curated selection of premium coffee beans ensures that every cup is a delight to savor.</p>
          <p>Whether you prefer the bold richness of dark roast, the smoothness of medium roast, or the subtle flavors of light roast, we have something for every palate.</p>
          <p>Experience the difference today and elevate your coffee game!</p>
          <p><strong>Exclusive Offer:</strong> Get 10% off your first order with code <strong>COFFEE10</strong>.</p>
          <a href="http://nicks.barodaweb.com" class="cta-button">Shop Now</a>
        </div>
        <div class="footer">
          <p>Stay Caffeinated,</p>
          <p>The Nick's Roasting Co. Team</p>
        </div>
      </div>
    </body>
  </html>
`;

    const list = await Users.find().sort({ createdAt: -1 }).exec();

    // List of recipients
    // const TO_EMAILS = ["dharvi2805@gmail.com", "dharvi.marwiz@gmail.com", "mit.marwiz@gmail.com"];

    var transpoter = nodemailer.createTransport({
      // host: SMTP_SERVER,
      // port: SMTP_PORT,
      // secure: false,
      service: "gmail",
      auth: {
        user: "",
        pass: "",
      },
    });

    for (const user of list) {
      var mailOptions = {
        from: "Nick's Roasting Co.",
        to: user.email,
        subject: "April Special",
        html: body2,
      };

      transpoter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent to", user.email, ":", info.response);
        }
      });

      // const info = await transpoter.sendMail(mailOptions);
      // console.log('Email sent to', user.email, ':', info.response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
