const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const User = require('./models/User'); 
const playlistRoutes = require('./routes/playlist');


require("dotenv").config();

const pageRoutes = require("./routes/pages");
const authRoutes = require("./routes/auth");
const buyCourseRoutes = require("./routes/buyCourse");
const tutorRoutes = require("./routes/tutor"); // Import tutor routes
const healthRoutes = require("./routes/health");
const { authenticateUser } = require("./middlewares/auth"); // Import authenticateUser middleware
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 8080;
require("./db"); // connects to mongodb
// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(morgan("dev"));
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/health", healthRoutes);

app.use(authenticateUser);


app.use("/", pageRoutes);        
app.use("/auth", authRoutes);    
app.use('/playlist', playlistRoutes); 
app.use("/buy-course", buyCourseRoutes);
app.use("/tutor", tutorRoutes);

app.use(express.static(path.join(__dirname, "public")));
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

