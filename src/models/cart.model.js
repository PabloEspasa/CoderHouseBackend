import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 }
    }
  ],
  created_at: { type: Date, default: Date.now }
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;