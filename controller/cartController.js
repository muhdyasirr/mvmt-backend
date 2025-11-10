import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const addCart = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { productId, quantity } = req.body;

    
    if (!userId) {
      return res.status(401).json({ message: "User not logged in" });
    }

    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

   
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price, 
      });
    }

    await cart.save();

    console.log(" Cart updated:", cart);
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error(" Error adding to cart:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deleteProductInCart = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    console.error(" Error deleting cart item:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getUserCart = async (req, res) => {
  try {
    const userId = req.session.userId;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name price ProductImage",
      populate: { path: "ProductImage", select: "url" },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json({ message: "user cart", cart });
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    res.status(500).json({ message: "Error fetching cart" });
  }
};
