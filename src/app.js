import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import ProductManager from './manager/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

const io = new Server(httpServer);

const productManager = new ProductManager(path.join(__dirname, 'data/products.json'));

io.on('connection', async socket => {
  console.log('Cliente conectado con socket.io');

  const productos = await productManager.getProducts();
  socket.emit('productosActualizados', productos);

  socket.on('nuevoProducto', async prodData => {
    await productManager.addProduct(prodData);
    const updated = await productManager.getProducts();
    io.emit('productosActualizados', updated);
  });

  socket.on('eliminarProducto', async id => {
    await productManager.deleteProductById(id);
    const updated = await productManager.getProducts();
    io.emit('productosActualizados', updated);
  });
});
