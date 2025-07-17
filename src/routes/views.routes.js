import { Router } from 'express';
import Product from '../models/product.model.js';
import Cart from '../models/cart.model.js';

const router = Router();

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
      lean: true
    };

    const filter = query
      ? { $or: [{ category: query }, { status: query === 'available' }] }
      : {};

    const result = await Product.paginate(filter, options);
    res.render('products', {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      totalPages: result.totalPages,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null
    });    
  } catch (error) {
    res.status(500).send(`Error al cargar productos: ${error.message}`);
  }
});

router.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).send('Producto no encontrado');
    res.render('productDetail', { product });
  } catch (error) {
    res.status(500).send(`Error al obtener producto: ${error.message}`);
  }
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate('products.product')
      .lean();

    if (!cart) return res.status(404).send('Carrito no encontrado');

    console.log("Carrito cargado:", JSON.stringify(cart, null, 2));

    res.render('cart', { cart });
  } catch (error) {
    res.status(500).send(`Error al cargar el carrito: ${error.message}`);
  }
});


router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

export default router;