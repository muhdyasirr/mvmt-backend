import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";


export const userOrder = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const userCart = await Cart.findOne({ userId });
    if (!userCart || userCart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const newOrder = new Order({
      userId,
      items: userCart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalAmount: userCart.items.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      ),
    });

    await newOrder.save();
    userCart.items = [];
    await userCart.save();

    res.status(200).json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//all orders

export const allorder = async (req, res) => {
  try {
    const userId = req.session.userId;

    
    const AllOrders = await Order.find({ userId })
      .populate({
        path: "items.productId",
        select: "name price ProductImage",
      })
      .sort({ orderDate: -1 });

    return res.status(200).json(AllOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error retrieving orders" });
  }
};


export const deleteOrder = async (req,res)=>{
try{
   const orderid= await Order.findByIdAndDelete(req.params.id)
     
    if (!orderid) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Order Cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

 
   


