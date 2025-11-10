
import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();

 export const  connectdb= async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database suceesfuly connected");
        
    }
    catch(error){
        console.error("Mongodb Connection Failed",error.message)
    }
}



export const adminCollection=mongoose.connection.collection("admin") 
export const CategoeryCollection=mongoose.connection.collection("Categoery") 

export default connectdb