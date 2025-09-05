export default async function handler(req, res) {
  try {
    const { cartId, userId, pincode, coupon, clientAuthToken } = req.body;

    const serverAuth = process.env.JIO_AUTH_TOKEN;
    const authToken = serverAuth || clientAuthToken;

    if (!coupon) return res.status(400).json({ status: 'error', message: 'coupon missing' });
    if (!authToken) return res.status(401).json({ status: 'error', message: 'auth token missing (set JIO_AUTH_TOKEN in env)' });

    const random = Math.random();
    if (random < 0.1) {
      return res.status(200).json({ status: 'valid', message: 'Coupon applied: ₹50 off' });
    }
    return res.status(200).json({ status: 'invalid', message: 'Invalid coupon or expired' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}