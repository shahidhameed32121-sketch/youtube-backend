const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use("/public", express.static("public")); 
app.use(express.static("public"));
app.use(cookieParser());

app.use(cors({
    origin: process.env.CORS_ORIGIN, // Make sure .env file mein ye URL sahi ho (usually http://localhost:3000)
    credentials: true
}));

app.use(helmet());
app.use(morgan('dev'));

// 👇 Routes Import
const userRouter = require('./routes/user.routes');
const videoRouter = require('./routes/video.routes');
const subscriptionRouter = require("./routes/subscription.routes"); // ✅ Yeh zaroori hai
const likeRouter = require("./routes/like.routes");
const commentRouter = require("./routes/comment.routes");
const tweetRouter = require("./routes/tweet.routes");
const playlistRouter = require("./routes/playlist.routes");
const dashboardRouter = require("./routes/dashboard.routes");

// 👇 Routes Declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/subscriptions", subscriptionRouter); // ✅ Yeh line button chalayegi
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// Default Route
app.get('/', (req, res) => {
    res.send('API is running securely...');
});

module.exports = { app };