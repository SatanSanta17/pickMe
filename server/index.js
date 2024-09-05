const express = require("express");
const app = express();
// Init Middleware
app.use(express.json());

const cors = require("cors"); // Import cors
// Enable CORS for all routes
app.use(cors());

const connectDB = require("./config/db");
// Connect Database
connectDB();

// Define Routes
// app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/candidateProfile", require("./routes/candidateProfile"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
