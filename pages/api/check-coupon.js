export default async function handler(req, res) {
  try {
    const { cartId, userId, pincode, coupon, clientAuthToken } = req.body;

    const serverAuth = process.env.JIO_AUTH_TOKEN;
    const authToken = serverAuth || clientAuthToken;

    if (!coupon) return res.status(400).json({ status: 'error', message: 'coupon missing' });
    if (!authToken) return res.status(401).json({ status: 'error', message: 'auth token missing (set JIO_AUTH_TOKEN in env)' });

    // === Replace below with real JioMart API call ===
    // Example placeholder:
    // const apiRes = await fetch(process.env.JIO_API_ENDPOINT, { method: 'POST', headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ cartId, userId, pincode, coupon }) });
    // const data = await apiRes.json();
    //
    // For demo, we return a mocked response:
    const random = Math.random();
    if (random < 0.05) {
      return res.status(200).json({ status: 'valid', message: 'Coupon applied: ₹50 off' });
    }
    if (random < 0.12) {
      return res.status(200).json({ status: 'restricted', message: 'Not valid for selected items' });
    }
    return res.status(200).json({ status: 'invalid', message: 'Invalid coupon or expired' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
}