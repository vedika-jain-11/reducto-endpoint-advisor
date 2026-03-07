# Reducto Endpoint Advisor

Describe your document workflow in plain English → get mapped to the right Reducto API pipeline → see real customer examples.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import it in [vercel.com/new](https://vercel.com/new)
3. Add environment variable: `ANTHROPIC_API_KEY` = your key
4. Deploy

## Local development

```bash
npm install
npm run dev
```

Create a `.env.local` file with your API key:
```
ANTHROPIC_API_KEY=sk-ant-...
```

## Project structure

```
├── api/
│   └── recommend.js     # Serverless function (proxies Anthropic API)
├── src/
│   ├── main.jsx          # React entry point
│   └── App.jsx           # Endpoint advisor component
├── index.html            # HTML shell
├── vite.config.js        # Vite config
├── vercel.json           # Vercel deploy config
└── package.json
```
