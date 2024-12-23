const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51NoFmIQuhoVnSw937UIBzOYjIXiXwPs2z3NH7v3q7WfLI6hLyaPSJ5DrKRblc6refx3lswJ39vEV0bHTkdKo1a3z00GWUBmp99');

const app = express();
app.use(bodyParser.json());

app.post('/process-payment', async (req, res) => {
  try {
    const { token, name, email, address } = req.body;
    
    // Crear un cliente en Stripe y guardar la tarjeta
    const customer = await stripe.customers.create({
      email: email,
      source: token,
      name: name,
      address: {
        line1: address,
        city: 'TuCiudad', // Puedes añadir más detalles según sea necesario
        postal_code: '12345', // Ejemplo de código postal
        country: 'MX', // Código de país ISO 3166-1 alfa-2
      },
    });

    // Crear un cargo para el cliente
    const charge = await stripe.charges.create({
      amount: 15000, // el monto en centavos
      currency: 'mxn',
      customer: customer.id,
      description: `Pago de ${name}`,
    });

    res.json({ success: true, chargeId: charge.id, customerId: customer.id, message: 'Pago exitoso' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Error en el pago' });
  }
});

app.listen(3000, () => console.log('Servidor escuchando en el puerto 3000'));
