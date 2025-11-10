
import mongoose from "mongoose"

 export const  connectdb= async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/NewEcommerce")
        console.log("Database suceesfuly connected");
        
    }
    catch(error){
        console.error("Mongodb Connection Failed",error.message)
    }
}



export const adminCollection=mongoose.connection.collection("admin") 
export const CategoeryCollection=mongoose.connection.collection("Categoery") 

export default connectdb