# jiomart-coupon-generator

This is a small Next.js demo for a *JioMart Coupon Generator & Checker*.

**Important:** The serverless API is a stub that returns mocked responses. Before using with real APIs, replace the mock with real requests and set `JIO_AUTH_TOKEN` and `JIO_API_ENDPOINT` in Vercel environment variables.

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deployment

1. Create a GitHub repo and push this project.
2. Import the repo in Vercel.
3. Add environment variables (Project → Settings → Environment Variables):
   - `JIO_AUTH_TOKEN` (your server-side auth token)
   - `JIO_API_ENDPOINT` (optional; real API URL)
4. Deploy via Vercel and open the generated URL.

## Notes
- Do not commit secrets.
- Respect JioMart terms of service and rate limits.