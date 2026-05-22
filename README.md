<p align="center">
	<img src="assets/mrhdigital-logo.png" alt="Mr. H Digital Logo" width="120" />
</p>

<h1 align="center">Mr. H Digital — Invoice Generator</h1>

<p align="center">
	<strong>Internal invoicing tool for managing clients, creating branded invoices, and tracking payments.</strong>
</p>

<p align="center">
	<img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
	<img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
	<img src="https://img.shields.io/badge/Tailwind_CSS-v4-AADB1E?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
	<img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
	<img src="https://img.shields.io/badge/license-proprietary-orange" alt="License" />
</p>

---

## Overview

A full-featured single-page invoice generator built for Mr. H Digital's internal business operations. It handles the full invoicing lifecycle — from client management to branded PDF output — with a dark, on-brand UI.

All data is persisted to `localStorage` in the current phase. The service layer is architected for a clean swap to a REST backend without touching any UI code.

## Features

- **Dashboard** — at-a-glance stats for total invoiced, paid, outstanding, and overdue amounts with animated count-up on load
- **Invoice management** — create, edit, duplicate, and delete invoices with status tracking (Draft → Sent → Paid / Overdue)
- **Live preview** — two-panel editor with a real-time branded invoice render as you type
- **Drag-to-reorder line items** — sortable rows with dnd-kit and Framer Motion layout animations
- **Client address book** — save clients for quick selection when creating invoices; client data is snapshot at invoice time
- **Auto-incrementing invoice numbers** — `INV-YYYY-NNN` format, scoped per year
- **South African locale** — ZAR currency (`R 6,200.00`), SA date format (`22 May 2026`), 15% VAT toggle
- **Discount support** — flat amount or percentage, applied before VAT
- **Print / PDF export** — `window.print()` with light and dark print modes
- **Page transitions** — Framer Motion `AnimatePresence` between routes
- **Accessible** — keyboard navigation and focus management via Headless UI primitives

## Technology

| Category | Library |
|----------|---------|
| Framework | React 19 + TypeScript 6 (strict) |
| Build | Vite 8 + `@tailwindcss/vite` |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| State | Zustand |
| Forms | React Hook Form + Zod |
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
|  |  |- layout/         # AppShell, Sidebar, TopBar
|  |  |- invoice/        # InvoiceForm, InvoicePreview, LineItemsTable, InvoiceCard
|  |  |- clients/        # ClientForm, ClientCard, ClientSelector
|  |  |- shared/         # Modal, Badge, EmptyState, ConfirmDialog
|  |- pages/             # Dashboard, Invoices, NewInvoice, EditInvoice, InvoiceDetail, Clients
|  |- hooks/             # useInvoices, useClients, useLocalStorage, usePrint
|  |- services/          # invoiceService, clientService  ← swap these for API calls
|  |- store/             # invoiceStore, clientStore, uiStore (Zustand)
|  |- schemas/           # invoiceSchema, clientSchema (Zod)
|  |- types/             # invoice.ts, client.ts, api.ts
|  |- utils/             # formatCurrency, formatDate, generateInvoiceNumber, invoiceTotals
|- assets/
|  |- mrhdigital-logo.png
|- .env.example
|- index.html
|- package.json
```

## Local Setup

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

App runs at `http://localhost:5173`.

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Environment

Copy `.env.example` to `.env.local` and set the API base URL for when the backend is ready:

```bash
cp .env.example .env.local
```

```env
VITE_API_URL=http://localhost:8080/api
```

In the current localStorage phase this variable is unused. The `src/services/api.ts` Axios instance is configured and waiting.

## Swapping to a Real Backend

The service layer is the only thing that needs to change. Replace the localStorage implementations in:

- `src/services/invoiceService.ts`
- `src/services/clientService.ts`

with calls to the configured Axios instance in `src/services/api.ts`. All hooks, stores, and UI components remain untouched.

## Pre-seeded Data

On first load the app seeds `localStorage` with:

**Clients**

- Timeline Vehicle Export Company (Pty) Ltd — Thabo Seabi
- R.O.C.K. Mission Ministries — Pastor Chernay Hildebrandt
- K&T Transport

**Invoices**

- `INV-2026-001` — TVECO, status: Sent, total: R 6,200.00, due 1 June 2026

## Brand

| Token | Value |
|-------|-------|
| Lime | `#AADB1E` |
| Charcoal | `#16181D` |
| Card | `#1E2128` |
| Text | `#B8C4D4` |
| Display font | Syne 700/800 |
| Mono font | Space Mono |
| Body font | DM Sans 300/400/500 |

## Deployment

The production build outputs a fully static bundle to `dist/`. It can be deployed to any static host:

- **Vercel** — connect repo, framework preset: Vite
- **Netlify** — connect repo, publish directory: `dist`, build command: `npm run build`
- **GitHub Pages** — build and push `dist/` to a `gh-pages` branch

---

<p align="center">
	<strong>Development Signature</strong>
</p>

<p align="center">
	<img src="assets/mrhdigital-logo.png" alt="Mr. H Digital" width="100" />
</p>

<p align="center">
	Designed and developed by <a href="https://mrhdigital.co.za"><strong>Mr. H Digital</strong></a>
</p>
