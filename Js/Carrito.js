// Verificar si hay un usuario registrado en el almacenamiento local
const usuario = JSON.parse(localStorage.getItem('usuario'));

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
    alert(`${cantidad} ${nombre}(s) añadido(s) al carrito.`);
}

// Función para ir al carrito (formulario de ventas) solo si hay sesión iniciada
function irAlCarrito() {
    if (!usuario) {
        alert("Debe iniciar sesión para realizar una compra.");
        window.location.href = "registro.html";
        return;
    }
    window.location.href = "FormVentas.html";
}

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

