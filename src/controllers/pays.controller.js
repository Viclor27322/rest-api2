require('dotenv').config();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { getConnection } from "../database";

// Función para guardar el pago en el historial
async function guardarPagoEnHistorial(paymentIntent) {
  try {
    const pool = await getConnection();
    const query = `
      INSERT INTO historial_pagos (pacienteId, amount, status, paymentDate, paymentId)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      paymentIntent.metadata.pacienteId,
      paymentIntent.amount,
      'succeeded',
      new Date(),
      paymentIntent.id
    ];

    await pool.query(query, values);
    console.log("Pago guardado en historial con éxito");
  } catch (error) {
    console.error("Error al guardar el pago en el historial:", error);
    throw error;
  }
}

// Controlador de pago
export const Payment = async (req, res) => {
  const { amount, pacienteId } = req.body;

  try {
    // Crea el PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // en centavos
      currency: 'mxn',
      metadata: { pacienteId },
    });

    // Envía el client_secret al frontend para completar el pago
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
    if(res.status(200)){
      // Guarda el PaymentIntent en la base de datos
      await guardarPagoEnHistorial(paymentIntent);
    }
  } catch (error) {
    console.error("Error al crear el PaymentIntent:", error);
    res.status(500).send({ error: error.message });
  }
};

// Guarda el pago exitoso en la base de datos
/*async function guardarPagoEnHistorial(order) {
  const connection = await getConnection();
  await connection('historial_pagos').insert({
    pacienteId: order.customer_info.email, // Asocia el pago con el email del paciente
    amount: order.amount || order.line_items[0].unit_price / 100, // Divide entre 100 para obtener el monto en la moneda original
    status: order.payment_status || 'paid',
    paymentDate: new Date(),
    paymentId: order.id
  });
}*/
// src/controllers/paymentsController.js
const Conekta = require('conekta');

Conekta.api_key = process.env.CONEKTA_PRIVATE_KEY;
Conekta.api_version = '2.0.0';
Conekta.locale = 'es';

export const createOrder = async (req, res) => {
  const { amount, currency, name, email, token } = req.body;

  console.log("API Key:", Conekta.api_key); // Verificar si la clave está configurada

  try {
    const ordersApi = new Conekta.OrdersApi(); // Instancia de OrdersApi

    const order = await ordersApi.createOrder({
      currency: currency || 'MXN',
      customer_info: {
        name: name,
        email: email
      },
      line_items: [{
        name: "Pago por servicio",
        unit_price: amount * 100,
        quantity: 1
      }],
      charges: [{
        payment_method: {
          type: "card",
          token_id: token
        }
      }]
    });

    res.json({
      success: true,
      message: 'Pago exitoso',
      data: order
    });
  } catch (error) {
    console.error("Error creando la orden:", error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar el pago',
      error: error.message
    });
  }
};


export const obtenerHistorialPagos = async (req, res) => {
  try {
    const pool = await getConnection();
    const [historial] = await pool.query(`
      SELECT pacienteId, amount, status, paymentDate, paymentId
      FROM historial_pagos
      ORDER BY paymentDate DESC
    `);
    res.json(historial);
  } catch (error) {
    console.error("Error al obtener el historial de pagos:", error);
    res.status(500).json({ error: "Error al obtener el historial de pagos" });
  }
};