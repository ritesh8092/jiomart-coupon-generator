import { useState } from 'react';
import axios from 'axios';

function randomAlphaNumeric(len) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export default function Home() {
  const [cartId, setCartId] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [userId, setUserId] = useState('');
  const [pincode, setPincode] = useState('');
  const [count, setCount] = useState(5);
  const [prefix, setPrefix] = useState('3M');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState([]);
  const [log, setLog] = useState('');

  async function checkCoupon(code) {
    const res = await axios.post('/api/check-coupon', {
      cartId, userId, pincode, coupon: code, clientAuthToken: authToken
    });
    return res.data;
  }

  async function generateAndCheck(e) {
    e && e.preventDefault();
    setRunning(true);
    setResults([]);
    setLog('Starting generation...');

    for (let i = 0; i < Number(count); i++) {
      const targetLen = 10;
      const fillLen = Math.max(0, targetLen - (prefix || '').length);
      const coupon = (prefix || '') + randomAlphaNumeric(fillLen);

      setLog(prev => prev + `\n[${i + 1}] Generated ${coupon} — checking...`);

      try {
        const resp = await checkCoupon(coupon);
        setResults(prev => [...prev, { coupon, ...resp }]);
        setLog(prev => prev + `\n[${i + 1}] Result: ${resp.status || 'unknown'}`);
      } catch (err) {
        setResults(prev => [...prev, { coupon, error: err.message }]);
        setLog(prev => prev + `\n[${i + 1}] Error: ${err.message}`);
      }

      await new Promise(r => setTimeout(r, 2000));
    }

    setLog(prev => prev + '\nDone.');
    setRunning(false);
  }

  return (
    <main style={{ fontFamily: 'Inter, system-ui, Arial', maxWidth: 780, margin: '36px auto', padding: 20 }}>
      <h1 style={{ fontSize: 28 }}>JioMart Coupon Generator & Checker</h1>

      <form onSubmit={generateAndCheck} style={{ display: 'grid', gap: 12, marginTop: 18 }}>
        <label>Cart ID<input value={cartId} onChange={e => setCartId(e.target.value)} /></label>
        <label>Auth Token<input value={authToken} onChange={e => setAuthToken(e.target.value)} /></label>
        <label>User ID<input value={userId} onChange={e => setUserId(e.target.value)} /></label>
        <label>PINCODE<input value={pincode} onChange={e => setPincode(e.target.value)} /></label>
        <label>How many coupons?<input type="number" value={count} onChange={e => setCount(e.target.value)} /></label>
        <label>Prefix<input value={prefix} onChange={e => setPrefix(e.target.value)} /></label>
        <button type="submit" disabled={running}>{running ? 'Running...' : 'Generate & Check'}</button>
      </form>

      <section style={{ marginTop: 18 }}>
        <h2>Results</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th>Coupon</th><th>Status</th><th>Message</th></tr></thead>
          <tbody>
            {results.map((r, idx) => (
              <tr key={idx}>
                <td>{r.coupon}</td>
                <td>{r.status || (r.error ? 'error' : 'unknown')}</td>
                <td>{r.message || r.error || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Log</h3>
        <pre>{log}</pre>
      </section>
    </main>
  );
}