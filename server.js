import mongoose from "mongoose";
import express from "express"
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/userRoutes.js";
import bcrypt from "bcrypt"
import session from "express-session";
import MongoStore from "connect-mongo";
import aroute from "./routes/adminRoutes.js"
import { addCategoery, viewCategoery,updateCategoery, deleteCategory, addProduct, viewProductById, deleteProduct, updateProduct, getProductsByCategory, allUsers, getAllproduct,adminlogin} from "./controller/adminController.js";
import { userOrder,allorder } from "./controller/orderController.js";
import {connectdb} from "./config/db.js";
import cors from 'cors'

import path from "path";

const app=express()


app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use("/uploads", express.static("uploads"));


app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

 connectdb()

app.use('/uploads',express.static(path.join(process.cwd(),"uploads")))
app.use(session({
  secret:"yas",
  resave:false,
  saveUninitialized:false,
  store:MongoStore.create({
    mongoUrl:(process.env.MONGO_URI),
      collectionName: "sessions",
  }),cookie:{
    maxAge:1000*60*60*24,
  },
}))





 app.use(router)
 app.use("/admin",aroute)
//  app.use("/admin",adminlogin)
//  app.use("/admin",addCategoery)
//  app.use("/admin",viewCategoery)
//  app.use("/admin",updateCategoery)
//  app.use('/admin',deleteCategory)
//  app.use("/admin",addProduct)
//  app.use("/admin",viewProductById)
//  app.use("/admin",deleteProduct)
//  app.use("/admin",updateProduct)
//  app.use("/admin" ,getProductsByCategory)
//  app.use("/admin",allUsers)
//  app.use("/admin",getAllproduct)

app.use("/user",viewProductById)
app.use("/user",getAllproduct)
app.use("/user",userOrder)


 
 

  app.listen(process.env.PORT)
  

