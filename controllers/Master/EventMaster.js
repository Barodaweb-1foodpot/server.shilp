const EventMaster = require("../../models/Master/EventMaster");
const fs = require("fs");

exports.listEventMaster = async (req, res) => {
    const list = await EventMaster.find({IsActive: true}).sort({ createdAt: -1 }).exec();

    res.json(list);
};

exports.listEventMasterByParams = async (req, res) => {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
        {
            $match: { IsActive: IsActive },
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

    const listEventMaster = await EventMaster.aggregate(query);

    res.json(listEventMaster);
};

exports.createEventMaster = async (req, res) => {
    try {
        const addEventMaster = await new EventMaster(req.body).save();
        res.status(200).json({
            isOk: true,
            data: addEventMaster,
        });

    } catch (err) {
        console.log("Create EventMaster error", err);
        return res.status(400).send(err);
    }
};

exports.getEventMaster = async (req, res) => {
    const getEventMaster = await EventMaster.findOne({
        _id: req.params._id,
    }).exec();
    res.status(200).json(getEventMaster);
};

exports.removeEventMaster = async (req, res) => {
    try {
        const delEventMaster = await EventMaster.findOneAndRemove({
            _id: req.params._id,
        });
        console.log(delEventMaster);
        res.status(200).json(delEventMaster);
    } catch (err) {
        console.log("delete EventMaster error", err);
        return res.status(400).send("delete EventMaster failed");
    }
};

exports.updateEventMaster = async (req, res) => {
    try {
        const update = await EventMaster.findOneAndUpdate(
            { _id: req.params._id },
            req.body,
            { new: true }
        );
        res.status(200).json(update);
    } catch (err) {
        console.log(err);
        res.status(400).send("update EventMaster failed");
    }
};

