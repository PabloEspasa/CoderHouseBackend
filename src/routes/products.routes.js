import express from 'express';
import ProductManager from '../manager/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager('./src/data/products.json');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json({ status: 'success', products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET product by ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST new product
router.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    const products = await productManager.addProduct(newProduct);
    res.status(201).json({ status: 'success', products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT update product
router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProductById(req.params.pid, req.body);
    res.status(200).json({ status: 'success', products: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE product
router.delete('/:pid', async (req, res) => {
  try {
    const updatedList = await productManager.deleteProductById(req.params.pid);
    res.status(200).json({ status: 'success', products: updatedList });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
