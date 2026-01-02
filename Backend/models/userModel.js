import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        requried:true,
        unique:true
    },
   password:{
    type:String,
    requried:true
   }


})

const User = mongoose.model.user || mongoose.model("User", userSchema);

export default User;