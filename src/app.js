import express from 'express';
import exphbs from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';

import connectMongoDB from "./config/db.js";
import Product from './models/product.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Intentando conectar a MongoDB Atlas...");
await connectMongoDB();
console.log("Conexión inicializada. Arrancando servidor...");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs.engine({
  helpers: {
    multiply: (a, b) => a * b
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

const io = new Server(httpServer);

io.on('connection', async socket => {
  console.log('Cliente conectado con socket.io');

  const productos = await Product.find();
  socket.emit('productosActualizados', productos);

  socket.on('nuevoProducto', async prodData => {
    await Product.create(prodData);
    const updated = await Product.find();
    io.emit('productosActualizados', updated);
  });

  socket.on('eliminarProducto', async id => {
    await Product.findByIdAndDelete(id);
    const updated = await Product.find();
    io.emit('productosActualizados', updated);
  });
});
