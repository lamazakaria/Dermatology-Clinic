const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet")
const cors = require("cors");
const connectToDB = require("./config/db");


dotenv.config();

// connection to data base
connectToDB();


// Init App
const app = express();

// use the Middle Wares
app.use(express.json()); // handle json file to object file

app.use(helmet())
app.use(cors({
    orgin:"http://localhost:3000"
}))

// ROUTES
app.use("/home/admin",require("./routes/admins"));
app.use("/home/doctor",require("./routes/doctors"));
app.use("/home",require("./routes/home"))
app.use("/home/patient",require("./routes/Patients"))

// Middleware to handle URL not found (404)
app.use((req, res, next) => {
    const error = new Error(`Not Found This URL- ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        
            message: err.message
        
    });
});

// RUNNING SERVER  
PORT = process.env.PORT || 8000;
app.listen(PORT,()=>console.log(`SERVER IS RUNNING ON  ${PORT}`))