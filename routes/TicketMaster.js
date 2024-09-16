const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createTicketMaster, listTicketMasterByParams, listTicketMaster, getTicketMaster, updateTicketMaster, removeTicketMaster, listTicketMasterByParticipant } = require("../controllers/Master/TicketMaster");

router.post("/auth/ticketMaster", catchAsync(createTicketMaster));
router.get("/auth/list/ticketMaster", catchAsync(listTicketMaster));

router.post(
    "/auth/list-by-params/ticketMaster",
    catchAsync(listTicketMasterByParams)
);

router.get("/auth/get/ticketMaster/:_id", catchAsync(getTicketMaster));

router.get("/auth/list-by-participant/ticketMaster/:id", catchAsync(listTicketMasterByParticipant));

router.put(
    "/auth/update/ticketMaster/:_id",
    catchAsync(updateTicketMaster)
);

router.delete(
    "/auth/remove/ticketMaster/:_id",
    catchAsync(removeTicketMaster)
);


module.exports = router;