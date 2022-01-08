 const Joi = require("joi");
 const mongo=require("../shared/connect");
 const bcrypt=require("bcrypt")
 const jwt=require("jsonwebtoken")

module.exports.getUser = async (req,res,next) => {
    try{
        var data = await mongo.db.collection("user").find().toArray();
        res.send(data);
    } 
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }
}

module.exports.signup = async (req,res,next) => {
 //this is just the schema how to validate
    const schema = Joi.object({
        name: Joi.string().min(4).max(15).required(),
        email: Joi.string().email().max(50).required(),
        password: Joi.string().min(5).max(15).required(),


       
    })
    // Input data validation
    const {error} = await schema.validate(req.body);
    console.log(error)
    if (error) return res.status(400).send({msg : error.details[0].message});

    // Email already exists validation
    const existUser = await mongo.db.collection("user").findOne({email : req.body.email});
    console.log(existUser)
    if(existUser) return res.status(400).send({msg : "Email already exists"});

    // Encrypt password
    const salt = await bcrypt.genSalt(5);
    req.body.password = await bcrypt.hash(req.body.password, salt)
    
    // Save in db
    var data = await mongo.db.collection("user").insertOne(req.body);
    res.json({
                 status:'ok',
            })
    
}


module.exports.login= async (req,res,next) => {

    const schema = Joi.object({
        email: Joi.string().email().max(50).required(),
        password: Joi.string().min(5).max(15).required()
    })
     
    // Input data validation
    const {error} = await schema.validate(req.body);
    if (error) return res.status(400).send({msg : error.details[0].message});

    // Is registered user validation
    const existUser = await mongo.db.collection("user").findOne({email : req.body.email});
    if(!existUser) return res.status(400).send({msg : "Email is not registered"});

    // Password compare check
    const isValid = await bcrypt.compare(req.body.password, existUser.password);
    
    if(!isValid) return res.status(400).send({msg:"Password didn't match"});

    // Generate token
    const token = jwt.sign(existUser,process.env.secretkey, {expiresIn :'1hr'})
    res.send(token);
}


module.exports.registersample = async (req,res,next) => {
    console.log(req.body)
    var data = await mongo.db.collection("user").insertOne(req.body);
    // res.send(data);
    res.json({
        status:'ok',
    })
    
}