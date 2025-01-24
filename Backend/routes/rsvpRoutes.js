const express = require("express");
const router = express.Router();
const rsvpController = require("../controllers/rsvpController");

router.post("/:id/rsvp", rsvpController.createRsvp);

module.exports = router;
