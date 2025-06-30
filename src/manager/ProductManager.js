import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, '../data/products.json');
  }

  async getProducts() {
    try {
      const fileData = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(fileData);
    } catch (error) {
      throw new Error("Error al traer los productos: " + error.message);
    }
  }

  async getProductById(pid) {
    try {
      const products = await this.getProducts();
      const product = products.find((p) => p.id === parseInt(pid));
      if (!product) throw new Error("Producto no encontrado");
      return product;
    } catch (error) {
      throw new Error("Error al buscar el producto: " + error.message);
    }
  }

  async generateNewId(products) {
    return products.length > 0 ? products[products.length - 1].id + 1 : 1;
  }

  async addProduct(productData) {
    try {
      const products = await this.getProducts();
      const newId = await this.generateNewId(products);
      const newProduct = { id: newId, ...productData };
      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
      return newProduct;
    } catch (error) {
      throw new Error("Error al agregar el producto: " + error.message);
    }
  }

  async updateProductById(pid, updatedData) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((p) => p.id === parseInt(pid));
      if (index === -1) throw new Error("Producto no encontrado");

      products[index] = { ...products[index], ...updatedData };
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
      return products[index];
    } catch (error) {
      throw new Error("Error al actualizar el producto: " + error.message);
    }
  }

  async deleteProductById(pid) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((p) => p.id === parseInt(pid));
      if (index === -1) throw new Error("Producto no encontrado");

      const deletedProduct = products.splice(index, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
      return deletedProduct[0];
    } catch (error) {
      throw new Error("Error al eliminar el producto: " + error.message);
    }
  }
}

export default ProductManager;