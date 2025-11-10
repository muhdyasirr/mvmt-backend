import express from 'express'
import { userLogin, userLogout, userSignup } from '../controller/userController.js'
import { addCart, deleteProductInCart, getUserCart } from '../controller/cartController.js'
import { isUserAuth } from '../middleware/middleware.js'
import { userOrder,allorder, deleteOrder } from '../controller/orderController.js'
import Product from '../models/productModel.js'
import { viewProductById,getProductsByCategory,viewCategoery ,getAllproduct} from '../controller/adminController.js'


const routes = express.Router()



routes.all("/products",viewProductById)
routes.post('/signup',userSignup)
routes.post("/login",userLogin)
routes.get("/allCategoery",viewCategoery)
routes.get("/Categoery/product/:id",getProductsByCategory)
routes.get("/allproducts",getAllproduct)
routes.get("/categoery/:id",getProductsByCategory)

// app.use(isUserAuth)
routes.post("/logout",userLogout)
routes.post("/cart",isUserAuth,addCart)
routes.delete("/cart",isUserAuth,deleteProductInCart)
routes.get("/cart",isUserAuth,getUserCart)
routes.get("/allorders",isUserAuth,allorder)
routes.post('/order',isUserAuth,userOrder)
routes.delete('/order/:id',isUserAuth,deleteOrder)



export default routes