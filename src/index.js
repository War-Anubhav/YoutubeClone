// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
const port = process.env.PORT || 8000
import app from "./app.js"

dotenv.config({
    path: './.env'
})

connectDB()
.then(() =>{
    app.on("error", (error) => {
        console.log("Error: ", error);
        throw error
    })
    app.listen(port ,() => {
        console.log(`Server is running at port :${port}`)
    })
})
.catch((err) => {
    console.log("MONGO db connection Failed !! ",err)
})















/*
import express from "express";
const app = express()

;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        app.on("error", (error) => {
            console.log("Error: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port: ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR:", error)
        throw error
    }
})()
*/