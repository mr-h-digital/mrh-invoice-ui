import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { NewInvoicePage } from './pages/NewInvoicePage';
import { EditInvoicePage } from './pages/EditInvoicePage';
import { InvoiceDetailPage } from './pages/InvoiceDetailPage';
import { ClientsPage } from './pages/ClientsPage';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex-1 flex flex-col"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <AnimatedPage>
                  <DashboardPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/invoices"
              element={
                <AnimatedPage>
                  <InvoicesPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/invoices/new"
              element={
                <AnimatedPage>
                  <NewInvoicePage />
                </AnimatedPage>
              }
            />
            <Route
              path="/invoices/:id"
              element={
                <AnimatedPage>
                  <InvoiceDetailPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/invoices/:id/edit"
              element={
                <AnimatedPage>
                  <EditInvoicePage />
                </AnimatedPage>
              }
            />
            <Route
              path="/clients"
              element={
                <AnimatedPage>
                  <ClientsPage />
                </AnimatedPage>
              }
            />
          </Routes>
        </AnimatePresence>
      </AppShell>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1E2128',
            border: '1px solid #2E333D',
            color: '#B8C4D4',
          },
        }}
      />
    </BrowserRouter>
  );
}
