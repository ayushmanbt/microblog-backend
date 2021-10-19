//requiring things
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const blogsRouter = require("./router/blogsRouter");

//connecting to the database
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_CONNECTION_URL, (err) => {
    if(err) {
        console.log(err);
    }
    else{ 
        console.log("Connected to database!");
    }
})

const PORT = process.env.PORT || 5500

//initializing the app
const app = express();

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/blogs", blogsRouter);

//listening to port
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})