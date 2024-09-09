const Visitor = require("../../models/Master/Visitor");
const fs = require("fs");

exports.listVisitor = async (req, res) => {
    const list = await Visitor.find().sort({ createdAt: -1 }).exec();

    res.json(list);
};

exports.listVisitorByParams = async (req, res) => {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
        {
            $match: { IsActive: IsActive },
        },
        {
            $lookup: {
                from: "TicketMaster",
                localField: "ticketId",
                foreignField: "_id",
                as: "ticketDetails",
            },
        },
        {
            $unwind: {
                path: "$ticketDetails",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $set: {
                ticket: "$ticketDetails.name",
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
                        City: { $regex: match, $options: "i" },
                    },
                    {
                        ticket: { $regex: match, $options: "i" },
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
    //                         name: { $regex: match, $options: "i" },
    //                     },
    //                     {
    //                         contactNo: { $regex: match, $options: "i" },
    //                     },
    //                     {
    //                         email: { $regex: match, $options: "i" },
    //                     },
    //                     {
    //                         City: { $regex: match, $options: "i" },
    //                     },
    //                     {
    //                         ticket: { $regex: match, $options: "i" },
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

    const listVisitor = await Visitor.aggregate(query);

    res.json(listVisitor);
};

exports.createVisitor = async (req, res) => {
    try {
        const addVisitor = await new Visitor(req.body).save();
        res.status(200).json({
            isOk: true,
            data: addVisitor,
        });

    } catch (err) {
        console.log("Create Visitor error", err);
        return res.status(400).send(err);
    }
};

exports.getVisitor = async (req, res) => {
    const getVisitor = await Visitor.findOne({
        _id: req.params._id,
    }).exec();
    res.status(200).json(getVisitor);
};

exports.removeVisitor = async (req, res) => {
    try {
        const delVisitor = await Visitor.findOneAndRemove({
            _id: req.params._id,
        });
        console.log(delVisitor);
        res.status(200).json(delVisitor);
    } catch (err) {
        console.log("delete Visitor error", err);
        return res.status(400).send("delete Visitor failed");
    }
};

exports.updateVisitor = async (req, res) => {
    try {
        const update = await Visitor.findOneAndUpdate(
            { _id: req.params._id },
            req.body,
            { new: true }
        );
        res.status(200).json(update);
    } catch (err) {
        console.log(err);
        res.status(400).send("update Visitor failed");
    }
};

