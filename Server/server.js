import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';



// SDK de Mercado Pago
// Agrega credenciales
const client = new MercadoPagoConfig({ 
    accessToken: 'TEST-4615173434199507-110517-432e80ec3d025908b9c0bc45408e02b0-1176208087' 
});


const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('soy el server');
} );

app.post('/create_preference', async (req, res) => {
    try {
        console.log('Request body:', req.body);

		
        if (!req.body.items || !Array.isArray(req.body.items)) {
            throw new Error('Invalid items in request body');
        }

        const body = {
            items: req.body.items.map(item => ({
                title: item.title,
                quantity: Number(item.quantity),
                unit_price: Number(item.unit_price),
                currency_id: "ARS"
            })),
            back_urls: {
            success: 'http://localhost:3000/success',
            failure: 'http://localhost:3000/failure',
            pending: 'http://localhost:3000/pending',
        },
        auto_return: 'approved',
        }; 

		const preference = new Preference(client);
        const result = await preference.create({body});

		if (!result || !result.id || !result.init_point) {
            throw new Error('Invalid response from MercadoPago');
        }
        res.json({
            id: result.id,
            init_point: result.init_point
        });
    }catch(error){
        console.error('Error creating preference:', error);
        res.status(500).json({ error: error.message });

    }
});

app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`);
    } );