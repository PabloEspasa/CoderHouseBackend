const socket = io();

const lista = document.getElementById('listaProductos');
const formulario = document.getElementById('formularioProducto');

formulario.addEventListener('submit', e => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const precio = document.getElementById('precio').value;

  socket.emit('nuevoProducto', { title: nombre, price: parseFloat(precio) });

  formulario.reset();
});

socket.on('productosActualizados', productos => {
  lista.innerHTML = '';
  productos.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `${p.title} - $${p.price.toFixed(2)} <button data-id="${p.id}">Eliminar</button>`;
    lista.appendChild(li);
  });
});

lista.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const id = e.target.dataset.id;
    socket.emit('eliminarProducto', id);
  }
});
