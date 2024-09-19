const Investor = require("../../models/Master/Investor");
const fs = require("fs");

exports.listInvestor = async (req, res) => {
    const list = await Investor.find().sort({ createdAt: -1 }).exec();

    res.json(list);
};

exports.listInvestorByParams = async (req, res) => {
    let { skip, per_page, sorton, sortdir, match, IsActive, IsPaid } = req.body;

    let query = [
        {
            $match: { IsActive: IsActive , IsPaid: IsPaid},
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
                            name: { $regex: match, $options: "i" },
                        },
                        {
                            contactNo: { $regex: match, $options: "i" },
                        },
                        {
                            email: { $regex: match, $options: "i" },
                        },
                        {
                            City: { $regex: match, $options: "i" },
                        },
                        {
                            companyName: { $regex: match, $options: "i" },
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

    const listInvestor = await Investor.aggregate(query);

    res.json(listInvestor);
};

exports.createInvestor = async (req, res) => {
    try {
        // Save the new investor
        const addInvestor = await new Investor(req.body).save();

        // Populate 'investmentId' and within it, populate 'projectId'
        const populatedInvestor = await Investor.findById(addInvestor._id)
            .populate({
                path: 'ticketId',  // First, populate ticketId
        populate: {
          path: 'eventId',  // Then, populate eventId inside ticketId
          model: 'EventMaster',  // Specify the Event model
        },
            });

        // Construct a custom response with both investor data and populated project inside investmentId
        res.status(200).json({
            isOk: true,
            data: {
                ...addInvestor.toObject(),  // Include all investor data
                Event: populatedInvestor.ticketId?.eventId // Add populated project from investmentId
            },
        });
    } catch (err) {
        console.log("Create Investor error", err);
        return res.status(400).send(err);
    }
};

exports.getInvestor = async (req, res) => {
    const getInvestor = await Investor.findOne({
        _id: req.params._id,
    }).populate('ticketId').exec();
    res.status(200).json(getInvestor);
};

exports.removeInvestor = async (req, res) => {
    try {
        const delInvestor = await Investor.findOneAndRemove({
            _id: req.params._id,
        });
        console.log(delInvestor);
        res.status(200).json(delInvestor);
    } catch (err) {
        console.log("delete Investor error", err);
        return res.status(400).send("delete Investor failed");
    }
};

exports.updateInvestor = async (req, res) => {
    try {
        const update = await Investor.findOneAndUpdate(
            { _id: req.params._id },
            req.body,
            { new: true }
        );
        res.status(200).json(update);
    } catch (err) {
        console.log(err);
        res.status(400).send("update Investor failed");
    }
};

