import { useState } from 'react';

function randomAlphaNumeric(len) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export default function Home() {
  const [cartId, setCartId] = useState('');
  const [authToken, setAuthToken] = useState(''); // leave blank: use server-side env instead
  const [userId, setUserId] = useState('');
  const [pincode, setPincode] = useState('');
  const [count, setCount] = useState(5);
  const [prefix, setPrefix] = useState('3M');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState([]);
  const [log, setLog] = useState('');

  async function checkCoupon(code) {
    const res = await fetch('/api/check-coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId, userId, pincode, coupon: code, clientAuthToken: authToken })
    });
    return res.json();
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

      await new Promise(r => setTimeout(r, 5000));
    }

    setLog(prev => prev + '\nDone.');
    setRunning(false);
  }

  return (
    <main style={{ fontFamily: 'Inter, system-ui, Arial', maxWidth: 780, margin: '36px auto', padding: 20 }}>
      <h1 style={{ fontSize: 28 }}>JioMart Coupon Generator & Checker</h1>

      <form onSubmit={generateAndCheck} style={{ display: 'grid', gap: 12, marginTop: 18 }}>
        <label>
          Cart ID
          <input value={cartId} onChange={e => setCartId(e.target.value)} style={{ width: '100%', padding: 10, marginTop: 6 }} />
        </label>

        <label>
          Auth Token (leave blank to use server-side env)
          <input value={authToken} onChange={e => setAuthToken(e.target.value)} style={{ width: '100%', padding: 10, marginTop: 6 }} />
        </label>

        <label>
          User ID
          <input value={userId} onChange={e => setUserId(e.target.value)} style={{ width: '100%', padding: 10, marginTop: 6 }} />
        </label>

        <label>
          PINCODE
          <input value={pincode} onChange={e => setPincode(e.target.value)} style={{ width: '100%', padding: 10, marginTop: 6 }} />
        </label>

        <label>
          How many coupons to test?
          <input type="number" value={count} onChange={e => setCount(e.target.value)} style={{ width: '100%', padding: 10, marginTop: 6 }} />
        </label>

        <label>
          Prefix (optional)
          <input value={prefix} onChange={e => setPrefix(e.target.value)} style={{ width: '100%', padding: 10, marginTop: 6 }} />
        </label>

        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <button type="submit" disabled={running} style={{ padding: '10px 16px' }}>
            {running ? 'Running...' : 'Generate & Check'}
          </button>
          <button type="button" onClick={() => { setResults([]); setLog(''); }} style={{ padding: '10px 12px' }}>
            Clear
          </button>
        </div>
      </form>

      <section style={{ marginTop: 18 }}>
        <h2>Results</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Coupon</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Status</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Message</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => (
              <tr key={idx}>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{r.coupon}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{r.status || (r.error ? 'error' : 'unknown')}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{r.message || r.error || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={{ marginTop: 12 }}>Log</h3>
        <pre style={{ background: '#0f172a', color: '#e6eef8', padding: 12, borderRadius: 6, maxHeight: 240, overflow: 'auto' }}>{log}</pre>
      </section>
    </main>
  );
}