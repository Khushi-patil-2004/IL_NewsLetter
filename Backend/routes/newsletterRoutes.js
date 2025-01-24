const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsletterController");
const multer = require("multer");

// Newsletter Routes
router.get("/", newsletterController.getAllNewsletters);
router.get("/:id", newsletterController.getNewsletterById);
router.post(
  "/",
  upload.fields([{ name: "poster" }, { name: "banner" }]),
  newsletterController.createNewsletter
);

router.get("/:id/export-csv", newsletterController.exportRsvpsCsv);
router.get("/:id/export-pdf", newsletterController.exportRsvpsPdf);
router.delete("/delete/:id", newsletterController.deleteNewsletter);

module.exports = router;
