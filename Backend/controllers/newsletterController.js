const Newsletter = require("../models/Newsletter");
const { Parser } = require("json2csv");
const pdf = require("html-pdf");

const getAllNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.find({});
    res.status(200).json(newsletters);
  } catch (error) {
    res.status(500).json({ message: "Error fetching newsletters" });
  }
};

const getNewsletterById = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) return res.status(404).send("Newsletter not found");
    res.status(200).json(newsletter);
  } catch (error) {
    res.status(500).send("Error retrieving newsletter");
  }
};

const createNewsletter = async (req, res) => {
  const {
    title,
    description,
    theme,
    guidelines,
    prizes,
    keyDates,
    registrationLink,
    contactInfo,
    capacity,
  } = req.body;
  const { poster, banner } = req.files;

  if (!poster || !banner) {
    return res
      .status(400)
      .json({ message: "Both poster and banner are required" });
  }

  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
  if (
    !allowedImageTypes.includes(poster[0].mimetype) ||
    !allowedImageTypes.includes(banner[0].mimetype)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid file type for poster or banner" });
  }

  try {
    const newNewsletter = new Newsletter({
      title,
      description,
      theme,
      guidelines,
      prizes,
      keyDates,
      registrationLink,
      contactInfo,
      capacity,
      poster: poster[0].filename,
      banner: banner[0].filename,
    });

    await newNewsletter.save();
    res.status(200).send("Newsletter created successfully");
  } catch (error) {
    res.status(500).send("Error creating newsletter");
  }
};

const deleteNewsletter = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Deleting newsletter with ID: ${id}`); // Debug log

    const newsletter = await Newsletter.findByIdAndDelete(id);
    console.log(newsletter);
    if (!newsletter) {
      console.log(`Newsletter not found for ID: ${id}`);
      return res.status(404).send("Newsletter not found");
    }

    console.log("Newsletter deleted successfully:", newsletter);
    res.status(200).send("Newsletter deleted successfully");
  } catch (error) {
    console.error("Error deleting newsletter:", error);
    res.status(500).send("Error deleting newsletter");
  }
};

const exportRsvpsCsv = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter)
      return res.status(404).json({ error: "Newsletter not found" });

    const rsvps = newsletter.rsvps;
    const fields = ["studentName", "studentEmail"];
    const json2csvParser = new Parser({ fields });

    const csv = json2csvParser.parse(rsvps);
    res.header("Content-Type", "text/csv");
    res.attachment(`${newsletter.title}_rsvps.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: "Error exporting RSVPs as CSV" });
  }
};

const exportRsvpsPdf = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter)
      return res.status(404).json({ error: "Newsletter not found" });

    const rsvps = newsletter.rsvps;
    if (!rsvps || rsvps.length === 0)
      return res
        .status(404)
        .json({ error: "No RSVPs found for this newsletter" });

    const rsvpListHtml = rsvps
      .map(
        (rsvp) =>
          `<p>Name: ${rsvp.studentName}, Email: ${rsvp.studentEmail}</p>`
      )
      .join("");

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            h1 { color: #333; }
            p { font-size: 14px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>${newsletter.title} - RSVPs</h1>
          <div>${rsvpListHtml}</div>
        </body>
      </html>
    `;

    pdf.create(html).toStream((err, stream) => {
      if (err) return res.status(500).json({ error: "Error creating PDF" });
      res.header("Content-Type", "application/pdf");
      res.attachment(`${newsletter.title}_rsvps.pdf`);
      stream.pipe(res);
    });
  } catch (error) {
    res.status(500).json({ error: "Error exporting RSVPs as PDF" });
  }
};

module.exports = {
  getAllNewsletters,
  getNewsletterById,
  createNewsletter,
  exportRsvpsCsv,
  exportRsvpsPdf,
  deleteNewsletter,
};
