const TicketMaster = require("../../models/Master/TicketMaster");
const fs = require("fs");

exports.listTicketMaster = async (req, res) => {
    const list = await TicketMaster.find().sort({ createdAt: -1 }).exec();
    res.json(list);
};

exports.listTicketMasterByParams = async (req, res) => {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
        {
            $match: { IsActive: IsActive },
        },
        {
            $lookup: {
                from: "participantcategorymasters",
                localField: "participantCategoryId",
                foreignField: "_id",
                as: "participant",
            },
        },
        {
            $unwind: {
                path: "$participant",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $set: {
                participantCategory: "$participant.categoryName",
            },
        },
        {
            $lookup: {
                from: "eventmasters",
                localField: "eventId",
                foreignField: "_id",
                as: "event",
            },
        },
        {
            $unwind: {
                path: "$event",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $set: {
                eventName: "$event.name",
            },
        },
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
                        eventName: { $regex: match, $options: "i" },
                    },
                    {
                        participantCategory: { $regex: match, $options: "i" },
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

    const listTicketMaster = await TicketMaster.aggregate(query);

    res.json(listTicketMaster);
};

exports.createTicketMaster = async (req, res) => {
    try {
        const addTicketMaster = await new TicketMaster(req.body).save();
        res.status(200).json({
            isOk: true,
            data: addTicketMaster,
        });

    } catch (err) {
        console.log("Create TicketMaster error", err);
        return res.status(400).send(err);
    }
};

exports.getTicketMaster = async (req, res) => {
    const getTicketMaster = await TicketMaster.findOne({
        _id: req.params._id,
    }).exec();
    res.status(200).json(getTicketMaster);
};

exports.removeTicketMaster = async (req, res) => {
    try {
        const delTicketMaster = await TicketMaster.findOneAndRemove({
            _id: req.params._id,
        });
        console.log(delTicketMaster);
        res.status(200).json(delTicketMaster);
    } catch (err) {
        console.log("delete TicketMaster error", err);
        return res.status(400).send("delete TicketMaster failed");
    }
};

exports.updateTicketMaster = async (req, res) => {
    try {
        const update = await TicketMaster.findOneAndUpdate(
            { _id: req.params._id },
            req.body,
            { new: true }
        );
        res.status(200).json(update);
    } catch (err) {
        console.log(err);
        res.status(400).send("update TicketMaster failed");
    }
};

