import express from 'express';
import Product from '../models/product.model.js';

const router = express.Router();

// GET all products (con filtros opcionales)
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = query ? { category: { $regex: query, $options: 'i' } } : {};

    const sortOption = sort === 'asc' ? { price: 1 } :
                       sort === 'desc' ? { price: -1 } :
                       {};

    const result = await Product.paginate(filter, {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOption,
      lean: true
    });

    const { docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = result;

    res.json({
      status: 'success',
      payload: docs,
      totalPages,
      prevPage,
      nextPage,
      page: parseInt(page),
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `/api/products?page=${prevPage}` : null,
      nextLink: hasNextPage ? `/api/products?page=${nextPage}` : null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET product by ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT update product
router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    res.json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE product
router.delete('/:pid', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.pid);
    res.json({ status: 'success', message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;