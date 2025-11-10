import express from "express";
import { addCategoery, adminlogin,viewCategoery ,updateCategoery,deleteCategory, addProduct, updateProduct, deleteProduct, getProductsByCategory, allUsers, getAllproduct, UpdateUser} from "../controller/adminController.js"
import { isAdminAuth } from "../middleware/middleware.js";
import multer from "multer";
import Category from "../models/categoeryModel.js";



const aroute= express.Router();

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'_'+file.originalname)
    }
})

aroute.post("/login",adminlogin );
aroute.get("/allCategoery",viewCategoery)
// aroute.get("/Allproduct",getAllproduct)

aroute.get("/allproducts",getAllproduct)



// aroute.use(isAdminAuth)

const upload=multer({storage:storage})
aroute.post("/add/Categoery",upload.single('file'),addCategoery)
aroute.put("/updateCategoery", upload.single("file"), updateCategoery);
aroute.delete("/delete/:id",deleteProduct)
aroute.delete("/Delete/Categoery/:id",deleteCategory)
const uploads=multer({storage:storage})
aroute.post("/add/product",uploads.single('file'),addProduct)

aroute.put("/update/product", uploads.single("file"), updateProduct);
aroute.get("/allUsers",allUsers)
aroute.get("/allproducts",getAllproduct)
aroute.put("/user/:id",UpdateUser)

export default aroute;
