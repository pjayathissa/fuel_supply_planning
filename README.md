# Fuel Reserves Estimator

An open-source interactive web application for modelling the impact of demand-reduction measures on New Zealand's fuel supply reserves. Users can adjust baseline parameters, toggle individual policy measures, and instantly see how the combined effect extends the country's onshore reserve days.

## Features

- **Baseline configuration** — set current onshore reserve days, daily consumption, and population figures via sliders
- **Policy measures** — toggle and tune measures such as speed limit reductions, remote working incentives, carpooling schemes, and more
- **Live results dashboard** — see extended reserve days, demand reduction percentage, daily fuel saved, and estimated annual economic cost in real time
- **Tier classification** — scenarios are automatically rated (Tier 1–3) based on their impact
- **Stacked bar chart** — visualise contribution of each active measure
- **Scenario export** — copy a plain-text summary of any scenario to the clipboard
- **Methodology modal** — view the assumptions and formulae behind every calculation

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI framework | React 19 |
| Build tool | Vite 7 |
| Charts | Recharts |
| Icons | Lucide React |
| Linting | ESLint 9 |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later (bundled with Node)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` with Hot Module Replacement (HMR) enabled.

## Testing

The project uses ESLint for static analysis. Run the linter with:

```bash
npm run lint
```

This checks all source files against the rules defined in `eslint.config.js`, including React Hooks and React Refresh rules.

> There are no automated unit/integration tests currently in the project. To add them, [Vitest](https://vitest.dev/) integrates directly with Vite and is the recommended choice:
>
> ```bash
> npm install -D vitest @testing-library/react @testing-library/jest-dom
> ```
>
> Then add `"test": "vitest"` to the `scripts` block in `package.json`.

## Building for Production

```bash
npm run build
```

Vite compiles and bundles the app into the `dist/` directory with tree-shaking and minification. Preview the production build locally before deploying:

```bash
npm run preview
```

This serves the `dist/` folder at `http://localhost:4173`.

## Deployment

### Vercel (recommended — zero config)

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Vite — leave all settings as default and click **Deploy**.

### Netlify

1. Push the repository to a Git provider.
2. Create a new site in [app.netlify.com](https://app.netlify.com) and connect the repository.
3. Set the build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy site**.

### GitHub Pages

1. Install the GitHub Pages plugin:

   ```bash
   npm install -D gh-pages
   ```

2. Add a `homepage` field and deploy scripts to `package.json`:

   ```json
   "homepage": "https://<your-username>.github.io/<repo-name>",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. If the app is not served from the root path, update `vite.config.js`:

   ```js
   export default defineConfig({
     base: '/<repo-name>/',
     plugins: [react()],
   })
   ```

4. Run:

   ```bash
   npm run deploy
   ```

### Docker / Static hosting

Build the `dist/` folder and serve it with any static file server (nginx, Caddy, AWS S3 + CloudFront, etc.):

```bash
npm run build
# Then copy dist/ to your server or bucket
```

## Project Structure

```
fuel_supply_planning/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images and SVGs
│   ├── components/       # React UI components
│   │   ├── AnimatedNumber.jsx
│   │   ├── BaselinePanel.jsx
│   │   ├── FuelGauge.jsx
│   │   ├── Header.jsx
│   │   ├── MeasureCard.jsx
│   │   ├── MeasureList.jsx
│   │   ├── MethodologyModal.jsx
│   │   ├── ResultsDashboard.jsx
│   │   ├── SliderInput.jsx
│   │   ├── StackedBarChart.jsx
│   │   └── TierBadge.jsx
│   ├── constants/
│   │   └── defaults.js   # Baseline defaults and measure definitions
│   ├── utils/
│   │   └── calculations.js  # Core calculation logic
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

## Contributing

1. Fork the repository and create a feature branch from `main`.
2. Make your changes and run `npm run lint` to ensure no linting errors.
3. Open a pull request against `main` with a clear description of the change.
