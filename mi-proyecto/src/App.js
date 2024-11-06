import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import FormVentas from './components/FormVentas';
import Success from './components/Success';
import Failure from './components/Failure';
import Pending from './components/Pending';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/success" element={<Success />} />
                    <Route path="/failure" element={<Failure />} />
                    <Route path="/pending" element={<Pending />} />
                    <Route path="/form-ventas" element={<FormVentas />} />
                    <Route path="/" element={
                        <div className="menu-container">
                            <h1>Menu despues de la compra</h1>
                            <button id="main-menu-btn" onClick={() => window.location.href = 'http://localhost:8080/index.html'}>
                                Ir al Menu principal
                            </button>
                            {/* Otros componentes o contenido */}
                        </div>
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;