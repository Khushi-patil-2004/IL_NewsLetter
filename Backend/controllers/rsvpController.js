const Newsletter = require("../models/Newsletter");

const createRsvp = async (req, res) => {
  try {
    const { studentName, studentEmail } = req.body;

    if (!studentName || !studentEmail) {
      return res
        .status(400)
        .json({ error: "Both studentName and studentEmail are required." });
    }

    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ error: "Newsletter not found." });
    }

    newsletter.rsvps.push({ studentName, studentEmail });
    await newsletter.save();

    res.status(201).json({ message: "RSVP successfully submitted!" });
  } catch (error) {
    console.error("Error creating RSVP:", error.message);
    res.status(500).json({ error: "Internal Server Error. Please try again." });
  }
};

module.exports = { createRsvp };
