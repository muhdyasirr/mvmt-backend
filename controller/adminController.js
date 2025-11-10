

import bcrypt from "bcrypt"
import { adminCollection, CategoeryCollection } from "../config/db.js";
import Product from "../models/productModel.js"; 
import categoery from "../models/categoeryModel.js";
import User from "../models/userModel.js";
import { log } from "console";
import session from "express-session";
import Category from "../models/categoeryModel.js";






//login
export const adminlogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login Request:", req.body);

  try {
    const admin = await adminCollection.findOne({ email });
    console.log("ADMIN FOUND:", admin);

    if (!admin) {
      return res.status(400).json({ message: "Admin Not Found" });
    }

    if (password !== admin.password) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    
    req.session.admin = admin._id;
     req.session.role = "admin";

    return res.status(200).json({
      message: "Admin Logged In Successfully",
      admin: {
        _id: admin._id,
        email: admin.email,
        username: admin.username || "Admin",
        role:"admin"
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



//admin add Categoery 
export const addCategoery=async (req,res)=>{
  try{
    console.log("hello");
    
    let photo=""
    if(req.file){
      photo=req.file.filename
    }
     const {name,description}=req.body


   console.log(req.body);
   console.log(photo)

   const existingCategoery = await categoery.findOne({ name });

    if (existingCategoery) {
      return res.status(400).json({ message: "Category already exists" });
    }

     

   const categoeries=new categoery({
    name:name,
    description:description,
    CategoryImage:photo
   })
   await categoeries.save()
   return res.status(200).json({message:"Categoery added Suceesfully "})
  }catch (error) {
    console.log(error.message);
  }

}

//admin view all Categoery
export const viewCategoery = async (req, res) => {
  try {
    const categories = await categoery.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//update  Categoery

// Update Category with image support
export const updateCategoery = async (req, res) => {
  try {
    const { name, description, _id } = req.body;

    // Prepare update object
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    // If a new image is uploaded, update it
    if (req.file) {
      updateData.CategoryImage = req.file.filename;
    }

    // Update the category in DB
    const updatedCategory = await categoery.findByIdAndUpdate(_id, updateData, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
  } catch (err) {
    console.error("Error updating category:", err.message);
    res.status(500).json({ message: err.message });
  }
};



//delete categoery

export const deleteCategory = async (req, res) => {
  try {
   
    
    const deleted = await categoery.findByIdAndDelete(req.params.id)
    console.log(deleted);
    
    if (!deleted) return res.status(404).json({ message: "Category not found" });

 
   
   
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




//product



export const addProduct = async (req, res) => {
  try {
    console.log("hello");
    
    let photo=""
    if(req.file){
      photo=req.file.filename
    }

    const { name, description, price, categoryId } = req.body; 

    // if (!name || !description || !price || !categoryId) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }

    const categoryDetails = await categoery.findById(categoryId);
    console.log(categoryId);
    
    console.log(categoryDetails);
    
    if (!categoryDetails) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

  
    

    const newProduct = new Product({
      name,
      description,
      price,
      category: categoryDetails._id,
      ProductImage:photo
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error(" Error in addProduct:", err);
    res.status(500).json({ message: err.message });
  }
};



// View Product by ID
export const viewProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Product
// Update Product with image support
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, _id } = req.body;

    // Prepare update object
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;

    // Update category reference if needed
    if (categoryId) {
      const categoryDetails = await categoery.findById(categoryId);
      if (!categoryDetails) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      updateData.category = categoryDetails._id;
    }

    // If new image is uploaded, update it
    if (req.file) {
      updateData.ProductImage = req.file.filename;
    }

    // Update product in DB
    const updatedProduct = await Product.findByIdAndUpdate(_id, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    console.error("Error updating product:", err.message);
    res.status(500).json({ message: err.message });
  }
};


// Delete Product
export const deleteProduct = async (req, res) => {
 
  
  
  
  try {
     const deleted = await Product.findByIdAndDelete(req.params.id);
   if (!deleted) return res.status(404).json({ message: "Product not found" });
res.status(200).json({ message: "Product deleted successfully" });
 } catch (err) {
   res.status(500).json({ message: err.message });
 }
};

// Get Products by Category
export const getProductsByCategory = async (req, res) => {

  try {
    const categoryId = req.params.id;

    const categoryDetails = await categoery.findById(categoryId);
    if (!categoryDetails) return res.status(404).json({ message: "Category not found" });

    const products = await Product.find({ category: categoryId });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//ALL USERS

export const allUsers=async(req,res)=>{
  try{
    const Users= await User.find()
    res.status(200).json(Users)

    
  }catch(error){
    res.status(500).json({ message: err.message });
    
  }
}


export const getAllproduct=async(req,res)=>{
  console.log("hello");
  
 const products = await Product.find().populate("category", "name")
console.log(products);

   res.status(200).json(products)
}


export const UpdateUser= async(req,res)=>{
  const id=req.params.id
  console.log(req.body)
  const Status=await User.findByIdAndUpdate(id,req.body, {new: true})
  res.status(200).json(Status)
  
}
