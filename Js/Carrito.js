localStorage.removeItem("productos");


// Verificar si hay un usuario registrado en el almacenamiento local
const usuario = JSON.parse(localStorage.getItem('usuario'));

// Función para inicializar productos en el localStorage (si no están ya almacenados)
const inicializarProductos = () => {
    let productos = JSON.parse(localStorage.getItem("productos"));
    if (!productos || productos.length === 0) {
        // Definir los productos iniciales
        const productosIniciales = [
            { id: 1, nombre: "Hamburguesa", categoria: "Hamburguesas", precio: 3900, img: "Imagenes/(hamburguesas).jfif" },
            { id: 2, nombre: "Papas Fritas con Cheddar", categoria: "Papas", precio: 2000, img: "Imagenes/cheddar-cheese-melted-french-fries_908985-22496.avif" },
            { id: 3, nombre: "Pizza", categoria: "Pizza", precio: 9800, img: "Imagenes/(pizza).jfif" },
            { id: 4, nombre: "Helado", categoria: "Postres", precio: 1600, img: "Imagenes/banana-split-620.webp" },
            { id: 5, nombre: "Combo Pedilo", categoria: "Combos", precio: 6000, img: "Imagenes/hamburger-potato-combo-staple-fast-600nw-2325787009.webp" },
            { id: 6, nombre: "Combo Pedilo para chicos", categoria: "Combos", precio: 3500, img: "Imagenes/infantil02happystar-0351201390079782.jpg" },
            { id: 7, nombre: "Panchos Pedilos", categoria: "Panchos", precio: 2500, img: "Imagenes/panchos.jpg"},
            { id: 8, nombre: "Empanadas de JyQ", categoria: "Empanadas", precio: 3000, img: "Imagenes/empanadasJyQ.jpg"}

        ];
        // Guardar productos en el localStorage
        localStorage.setItem("productos", JSON.stringify(productosIniciales));
    }
};

// Llamar a la función de inicialización de productos al cargar el carrito
inicializarProductos();


// Función para actualizar el contador de productos en el carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.getElementById('cart-count').textContent = totalProductos;
}



// Función para agregar un artículo al carrito solo si hay sesión iniciada
function agregarAlCarrito(nombre, precio, cantidadId) {
    if (!usuario) {
        alert("Debe iniciar sesión para agregar productos al carrito.");
        window.location.href = "registro.html";
        return;
    }
    
    const cantidad = parseInt(document.getElementById(cantidadId).value);
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const itemIndex = carrito.findIndex(item => item.nombre === nombre);
    if (itemIndex !== -1) {
        carrito[itemIndex].cantidad += cantidad;
    } else {
        carrito.push({ nombre, precio, cantidad });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert(`${cantidad} ${nombre}(s) añadido(s) al carrito.`);
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();
});

// Función para ir al carrito (formulario de ventas) solo si hay sesión iniciada
function irAlCarrito() {
    if (!usuario) {
        alert("Debe iniciar sesión para realizar una compra.");
        window.location.href = "registro.html";
        return;
    }
    window.location.href = "FormVentas.html";
}

// Event listener for DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
    inicializarProductos();
    actualizarContadorCarrito();
    // Función para filtrar productos por categoría
    function filtrarProductos(categoria) {
        // Obtener productos de localStorage
        const productos = JSON.parse(localStorage.getItem("productos")) || [];

        // Filtrar productos por la categoría seleccionada
        const productosFiltrados = categoria ?
            productos.filter(producto => producto.categoria === categoria) :
            productos;

        // Contenedor donde se mostrarán los productos
        const contenedorProductos = document.getElementById("productos-lista");
        if (contenedorProductos) {
            contenedorProductos.innerHTML = ""; // Limpiar el contenedor

            // Crear HTML para cada producto y agregarlo al contenedor
            productosFiltrados.forEach(producto => {
                const productoHTML = `
                    <div class="item">
                        <h2>${producto.nombre}</h2>
                        <img src="${producto.img}" alt="${producto.nombre}" class="imagen">
                        <p>Precio: $${producto.precio}</p>
                        <label for="cantidad-${producto.id}">Cantidad:</label>
                        <input type="number" id="cantidad-${producto.id}" min="1" value="1">
                        <button onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio}, 'cantidad-${producto.id}')">Añadir al Carrito</button>
                    </div>
                `;
                contenedorProductos.innerHTML += productoHTML;
            });
        } else {
            console.error("Element with ID 'productos-lista' not found");
        }
    }

    // Llamar a la función filtrarProductos con una categoría vacía para mostrar todos los productos al cargar la página
    filtrarProductos("");
});

// Función para registrar venta en el "carrito" (localStorage)
function registrarVenta() {
    const descripcion = document.getElementById('descripcion').value;
    const monto = document.getElementById('monto').value;
    const fecha = document.getElementById('fecha').value;
    const nombreDestinatario = document.getElementById('nombreDestinatario').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;

    if (descripcion && monto && fecha && nombreDestinatario && telefono && direccion) {
        // Crear un objeto de venta
        const venta = {
            descripcion,
            monto,
            fecha,
            nombreDestinatario,
            telefono,
            direccion
        };

        // Guardar en el localStorage
        let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
        ventas.push(venta);
        localStorage.setItem('ventas', JSON.stringify(ventas));

        alert('Venta registrada exitosamente en el carrito');
        // Resetear el formulario
        document.querySelector('form').reset();
    } else {
        alert('Por favor, complete todos los campos');
    }

    function cerrarSesion() {
        // Aquí puedes limpiar el localStorage o cualquier lógica necesaria
        localStorage.removeItem('usuario'); // Por ejemplo, si guardas usuario en localStorage
        window.location.href = 'index.html'; // Redirige a la página principal
    }




}

