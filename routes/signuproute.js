var express = require("express");
var router = express.Router();
var employeeModule = require('../modules/signupmodule');
 router.get("/get", employeeModule.getUser);
 router.post("/signup", employeeModule.signup);
 router.post("/login", employeeModule.login);
module.exports=router;