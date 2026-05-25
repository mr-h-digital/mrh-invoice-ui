<p align="center">
	<img src="assets/mrhdigital-logo.png" alt="Mr. H Digital Logo" width="120" />
</p>

<h1 align="center">Mr. H Digital — Invoice Generator</h1>

<p align="center">
	<strong>Production-ready React SPA for managing clients, creating branded invoices, and tracking payments.</strong>
</p>

<p align="center">
	<a href="https://mr-h-digital.github.io/mrh-invoice-ui/">Live App</a>
	·
	<a href="https://github.com/mr-h-digital/mrh-invoice-ui/actions">Deployment Workflow</a>
</p>

<p align="center">
	<a href="https://github.com/mr-h-digital/mrh-invoice-ui/actions">
		<img src="https://img.shields.io/github/actions/workflow/status/mr-h-digital/mrh-invoice-ui/deploy-pages.yml?branch=main&label=deploy&logo=githubactions&logoColor=white" alt="Deploy Status" />
	</a>
	<a href="https://github.com/mr-h-digital/mrh-invoice-ui/commits/main">
		<img src="https://img.shields.io/github/last-commit/mr-h-digital/mrh-invoice-ui?label=last%20commit" alt="Last Commit" />
	</a>
	<img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
	<img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript 6" />
	<img src="https://img.shields.io/badge/Tailwind_CSS-v4-AADB1E?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
	<img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
	<img src="https://img.shields.io/badge/license-proprietary-orange" alt="License" />
</p>

---

## Overview

This is the frontend SPA for the Mr. H Digital Invoice Generator. It handles the complete invoicing lifecycle — splash screen, login, client address book, invoice creation with live preview, status management, and branded PDF export.

Data is persisted to `localStorage` in the current phase. The service layer is built for a zero-friction swap to the Spring Boot BFF API — set `VITE_USE_API=true` in `.env.local` and all service calls route to the backend automatically.

## Highlights

- Branded splash screen with progress bar, terminal animation, and developer photo background
- JWT-free admin login with session persistence across page refreshes
- Dashboard with pre-aggregated stats from the backend (`/api/dashboard/stats`) with animated stat cards
- Invoice list with status filter tabs, full-text search, and animated card grid
- Two-panel invoice editor — form on the left, live branded preview on the right
- Drag-to-reorder line items with `dnd-kit` and `sortOrder` synced to the backend
- Real-time totals: subtotal → discount (flat or %) → 15% VAT → total due
- Client address book with invoice count and total per client
- Print / PDF export with togglable dark and light print modes
- Mobile-first responsive layout with slide-over sidebar drawer on small screens
- Skeleton loaders, empty states, confirm dialogs, and toast notifications throughout
- Background images compressed 82% — total asset payload under 1.5 MB
- Auto-deploys to GitHub Pages via GitHub Actions on every push to `main`

## Technology

| Category | Library |
|----------|---------|
| Framework | React 19 + TypeScript 6 (strict) |
| Build | Vite 8 + `@tailwindcss/vite` |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 (HashRouter for GitHub Pages) |
| State | Zustand |
| Forms | React Hook Form + Zod |
| HTTP | Axios (with `ApiResponse<T>` interceptor) |
| Animation | Framer Motion v12 |
| Drag & Drop | dnd-kit |
| Toasts | Sonner |
| Dialog | Headless UI v2 |
| Icons | Lucide React |
| Dates | date-fns |

## Project Structure

```text
mrh-web-ui-frontend/
|- src/
|  |- components/
|  |  |- layout/         # AppShell (mobile drawer), Sidebar, TopBar, PageBackground
|  |  |- invoice/        # InvoiceForm, InvoicePreview, LineItemsTable, InvoiceCard
|  |  |- clients/        # ClientForm, ClientCard, ClientSelector
|  |  |- shared/         # Modal, Badge, EmptyState, ConfirmDialog
|  |  |- SplashScreen.tsx
|  |- pages/
|  |  |- LoginPage.tsx
|  |  |- DashboardPage.tsx
|  |  |- InvoicesPage.tsx
|  |  |- NewInvoicePage.tsx
|  |  |- EditInvoicePage.tsx
|  |  |- InvoiceDetailPage.tsx
|  |  |- ClientsPage.tsx
|  |  |- NotFoundPage.tsx
|  |- hooks/             # useInvoices, useClients, useLocalStorage, usePrint
|  |- services/
|  |  |- api.ts          # Axios instance — unwraps ApiResponse<T> envelope
|  |  |- invoiceService.ts   # localStorage ↔ API toggle via VITE_USE_API
|  |  |- clientService.ts    # localStorage ↔ API toggle via VITE_USE_API
|  |- store/             # invoiceStore, clientStore, authStore, uiStore (Zustand)
|  |- schemas/           # invoiceSchema, clientSchema (Zod — mirrors backend enums)
|  |- types/             # invoice.ts, client.ts, api.ts
|  |- utils/             # formatCurrency, formatDate, invoiceTotals
|  |- assets/            # Compressed background images, logos
|- .github/
|  |- workflows/
|     |- deploy-pages.yml
|- assets/
|  |- mrhdigital-logo.png
|- .env.example
|- index.html
|- package.json
```

## Prerequisites

- Node.js 20+
- npm 10+

## Quick Start

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

App runs at `http://localhost:5173`.

**Login credentials:**

```
Email:    admin@mrhdigital.co.za
Password: password
```

## Build & Preview

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080/api` | Spring Boot BFF base URL |
| `VITE_USE_API` | _(unset)_ | Set to `true` to route all service calls to the BFF instead of localStorage |
| `VITE_APP_NAME` | `Mr. H Digital Invoice Generator` | App display name |

Copy `.env.example` to `.env.local` to configure:

```bash
cp .env.example .env.local
```

## Connecting to the Backend

Set both variables in `.env.local`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_USE_API=true
```

Start the Spring Boot BFF (`mrh-invoice-bff`) with Docker Compose, then run `npm run dev`. No other changes are needed — the service layer handles the switch transparently.

### API alignment

All enum values match the Java backend exactly:

| Frontend type | Values |
|---------------|--------|
| `InvoiceStatus` | `DRAFT` · `SENT` · `PAID` · `OVERDUE` |
| `DiscountType` | `AMOUNT` · `PERCENT` |

The Axios interceptor in `src/services/api.ts` automatically unwraps the backend's `ApiResponse<T>` envelope so all service callers receive `T` directly.

## API Endpoints Used

| Endpoint | Used by |
|----------|---------|
| `GET /api/dashboard/stats` | Dashboard page — totals and recent invoices |
| `GET /api/invoices` | Invoices list (paginated, filtered) |
| `GET /api/invoices/next-number` | New Invoice page — auto-incremented number |
| `POST /api/invoices` | Create invoice |
| `GET /api/invoices/{id}` | Invoice detail / edit |
| `PUT /api/invoices/{id}` | Save edited invoice |
| `PATCH /api/invoices/{id}/status` | Mark paid / status change |
| `POST /api/invoices/{id}/duplicate` | Duplicate invoice |
| `DELETE /api/invoices/{id}` | Delete invoice |
| `GET /api/clients` | Client selector + clients page |
| `POST /api/clients` | Add client |
| `PUT /api/clients/{id}` | Edit client |
| `DELETE /api/clients/{id}` | Delete client (409 surfaced as toast) |

## Pre-seeded Data

On first load (localStorage mode) the app seeds with:

**Clients**

| Company | Contact | Email |
|---------|---------|-------|
| Timeline Vehicle Export Company (Pty) Ltd | Thabo Seabi | thabo@tveco.co.za |
| R.O.C.K. Mission Ministries | Pastor Chernay Hildebrandt | info@rockmission.co.za |
| K&T Transport | Contact | info@ktransport.co.za |

**Invoices**

`INV-2026-001` — TVECO, status: `SENT`, 5 line items, R 1,200 negotiated discount, total **R 6,200.00**, due 1 June 2026.

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

The GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) builds and deploys to GitHub Pages on every push to `main`.

Manual deploy trigger:

```
Actions → Deploy to GitHub Pages → Run workflow
```

The app is served at `https://mr-h-digital.github.io/mrh-invoice-ui/`.

To deploy to other platforms:

- **Vercel** — connect repo, framework preset: Vite
- **Netlify** — connect repo, publish directory: `dist`, build command: `npm run build`

> **Note:** When deploying to Vercel or Netlify, switch `HashRouter` back to `BrowserRouter` in `src/App.tsx` and remove `base: '/mrh-invoice-ui/'` from `vite.config.ts` — those settings exist only for the GitHub Pages subdirectory path.

---

<p align="center">
	<strong>Development Signature</strong>
</p>

<p align="center">
	<img src="assets/mrhdigital-logo.png" alt="Mr. H Digital" width="100" />
</p>

<p align="center">
	Designed and developed by <a href="https://mrhdigital.co.za" target="_blank" rel="noopener noreferrer"><strong>Mr. H Digital</strong></a>
</p>
