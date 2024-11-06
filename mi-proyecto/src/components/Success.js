// src/components/Success.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirigir a la página principal después de un pago exitoso
        setTimeout(() => {
            navigate('/');
        }, 2000); // Redirigir después de 2 segundos
    }, [navigate]);

    return (
        <div>
            <h2>Pago Exitoso</h2>
            <p>Redirigiendo...</p>
        </div>
    );
};

export default Success;