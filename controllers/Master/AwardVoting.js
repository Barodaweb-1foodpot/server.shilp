const AwardVoting = require("../../models/Master/AwardVoting");
const nodemailer = require('nodemailer');
const StartupCMS = require("../../models/StartupCMS/StartupCMS");
const Startup = require("../../models/Master/Startup");
const resetTokens = {};
const OTP_EXPIRATION_TIME = 5 * 60 * 1000;
const OTP_RESEND_INTERVAL = 60 * 1000;

exports.getAwardVoting = async (req, res) => {
    try {
        const find = await AwardVoting.findOne({ _id: req.params._id }).exec();
        res.json(find);
    } catch (error) {
        return res.status(500).send(error);
    }
};

exports.createAwardVoting = async (req, res) => {
    try {
        const add = await new AwardVoting(req.body).save();
        res.json(add);
    } catch (err) {
        return res.status(400).send(err);
    }
};

exports.listAwardVoting = async (req, res) => {
    try {
        const list = await AwardVoting.find({ IsActive: true }).exec();
        res.json(list);
    } catch (error) {
        return res.status(400).send(error);
    }
};

exports.listAwardVotingByParams = async (req, res) => {
    try {
        let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

        let query = [
            {
                $match: { IsActive: IsActive },
            },
            {
                $lookup: {
                    from: "awardcategories",
                    localField: "awardCategoryId",
                    foreignField: "_id",
                    as: "awardDetails",
                },
            },
            {
                $unwind: {
                    path: "$awardDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $set: {
                    award: "$awardDetails.awardName",
                },
            },

            {
                $lookup: {
                    from: "startups",
                    localField: "startupId",
                    foreignField: "_id",
                    as: "startup",
                },
            },
            {
                $unwind: {
                    path: "$startup",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $set: {
                    startupName: "$startup.companyName",
                },
            },
            {
                $match: {
                    $or: [
                        {
                            startupName: { $regex: match, $options: "i" },
                        },
                        {
                            award: { $regex: match, $options: "i" },
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
        // if (match) {
        //     query = [
        //         {
        //             $match: {
        //                 $or: [
        //                     {
        //                         categoryName: { $regex: match, $options: "i" },
        //                     },
        //                 ],
        //             },
        //         },
        //     ].concat(query);
        // }

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

        const list = await AwardVoting.aggregate(query);

        res.json(list);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateAwardVoting = async (req, res) => {
    try {
        const update = await AwardVoting.findOneAndUpdate(
            { _id: req.params._id },
            req.body,
            { new: true }
        );
        res.json(update);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.removeAwardVoting = async (req, res) => {
    try {
        const delTL = await AwardVoting.findOneAndRemove({
            _id: req.params._id,
        });
        res.json(delTL);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.listActiveAwardVoting = async (req, res) => {
    try {
        const list = await AwardVoting.find({ IsActive: true })
            .sort({ createdAt: -1 })
            .exec();
        console.log("list avi", list);
        res.json(list);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const existingEmail = await AwardVoting.findOne({ email });

        if (existingEmail) {
            return res.status(200).json({ error: 'Email already exists.' });
        } else {
            const otp = Math.floor(100000 + Math.random() * 900000);

            resetTokens[email] = {
                otp: otp,
                timestamp: Date.now(),
            };

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAILID,
                    pass: process.env.PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.EMAILID,
                to: email,
                subject: 'Your OTP for Email Verification',
                text: `Your OTP is ${otp}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ error: 'Error sending OTP' });
                } else {
                    return res.status(200).json({ isOk: true, message: 'OTP sent successfully', otp });
                }
            });
        }
    } catch (error) {
        console.error('Error checking email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.verifyOTP = async (req, res) => {
    const { email, otp, id } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }
    try {

        const tokenData = resetTokens[email];
        // console.log("tokendata pppp", tokenData, otp)

        if (!tokenData) {
            return res.status(500).json({ error: 'No OTP found for this email' });
        } else {

            const currentTime = Date.now();
            if (currentTime - tokenData.timestamp > OTP_EXPIRATION_TIME) {
                return res.status(500).json({ isOk: false, error: 'OTP has expired' });
            } else {
                if (tokenData.otp != otp) {
                    return res.status(500).json({ isOk: false, error: 'Invalid OTP' });
                }
                else {
                    

                    const find = await StartupCMS.findById({
                        _id: id,
                    });

                    const data = await new AwardVoting({
                        // awardCategoryId,
                        startupId: find.startupName,
                        email,
                    }).save();

                    const updatedStartup = await Startup.findOneAndUpdate(
                        { _id: find.startupName },
                        { $inc: { votes: 1 } },
                        { new: true }
                    );

                    if (!updatedStartup) {
                        return res.status(404).json({ isOk: false, message: "Startup not found" });
                    } else {
                        return res.status(200).json({ isOk: true, message: 'OTP verified successfully', data: updatedStartup });
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error checking email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.resendOtp = async (req, res) => {
    try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            const existingEmail = await AwardVoting.findOne({ email });

            if (existingEmail) {
                return res.status(200).json({ isOk: true, msg: 'Email already exists.' });
            }

            // const tokenData = resetTokens[email];

            // if (tokenData) {
            //     const currentTime = Date.now();
            //     const timeSinceLastRequest = currentTime - tokenData.timestamp;

            //     if (timeSinceLastRequest < OTP_RESEND_INTERVAL) {
            //         return res.status(200).json({ isOk: true, msg: `Please wait ${Math.ceil((OTP_RESEND_INTERVAL - timeSinceLastRequest) / 1000)} seconds before requesting a new OTP` });
            //     }
            // }

            const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

            resetTokens[email] = {
                otp: otp,
                timestamp: Date.now(), // Update the time when the new OTP was generated
            };

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAILID,
                    pass: process.env.PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.EMAILID,
                to: email,
                subject: 'Your OTP for Email Verification',
                text: `Your OTP is ${otp}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ error: 'Error sending OTP' });
                } else {
                    return res.status(200).json({ isOk: true, msg: 'OTP sent successfully', otp });
                }
            });


            // return res.status(200).json({ message: 'New OTP sent successfully', otp });

        
    } catch (error) {
        console.error('Error checking email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
