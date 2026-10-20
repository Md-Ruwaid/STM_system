import express from "express";
import dotenv from "dotenv"
import "./config/database.js"

dotenv.config()
const app = express();
const port = process.env.PORT || 5000;

app.get("/health",(req,res) =>{
    res.status(200).json({msg : "server is collecting APis just fine"})
})

app.listen(port , ()=>{
    console.log(`server is running at ${port}`)
})
