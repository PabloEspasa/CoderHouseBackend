import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CartManager{
  constructor(){
    this.path = path.join(__dirname, '../data/carts.json');
  }

  generateNewId = (carts) => {
    if(carts.length > 0){
      return carts[carts.length - 1].id + 1;
    }else{
      return 1;
    }
  }

  //addCart
  async addCart (){
    try {
      const cartJson = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(cartJson);

      const id = this.generateNewId(carts);
      carts.push({ id, products: [] });

      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8" );
      return carts;
    } catch (error) {
      throw new Error("Error, no se pudo agregar el carrito correctamente");
    }
  }

  //getProductsInCartById
  async getProductsInCartById(cid){
    try {
      const cartJson = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(cartJson);

      const cart = carts.find((cartData)=> cartData.id == cid );
      return cart.products;
    } catch (error) {
      throw new Error("Error, no se pudo traer los productos del carrito correctamente");
    }
  }

  //addProductInCart
  async addProductInCart(cid, pid, quantity) {
    try {
      const cartJson = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(cartJson);
      const cart = carts.find(c => c.id == cid);
      if (!cart) throw new Error("Carrito no encontrado");
  
      const existingProduct = cart.products.find(p => p.id === parseInt(pid));
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ id: parseInt(pid), quantity });
      }
  
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");
      return carts;
    } catch (error) {
      throw new Error("Error, no se pudo agregar el producto en el carrito correctamente");
    }
  }
}  

export default CartManager;