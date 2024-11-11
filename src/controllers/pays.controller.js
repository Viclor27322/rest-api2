require('dotenv').config();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Usa la variable de entorno

// Importa la conexión a la base de datos
import { getConnection } from "../database";

// Guarda el pago exitoso en la base de datos
async function guardarPagoEnHistorial(paymentIntent) {
  const connection = await getConnection();
  await connection('historial_pagos').insert({
    pacienteId: paymentIntent.metadata.pacienteId,
    amount: paymentIntent.amount,
    status: paymentIntent.status,
    paymentDate: new Date(),
    paymentId: paymentIntent.id
  });
}

export const Payment = async (req, res) => {
  const { amount, pacienteId } = req.body; // Información que recibes del frontend

  try {
    // Crea el PaymentIntent con el monto y la moneda
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Monto en centavos (por ejemplo, 10000 para 100 MXN)
      currency: 'mxn', // Define la moneda
      metadata: { pacienteId }, // Guarda información extra si es necesario
    });

    // Guarda el PaymentIntent en la base de datos
    await guardarPagoEnHistorial(paymentIntent);

    // Envía el client_secret al frontend para completar el pago
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
