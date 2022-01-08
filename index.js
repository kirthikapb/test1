const express=require("express")
const app=express();
const mongo=require("./shared/connect")

const signRouter=require("./routes/signuproute")

var cors = require('cors');
const dotenv=require("dotenv")
dotenv.config();
app.use(cors());
// to convert req.body to json format
app.use(express.json())
mongo.connect()
app.use('/register',signRouter)
app.listen(process.env.PORT||3012)