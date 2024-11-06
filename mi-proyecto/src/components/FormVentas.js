// src/components/FormVentas.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FormVentas = () => {
    const [carrito, setCarrito] = useState([]);
    const [montoTotal, setMontoTotal] = useState(0);
    const [fecha, setFecha] = useState('');
    const [nombreDestinatario, setNombreDestinatario] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [metodoPago, setMetodoPago] = useState('mercadoPago');
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar carrito desde localStorage al montar el componente
        const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
        setCarrito(carritoGuardado);
        actualizarMontoTotal(carritoGuardado);
    }, []);

    const actualizarMontoTotal = (carrito) => {
        let total = 0;
        carrito.forEach(item => {
            total += item.precio * item.cantidad;
        });
        setMontoTotal(total);
    };

    const eliminarProducto = (index) => {
        const nuevoCarrito = [...carrito];
        nuevoCarrito.splice(index, 1);
        setCarrito(nuevoCarrito);
        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
        actualizarMontoTotal(nuevoCarrito);
    };

    const registrarVenta = async () => {
        if (!fecha || !nombreDestinatario || !telefono || !direccion) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        let monto = montoTotal;
        if (metodoPago === "cripto") {
            monto = await convertirCriptoAMonedaFiduciaria(monto, 'usd');
        }

        const nuevoAsiento = {
            id: Date.now(),
            tipo: metodoPago === "cripto" ? "Venta en Criptomonedas" : "Venta en Mercado Pago",
            descripcion: carrito.map(item => `${item.cantidad}x ${item.nombre} ($${item.precio} c/u)`).join(", "),
            monto,
            fecha,
            nombreDestinatario,
            telefono,
            direccion
        };

        const asientos = JSON.parse(localStorage.getItem("asientos")) || [];
        asientos.push(nuevoAsiento);
        localStorage.setItem("asientos", JSON.stringify(asientos));

        const nuevoGasto = {
            id: Date.now(),
            descripcion: nuevoAsiento.descripcion,
            monto,
            fecha,
            nombreDestinatario,
            telefono,
            direccion,
            tipo: metodoPago === "cripto" ? "Venta en Criptomonedas" : "Venta en Mercado Pago"
        };

        const gastos = JSON.parse(localStorage.getItem("gastos")) || [];
        gastos.push(nuevoGasto);
        localStorage.setItem("gastos", JSON.stringify(gastos));

        localStorage.removeItem("carrito");
        alert("Compra registrada exitosamente.");
        window.location.reload();
    };

    const convertirCriptoAMonedaFiduciaria = async (monto, moneda) => {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${moneda}`);
            const data = await response.json();
            const tasaCambio = data.bitcoin[moneda];
            return monto / tasaCambio;
        } catch (error) {
            alert("Error al convertir criptomonedas.");
            return monto;
        }
    };

    const mostrarBotonPago = () => {
        if (metodoPago === 'mercadoPago') {
            return (
                <button id="checkout-btn" type="button" onClick={handleCheckout}>
                    Pagar con Mercado Pago
                </button>
            );
        }
        return null;
    };

    const handleCheckout = async () => {
        try {
            if (carrito.length === 0) {
                alert('El carrito está vacío');
                return;
            }

            const orderData = carrito.map(item => ({
                title: item.nombre,
                quantity: parseInt(item.cantidad),
                unit_price: parseFloat(item.precio),
                currency_id: 'ARS'
            }));

            const response = await fetch('http://localhost:3001/create_preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items: orderData })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const preference = await response.json();

            if (preference.init_point) {
                window.location.href = preference.init_point;
            } else {
                throw new Error('No init_point received from server');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar el pago: ' + error.message);
        }
    };

    return (
        <div>
            <button className="menu-btn" onClick={() => navigate('/')}>Menú</button>
            <h1>Carrito de Compras</h1>
            <div id="carrito">
                {carrito.length === 0 ? (
                    <p>El carrito está vacío.</p>
                ) : (
                    carrito.map((item, index) => (
                        <div key={index} className="item">
                            <p>{item.cantidad}x {item.nombre} (${item.precio} c/u) - Subtotal: ${item.precio * item.cantidad}</p>
                            <button onClick={() => eliminarProducto(index)}>Eliminar</button>
                        </div>
                    ))
                )}
            </div>
            <form>
                <label htmlFor="monto">Monto Total:</label>
                <input type="number" id="monto" name="monto" value={montoTotal} readOnly required />

                <label htmlFor="fecha">Fecha:</label>
                <input type="date" id="fecha" name="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} required />

                <label htmlFor="nombreDestinatario">Nombre del destinatario:</label>
                <input type="text" id="nombreDestinatario" name="nombreDestinatario" value={nombreDestinatario} onChange={(e) => setNombreDestinatario(e.target.value)} required />

                <label htmlFor="telefono">Número de Teléfono:</label>
                <input type="tel" id="telefono" name="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required pattern="[0-9]{10}" placeholder="10 dígitos" />

                <label htmlFor="direccion">Dirección:</label>
                <textarea id="direccion" name="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} required></textarea>

                <label htmlFor="metodoPago">Método de Pago:</label>
                <select id="metodoPago" name="metodoPago" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                    <option value="mercadoPago">Mercado Pago</option>
                    <option value="cripto">Criptomonedas</option>
                </select>

                <div id="botonPagoContainer">
                    {mostrarBotonPago()}
                </div>

                <button type="button" onClick={registrarVenta}>Registrar Venta</button>
            </form>
        </div>
    );
};

export default FormVentas;
