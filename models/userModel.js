import mongoose from "mongoose";



export const userSChema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    status:{
        type:String,
        enum: ['active','inactive'],
        default:"active"
    },
    Address: {
       type:Object,
     },

    
    


})

const User = mongoose.model('User',userSChema)
export default User