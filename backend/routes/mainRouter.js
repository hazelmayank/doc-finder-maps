const express=require("express");
const router=express.Router();
const doctorRouter=require("./doctorRoutes");


router.use('/doctor',doctorRouter);

module.exports=router;