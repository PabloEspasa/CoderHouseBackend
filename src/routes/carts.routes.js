import express from 'express';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

const router = express.Router();

// POST crear nuevo carrito
router.post('/', async (req, res) => {
  try {
    const cart = await Cart.create({});
    res.status(201).json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

    if (quantity > product.stock) {
      return res.status(400).json({
        status: 'error',
        message: `No hay suficiente stock disponible. Stock actual: ${product.stock}`
      });
    }

    const existing = cart.products.find(p => p.product.toString() === pid);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();

    // Descontar stock
    product.stock -= quantity;
    await product.save();

    res.json({ status: 'success', message: 'Producto agregado al carrito' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE eliminar producto específico
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.json({ status: 'success', message: 'Producto eliminado del carrito', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT reemplazar todos los productos
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = products;
    await cart.save();

    res.json({ status: 'success', message: 'Carrito actualizado', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT actualizar cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const product = cart.products.find(p => p.product.toString() === pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });

    product.quantity = quantity;
    await cart.save();

    res.json({ status: 'success', message: 'Cantidad actualizada', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();

    res.json({ status: 'success', message: 'Todos los productos eliminados del carrito', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET productos de un carrito
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product');
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    res.json({ status: 'success', payload: cart.products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;