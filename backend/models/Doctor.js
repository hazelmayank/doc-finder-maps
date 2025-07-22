const mongoose=require("mongoose");


const doctorSchema=new mongoose.Schema({
    name:String,
    clinic:{
        address:String,
        location:{
            type:{type:String,enum:["Point"],required:true},
            coordinates:{type:[Number],required:true}
        }
        
    }
});

doctorSchema.index({ "clinic.location": "2dsphere" });

const Doctor=mongoose.model('Doctor',doctorSchema);

module.exports=Doctor;