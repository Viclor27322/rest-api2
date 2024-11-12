require('dotenv').config();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Usa la variable de entorno

// Importa la conexión a la base de datos
import { getConnection } from "../database";

// Guarda el pago exitoso en la base de datos
/*
async function guardarPagoEnHistorial(paymentIntent) {
  const connection = await getConnection();
  await connection('historial_pagos').insert({
    pacienteId: paymentIntent.metadata.pacienteId,
    amount: paymentIntent.amount,
    status: paymentIntent.status,
    paymentDate: new Date(),
    paymentId: paymentIntent.id
  });
}*/
// Guarda el pago exitoso en la base de datos
async function guardarPagoEnHistorial(order) {
  const connection = await getConnection();
  await connection('historial_pagos').insert({
    pacienteId: order.customer_info.email, // Asocia el pago con el email del paciente
    amount: order.amount || order.line_items[0].unit_price / 100, // Divide entre 100 para obtener el monto en la moneda original
    status: order.payment_status || 'paid',
    paymentDate: new Date(),
    paymentId: order.id
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


// src/controllers/paymentsController.js

import Conekta from 'conekta';

// Configura Conekta con tu API Key privada y la versión de API
Conekta.api_key = process.env.CONEKTA_PRIVATE_KEY; // Guarda esto en tu .env
Conekta.api_version = '2.0.0'; // Asegúrate de estar usando la última versión de la API

export const createOrder = async (req, res) => {
  const { amount, currency, name, email } = req.body;

  try {
    const order = await Conekta.Order.create({
      currency: currency || 'MXN',
      customer_info: {
        name: name,
        email: email
      },
      line_items: [{
        name: "Pago por servicio",
        unit_price: amount * 100, // Conekta espera el monto en centavos
        quantity: 1
      }],
      charges: [{
        payment_method: {
          type: "card",
          token_id: req.body.token // Este token lo obtendremos en el frontend
        }
      }]
    });
    await guardarPagoEnHistorial(order);
    res.json({
      success: true,
      message: 'Pago exitoso',
      data: order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar el pago',
      error: error.message
    });
  }
};
