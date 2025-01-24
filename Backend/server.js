const express = require("express");
const cors = require("cors");
const connectDB = require("./models/db");
const newsletterRoutes = require("./routes/newsletterRoutes");

const rsvpRoutes = require("./routes/rsvpRoutes");
const path = require("path");

require("dotenv").config();
// Initialize app
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Routes
app.use("/api/newsletters", newsletterRoutes);

app.use("/api/newsletter", rsvpRoutes);

// Connect to DB
connectDB();

// Server listening
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
