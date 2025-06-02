import express from 'express';
import CartManager from '../manager/CartManager.js';

const router = express.Router();
const cartManager = new CartManager('./src/data/carts.json');

// POST crear nuevo carrito
router.post('/', async (req, res) => {
  try {
    const carts = await cartManager.addCart();
    res.status(201).json({ status: 'success', carts });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const carts = await cartManager.addProductInCart(cid, pid, quantity);
    res.status(200).json({ status: 'success', carts });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET productos de un carrito
router.get('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const products = await cartManager.getProductsInCartById(cid);
    res.status(200).json({ status: 'success', products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;