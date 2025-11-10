import User from "../models/userModel.js"

import bcrypt from "bcrypt"
import session from "express-session"

//signup
export const userSignup = async (req,res)=>{
  try{
      const {name,email,password}=req.body


      const existingUser = await User.findOne({email});
      // console.log(existingUser);
      
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
      const  h_password = await bcrypt.hash(password,10) 
    const user = new User({
        name,
        email:email,
        password:h_password,
        

    })
await user.save()   
res.status(200).json({message:"User Registers Sucessfully"})
}
catch (error) {
    res.status(500).json({ error: error.message });
  }
  }

//login
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    if(user.status !== "active"){
      return res.status(400).json({message:'Your account Has Been Blocked by Admin'})

    }

    // Create session
    req.session.userEmail = user.email;
    req.session.userId = user._id;
     req.session.role = "user";

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role:"user",
        
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};


export const userLogout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Logout failed" });
      }

      // Clear the session cookie
      res.clearCookie("connect.sid");

      return res.status(200).json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};

export const UserAddress=async (req,res)=>{
  try{
      const {name,email,address}=req.body


    
      
      
    
   
    const user = new UserAddress({
       name,
       email,
       address:{
        
       }
      
        

    })
await UserAddress.save()   
res.status(200).json({message:"User Address Added Sucessfully"})
}
catch (error) {
    res.status(500).json({ error: error.message });
  }
  }