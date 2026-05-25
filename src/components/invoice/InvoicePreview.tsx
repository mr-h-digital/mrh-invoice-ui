import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import type { Invoice } from '../../types/invoice';
import logoGreen from '../../assets/mrhdigital-logo-green.png';

interface InvoicePreviewProps {
  invoice: Partial<Invoice> & {
    invoiceNumber?: string;
    clientSnapshot?: Invoice['clientSnapshot'];
    lineItems?: Invoice['lineItems'];
  };
  darkPrint?: boolean;
}

const STATUS_LABEL: Record<string, string> = {
  DRAFT:   'DRAFT',
  SENT:    'SENT',
  PAID:    'PAID',
  OVERDUE: 'OVERDUE',
};

const STATUS_COLOR: Record<string, string> = {
  DRAFT:   '#5A6478',
  SENT:    '#60A5FA',
  PAID:    '#AADB1E',
  OVERDUE: '#EF4444',
};

// ─── Shared token values ───────────────────────────────────────────────────
const C = {
  dark:    '#0F1013',
  charcoal:'#16181D',
  card:    '#1E2128',
  border:  '#2E333D',
  muted:   '#5A6478',
  text:    '#B8C4D4',
  white:   '#E8EDF5',
  lime:    '#AADB1E',
  limeDk:  '#8AB818',
  red:     '#EF4444',
};

const mono = "'Space Mono', monospace";
const syne = "'Syne', sans-serif";
const sans = "'DM Sans', sans-serif";

// ─── Tiny helpers ─────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{ fontFamily: mono, fontSize: 9, letterSpacing: 3, textTransform: 'uppercase' as const, color: C.lime, marginBottom: 12, margin: '0 0 12px' }}>
      {children}
    </p>
  );
}

function TotalsRow({ label, value, color = C.text, borderBottom = true }: { label: string; value: string; color?: string; borderBottom?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: borderBottom ? `1px solid rgba(46,50,61,0.6)` : 'none' }}>
      <span style={{ fontFamily: sans, fontSize: 13, color: C.muted }}>{label}</span>
      <span style={{ fontFamily: mono, fontSize: 13, color }}>{value}</span>
    </div>
  );
}

function PaymentLine({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 8, fontFamily: sans, fontSize: 13, color: C.muted, marginBottom: 6 }}>
      <strong style={{ color: C.white, fontWeight: 500, minWidth: 90, flexShrink: 0 }}>{label}</strong>
      {value}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
export function InvoicePreview({ invoice, darkPrint = false }: InvoicePreviewProps) {
  const snap   = invoice.clientSnapshot;
  const items  = invoice.lineItems ?? [];
  const subtotal = invoice.subtotal ?? items.reduce((s, i) => s + (i.amount ?? 0), 0);
  const statusColor = invoice.status ? STATUS_COLOR[invoice.status] : C.muted;
  const statusLabel = invoice.status ? STATUS_LABEL[invoice.status] : '';

  return (
    <div
      className={`invoice-preview${darkPrint ? ' dark-print' : ''}`}
      style={{ background: C.charcoal, color: C.text, fontFamily: sans, borderRadius: 14, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px #2E333D' }}
    >

      {/* ── HEADER BAND ─────────────────────────────────────────────────── */}
      <div style={{ background: C.dark, padding: '40px 52px 32px', borderBottom: `3px solid ${C.lime}`, position: 'relative', overflow: 'hidden' }}>
        {/* "INV" watermark — hidden in light print via .inv-watermark CSS class */}
        <div className="inv-watermark" style={{ position: 'absolute', right: -8, top: -16, fontFamily: syne, fontSize: 140, fontWeight: 800, color: 'rgba(170,219,30,0.055)', lineHeight: 1, letterSpacing: -4, pointerEvents: 'none', userSelect: 'none' }}>
          INV
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0 40px', alignItems: 'start', position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <img src={logoGreen} alt="Mr. H Digital" style={{ height: 68, width: 'auto', display: 'block' }} />

          {/* Meta */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: mono, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.lime, margin: '0 0 6px' }}>
              Tax Invoice
            </p>
            <p style={{ fontFamily: syne, fontSize: 30, fontWeight: 800, color: C.white, lineHeight: 1, letterSpacing: -0.5, margin: '0 0 14px' }}>
              {invoice.invoiceNumber || 'INV-XXXX-XXX'}
            </p>
            {invoice.status && (
              <span style={{ display: 'inline-block', background: `${statusColor}22`, border: `1px solid ${statusColor}44`, color: statusColor, fontFamily: mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', padding: '5px 12px', borderRadius: 4 }}>
                {statusLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── PARTIES ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${C.border}` }}>
        {/* Billed From */}
        <div style={{ padding: '32px 52px', borderRight: `1px solid ${C.border}` }}>
          <SectionLabel>Billed From</SectionLabel>
          <p style={{ fontFamily: syne, fontSize: 16, fontWeight: 700, color: C.white, margin: '0 0 8px', lineHeight: 1.3 }}>Mr. H Digital</p>
          <div style={{ fontFamily: sans, fontSize: 13, color: C.muted, lineHeight: 1.8 }}>
            Lee Hildebrandt<br />
            Cape Town, South Africa<br />
            <span style={{ color: C.lime }}>info@mrhdigital.co.za</span><br />
            <span style={{ color: C.lime }}>mrhdigital.co.za</span><br />
            +27 76 687 1671
          </div>
        </div>

        {/* Billed To */}
        <div style={{ padding: '32px 52px' }}>
          <SectionLabel>Billed To</SectionLabel>
          {snap ? (
            <>
              <p style={{ fontFamily: syne, fontSize: 16, fontWeight: 700, color: C.white, margin: '0 0 8px', lineHeight: 1.3 }}>
                {snap.companyName || '—'}
              </p>
              <div style={{ fontFamily: sans, fontSize: 13, color: C.muted, lineHeight: 1.8 }}>
                {snap.contactName && <>{snap.contactName}<br /></>}
                {snap.address && <>{snap.address}<br /></>}
                {snap.email && <><span style={{ color: C.lime }}>{snap.email}</span><br /></>}
                {snap.phone && <>{snap.phone}</>}
              </div>
            </>
          ) : (
            <p style={{ color: C.muted, fontStyle: 'italic', margin: 0 }}>No client selected</p>
          )}
        </div>
      </div>

      {/* ── DATE STRIP ───────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: 'rgba(0,0,0,0.18)', borderBottom: `1px solid ${C.border}` }}>
        {[
          { label: 'Invoice Date', value: invoice.issueDate ? formatDate(invoice.issueDate) : '—' },
          { label: 'Payment Due',  value: invoice.dueDate   ? formatDate(invoice.dueDate)   : '—' },
          { label: 'Reference',    value: invoice.paymentDetails?.reference || invoice.invoiceNumber || '—' },
        ].map(({ label, value }, i) => (
          <div key={label} style={{ padding: '18px 52px', borderRight: i < 2 ? `1px solid ${C.border}` : 'none' }}>
            <p style={{ fontFamily: mono, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.muted, margin: '0 0 5px' }}>{label}</p>
            <p style={{ fontFamily: syne, fontSize: 14, fontWeight: 600, color: C.white, margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── LINE ITEMS ───────────────────────────────────────────────────── */}
      <div style={{ padding: '0 52px' }}>
        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px 110px 120px', gap: 12, padding: '18px 0 10px', borderBottom: `1px solid ${C.border}` }}>
          {['Description', 'Qty', 'Unit Price', 'Amount'].map((h, i) => (
            <span key={h} style={{ fontFamily: mono, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.muted, textAlign: i === 0 ? 'left' : 'right' }}>
              {h}
            </span>
          ))}
        </div>

        {items.length === 0 ? (
          <p style={{ textAlign: 'center', color: C.muted, fontStyle: 'italic', padding: '24px 0', margin: 0 }}>No line items yet</p>
        ) : (
          items.map((item, idx) => {
            const even = idx % 2 !== 0;
            return (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 72px 110px 120px',
                  gap: 12,
                  padding: even ? '14px 52px' : '14px 0',
                  margin: even ? '0 -52px' : '0',
                  borderBottom: `1px solid rgba(46,50,61,0.5)`,
                  background: even ? 'rgba(255,255,255,0.018)' : 'transparent',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p style={{ fontFamily: sans, fontSize: 13, fontWeight: 500, color: C.white, margin: '0 0 3px' }}>{item.name}</p>
                  {item.description && (
                    <p style={{ fontFamily: sans, fontSize: 11, color: C.muted, fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>{item.description}</p>
                  )}
                </div>
                <span style={{ fontFamily: mono, fontSize: 12, color: C.muted, textAlign: 'center' }}>{item.quantity}</span>
                <span style={{ fontFamily: mono, fontSize: 12, color: C.text, textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</span>
                <span style={{ fontFamily: mono, fontSize: 12, color: C.white, fontWeight: 600, textAlign: 'right' }}>{formatCurrency(item.amount)}</span>
              </div>
            );
          })
        )}
      </div>

      {/* ── TOTALS ───────────────────────────────────────────────────────── */}
      <div style={{ padding: '4px 52px 32px', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: 300 }}>
          <TotalsRow label="Subtotal" value={formatCurrency(subtotal)} />

          {(invoice.discountAmount ?? 0) > 0 && (
            <TotalsRow
              label={`Discount${invoice.discountType === 'PERCENT' ? ` (${invoice.discountValue}%)` : ''}`}
              value={`− ${formatCurrency(invoice.discountAmount ?? 0)}`}
              color={C.red}
            />
          )}

          {invoice.vatEnabled && (
            <TotalsRow
              label={`VAT (${((invoice.vatRate ?? 0.15) * 100).toFixed(0)}%)`}
              value={formatCurrency(invoice.vatAmount ?? 0)}
            />
          )}

          {/* Solid lime total block */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', background: C.lime, borderRadius: 10, marginTop: 14 }}>
            <span style={{ fontFamily: syne, fontSize: 14, fontWeight: 700, color: C.dark, letterSpacing: 0.3 }}>TOTAL DUE</span>
            <span style={{ fontFamily: mono, fontSize: 21, fontWeight: 700, color: C.dark }}>{formatCurrency(invoice.total ?? 0)}</span>
          </div>
        </div>
      </div>

      {/* ── PAYMENT DETAILS ──────────────────────────────────────────────── */}
      {invoice.paymentDetails && (
        <div style={{ margin: '0 52px 28px', padding: '24px 28px', background: 'rgba(0,0,0,0.22)', border: `1px solid ${C.border}`, borderRadius: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <SectionLabel>Payment Details</SectionLabel>
            <PaymentLine label="Bank"        value={invoice.paymentDetails.bank} />
            <PaymentLine label="Acc Name"    value={invoice.paymentDetails.accountName} />
            <PaymentLine label="Acc No."     value={invoice.paymentDetails.accountNumber} />
            <PaymentLine label="Acc Type"    value={invoice.paymentDetails.accountType} />
            <PaymentLine label="Branch"      value={invoice.paymentDetails.branchCode} />
            <PaymentLine label="Reference"   value={invoice.paymentDetails.reference || invoice.invoiceNumber || ''} />
            {invoice.dueDate && (
              <PaymentLine label="Due Date" value={formatDate(invoice.dueDate)} />
            )}
          </div>
          <div>
            <SectionLabel>Payment Terms</SectionLabel>
            <p style={{ fontFamily: sans, fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>
              {invoice.notes
                ? invoice.notes
                : 'Payment in full by the due date. Please use the invoice number as your payment reference.'}
            </p>
            <p style={{ fontFamily: sans, fontSize: 12, color: C.muted, marginTop: 12, marginBottom: 0 }}>
              Proof of payment to{' '}
              <span style={{ color: C.lime }}>info@mrhdigital.co.za</span>
            </p>
          </div>
        </div>
      )}

      {/* ── NOTES (only shown when separate from payment terms) ─────────── */}
      {invoice.notes && !invoice.paymentDetails && (
        <div style={{ margin: '0 52px 28px', padding: '18px 22px', background: 'rgba(170,219,30,0.05)', borderLeft: `3px solid ${C.lime}`, borderRadius: '0 8px 8px 0' }}>
          <p style={{ fontFamily: mono, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.lime, margin: '0 0 7px' }}>Note</p>
          <p style={{ fontFamily: sans, fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>{invoice.notes}</p>
        </div>
      )}

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 8, padding: '20px 52px', borderTop: `1px solid ${C.border}`, background: 'rgba(0,0,0,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={logoGreen} alt="Mr. H Digital" style={{ height: 26, width: 'auto', opacity: 0.7 }} />
          <div style={{ fontFamily: mono, fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
            Mr. H Digital<br />
            <span style={{ color: C.lime }}>mrhdigital.co.za</span>
            {' · '}Cape Town, SA
          </div>
        </div>
        <p style={{ fontFamily: sans, fontSize: 12, fontStyle: 'italic', color: C.muted, textAlign: 'right', maxWidth: 220, lineHeight: 1.6, margin: 0 }}>
          Custom websites &amp; digital products<br />for local businesses.
        </p>
      </div>

    </div>
  );
}
