require('dotenv').config();
const { app } = require('./app'); // 👈 Yeh Curly Braces { } bohot zaroori hain
const connectDB = require('./config/db');

const PORT = process.env.PORT || 8000;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`⚙️  Server is running at port: ${PORT}`);
    });
})
.catch((err) => {
    console.log("❌ MongoDB connection failed !!! ", err);
});