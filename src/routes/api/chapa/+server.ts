import { CHAPA_SECRET_KEY, CHAPA_RETURN_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { saveTransaction } from '$lib/server/store';
import productData from '$lib/data/data.json';

export async function POST({ request }) {
  const clientData = await request.json();
  const tx_ref = `tx-${Date.now()}`;

  // Calculate total amount server-side
  let calculatedTotal = 0;
  const items = clientData.items || [];

  for (const item of items) {
    const product = productData.find(p => p.name === item.name);
    if (product && item.quantity > 0) {
      calculatedTotal += product.price * item.quantity;
    }
  }

  // Ensure we have a valid amount
  if (calculatedTotal <= 0) {
    return json({ error: 'Invalid order amount' }, { status: 400 });
  }

  const amount = calculatedTotal.toFixed(2);

  // Save to in-memory store
  saveTransaction({
    tx_ref,
    amount: calculatedTotal,
    currency: 'ETB',
    email: clientData.email,
    firstName: clientData.firstName,
    lastName: clientData.lastName,
    phoneNumber: clientData.phoneNumber,
    status: 'pending',
    createdAt: new Date()
  });

  const raw = JSON.stringify({
    "amount": amount,
    "currency": "ETB",
    "email": clientData.email,
    "first_name": clientData.firstName,
    "last_name": clientData.lastName,
    "phone_number": clientData.phoneNumber,
    "tx_ref": tx_ref,
    "return_url": `${CHAPA_RETURN_URL}?tx_ref=${tx_ref}`,
    "customization[title]": "Payment for product",
  })

  const myHeaders = {
    "Authorization": `Bearer ${CHAPA_SECRET_KEY}`,
    "Content-Type": "application/json"
  };

  try {
    const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    });

    const result = await response.json();

    if (response.ok && result.status === 'success') {
      return json({ checkout_url: result.data.checkout_url });
    } else {
      console.error('Chapa API Failure:', result);
      return json({ error: result.message || 'Chapa initialization failed' }, { status: 400 });
    }

  } catch (error) {
    console.error('Fetch error:', error);
    return json({ error: 'Server error during Chapa request' }, { status: 500 });
  }
}
