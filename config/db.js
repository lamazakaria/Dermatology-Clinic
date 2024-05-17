const mongoose = require("mongoose");

function connectToDB() {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB")
    } catch (error) {
        console.log("Connected Failed to db",error);
    }
    
}

module.exports = connectToDB;

// mongoose.connect(process.env.MONGO_URL)
// .then(()=>console.log("Connected to DB"))
// .catch((error)=>console.log("Connected Failed to db",error));