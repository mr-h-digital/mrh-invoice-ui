<p align="center">
	<img src="assets/mrhdigital-logo.png" alt="Mr. H Digital Logo" width="120" />
</p>

<h1 align="center">Mr. H Digital — Invoice Generator UI</h1>

<p align="center">
	<strong>Production-ready React SPA for managing clients, creating branded invoices, and tracking payments.</strong>
</p>

<p align="center">
	<a href="https://mr-h-digital.github.io/mrh-invoice-ui/">Live App</a>
	·
	<a href="https://github.com/mr-h-digital/mrh-invoice-ui/actions">Deployment Workflow</a>
	·
	<a href="https://github.com/mr-h-digital/mrh-invoice-ui">Repository</a>
</p>

<p align="center">
	<a href="https://github.com/mr-h-digital/mrh-invoice-ui/actions">
		<img src="https://img.shields.io/github/actions/workflow/status/mr-h-digital/mrh-invoice-ui/deploy-pages.yml?branch=main&label=deploy&logo=githubactions&logoColor=white" alt="Deploy Status" />
	</a>
	<a href="https://github.com/mr-h-digital/mrh-invoice-ui/commits/main">
		<img src="https://img.shields.io/github/last-commit/mr-h-digital/mrh-invoice-ui?label=last%20commit" alt="Last Commit" />
	</a>
	<a href="https://github.com/mr-h-digital/mrh-invoice-ui">
		<img src="https://img.shields.io/github/repo-size/mr-h-digital/mrh-invoice-ui?label=repo%20size" alt="Repo Size" />
	</a>
	<img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
	<img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript 6" />
	<img src="https://img.shields.io/badge/Tailwind_CSS-v4-AADB1E?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
	<img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
	<img src="https://img.shields.io/badge/license-proprietary-orange" alt="License" />
</p>

---

## Overview

This is the frontend SPA for the Mr. H Digital Invoice Generator. It handles the complete invoicing lifecycle — branded splash screen, admin login, client address book, invoice creation with live preview, status management, and branded PDF export.

Data is persisted to `localStorage` in the current phase. The service layer is built for a zero-friction swap to the Spring Boot BFF — set `VITE_USE_API=true` in `.env.local` and all service calls route to the backend automatically without touching any UI code.

## Highlights

- Branded splash screen with animated progress bar, terminal boot sequence, and developer photo background
- Admin login with session persistence across page refreshes (no JWT required in localStorage phase)
- Dashboard with pre-aggregated stats (`/api/dashboard/stats`) and animated count-up stat cards
- Invoice list with status filter tabs, full-text search, and staggered card animations
- Two-panel invoice editor — form left, real-time branded invoice preview right
- Drag-to-reorder line items with `dnd-kit`; `sortOrder` synced to the backend on every save
- Real-time totals: subtotal → discount (flat R or %) → 15% SA VAT → total due
- Client address book with invoice count and lifetime total per client
- Print / PDF export with togglable dark-branded and clean-white print modes
- Mobile-first responsive layout with spring-animated slide-over sidebar drawer
- Skeleton loaders, empty states, confirm dialogs, and toast notifications throughout
- Background images compressed 82% via `sharp` — total asset payload under 1.5 MB
- Auto-deploys to GitHub Pages via GitHub Actions on every push to `main`

## Technology

| Category | Choice |
|----------|--------|
| Language | TypeScript 6 (strict mode) |
| Framework | React 19 |
| Build | Vite 8 + `@tailwindcss/vite` |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 (HashRouter for GitHub Pages) |
| State | Zustand |
| Forms | React Hook Form + Zod |
| HTTP | Axios (with `ApiResponse<T>` unwrap interceptor) |
| Animation | Framer Motion v12 |
| Drag & Drop | dnd-kit |
| Toasts | Sonner |
| Dialog | Headless UI v2 |
| Icons | Lucide React |
| Dates | date-fns |

## Project Structure

```text
mrh-web-ui-frontend/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml          # Auto-deploy to GitHub Pages
├── assets/
│   └── mrhdigital-logo.png
├── src/
│   ├── components/
│   │   ├── layout/                   # AppShell, Sidebar, TopBar, PageBackground
│   │   ├── invoice/                  # InvoiceForm, InvoicePreview, LineItemsTable, InvoiceCard
│   │   ├── clients/                  # ClientForm, ClientCard, ClientSelector
│   │   ├── shared/                   # Modal, Badge, EmptyState, ConfirmDialog
│   │   └── SplashScreen.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── InvoicesPage.tsx
│   │   ├── NewInvoicePage.tsx
│   │   ├── EditInvoicePage.tsx
│   │   ├── InvoiceDetailPage.tsx
│   │   ├── ClientsPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── hooks/                        # useInvoices, useClients, useLocalStorage, usePrint
│   ├── services/
│   │   ├── api.ts                    # Axios instance — unwraps ApiResponse<T> envelope
│   │   ├── invoiceService.ts         # localStorage ↔ API toggle via VITE_USE_API
│   │   └── clientService.ts          # localStorage ↔ API toggle via VITE_USE_API
│   ├── store/                        # invoiceStore, clientStore, authStore, uiStore
│   ├── schemas/                      # invoiceSchema, clientSchema (Zod — mirrors backend enums)
│   ├── types/                        # invoice.ts, client.ts, api.ts
│   ├── utils/                        # formatCurrency, formatDate, invoiceTotals
│   └── assets/                       # Compressed background images, brand logos
├── .env.example
├── index.html
└── package.json
```

## Prerequisites

- Node.js 20+
- npm 10+

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

### 3. Open the app

```
http://localhost:5173
```

### 4. Login credentials

```
Email:    admin@mrhdigital.co.za
Password: password
```

## Building

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Connecting to the Backend

Set both variables in `.env.local`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_USE_API=true
```

Start the Spring Boot BFF (`mrh-invoice-bff`) with Docker Compose, then run `npm run dev`. No other files need changing — the service layer handles the switch transparently.

## API Endpoints Used

### Dashboard — `/api/dashboard`

| Method | Path | Used by |
|--------|------|---------|
| `GET` | `/api/dashboard/stats` | Dashboard page — totals, counts, 5 recent invoices |

### Invoices — `/api/invoices`

| Method | Path | Used by |
|--------|------|---------|
| `GET` | `/api/invoices` | Invoice list (paginated, filterable, searchable) |
| `POST` | `/api/invoices` | Create invoice |
| `GET` | `/api/invoices/{id}` | Invoice detail + edit page |
| `PUT` | `/api/invoices/{id}` | Save edited invoice (recalculates totals server-side) |
| `PATCH` | `/api/invoices/{id}/status` | Status-only update (Mark Paid, status dropdown) |
| `POST` | `/api/invoices/{id}/duplicate` | Duplicate as new DRAFT with today's date |
| `DELETE` | `/api/invoices/{id}` | Delete invoice |
| `GET` | `/api/invoices/next-number` | New Invoice page — auto-incremented number from DB |

### Clients — `/api/clients`

| Method | Path | Used by |
|--------|------|---------|
| `GET` | `/api/clients` | Client selector + clients page |
| `POST` | `/api/clients` | Add client |
| `PUT` | `/api/clients/{id}` | Edit client |
| `DELETE` | `/api/clients/{id}` | Delete client (409 Conflict surfaced as toast) |

## API Alignment

All enum values match the Java backend exactly:

| Frontend type | Values |
|---------------|--------|
| `InvoiceStatus` | `DRAFT` · `SENT` · `PAID` · `OVERDUE` |
| `DiscountType` | `AMOUNT` · `PERCENT` |

The Axios interceptor in `src/services/api.ts` automatically unwraps the backend's `ApiResponse<T>` envelope so all service callers receive `T` directly.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080/api` | Spring Boot BFF base URL |
| `VITE_USE_API` | _(unset)_ | Set to `true` to route all calls to the BFF |
| `VITE_APP_NAME` | `Mr. H Digital Invoice Generator` | App display name |

## Seed Data

On first load (localStorage mode) the app seeds with:

| Client | Contact | Email |
|--------|---------|-------|
| Timeline Vehicle Export Company (Pty) Ltd | Thabo Seabi | thabo@tveco.co.za |
| R.O.C.K. Mission Ministries | Pastor Chernay Hildebrandt | info@rockmission.co.za |
| K&T Transport | Contact | info@ktransport.co.za |

Plus invoice `INV-2026-001` for TVECO — status `SENT`, 5 line items, R 1,200 negotiated discount, total **R 6,200.00**, due 1 June 2026.

## Brand Tokens

| Token | Value |
|-------|-------|
| Lime | `#AADB1E` |
| Dark | `#0F1013` |
| Charcoal | `#16181D` |
| Card | `#1E2128` |
| Border | `#2E333D` |
| Muted | `#5A6478` |
| Text | `#B8C4D4` |
| White | `#E8EDF5` |
| Display font | Syne 700 / 800 |
| Mono font | Space Mono 400 / 700 |
| Body font | DM Sans 300 / 400 / 500 |

## Deployment

The GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) builds and deploys to GitHub Pages automatically on every push to `main`.

Manual trigger:

```
Actions → Deploy to GitHub Pages → Run workflow
```

The app is served at `https://mr-h-digital.github.io/mrh-invoice-ui/`.

To deploy to other platforms:

- **Vercel** — connect repo, framework preset: Vite
- **Netlify** — connect repo, publish directory: `dist`, build command: `npm run build`

> **Note:** When moving to Vercel or Netlify, switch `HashRouter` back to `BrowserRouter` in `src/App.tsx` and remove `base: '/mrh-invoice-ui/'` from `vite.config.ts`. Those two settings exist only for the GitHub Pages subdirectory path.

---

<p align="center">
	<strong>Development Signature</strong>
</p>

<p align="center">
	<img src="assets/mrhdigital-logo.png" alt="Mr. H Digital Logo" width="120" />
</p>

<p align="center">
	Designed and developed by <a href="https://mrhdigital.co.za" target="_blank" rel="noopener noreferrer"><strong>Mr. H Digital</strong></a>
</p>
