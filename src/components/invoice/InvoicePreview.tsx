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
  DRAFT: 'DRAFT', SENT: 'SENT', PAID: 'PAID', OVERDUE: 'OVERDUE',
};
const STATUS_COLOR: Record<string, string> = {
  DRAFT: '#5A6478', SENT: '#60A5FA', PAID: '#AADB1E', OVERDUE: '#EF4444',
};

const C = {
  dark: '#0F1013', charcoal: '#16181D', card: '#1E2128',
  border: '#2E333D', muted: '#5A6478', text: '#B8C4D4',
  white: '#E8EDF5', lime: '#AADB1E', red: '#EF4444',
};

const mono = "'Space Mono', monospace";
const syne = "'Syne', sans-serif";
const sans = "'DM Sans', sans-serif";

function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{ fontFamily: mono, fontSize: 9, letterSpacing: 3, textTransform: 'uppercase' as const, color: C.lime, margin: '0 0 10px' }}>
      {children}
    </p>
  );
}

function TotalsRow({ label, value, color = C.text }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: `1px solid rgba(46,50,61,0.6)` }}>
      <span style={{ fontFamily: sans, fontSize: 12, color: C.muted }}>{label}</span>
      <span style={{ fontFamily: mono, fontSize: 12, color }}>{value}</span>
    </div>
  );
}

function PaymentLine({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 6, fontFamily: sans, fontSize: 12, color: C.muted, marginBottom: 5, flexWrap: 'wrap' as const }}>
      <strong style={{ color: C.white, fontWeight: 500, minWidth: 80, flexShrink: 0 }}>{label}</strong>
      <span style={{ wordBreak: 'break-all' as const }}>{value}</span>
    </div>
  );
}

export function InvoicePreview({ invoice, darkPrint = false }: InvoicePreviewProps) {
  const snap = invoice.clientSnapshot;
  const items = invoice.lineItems ?? [];
  const subtotal = invoice.subtotal ?? items.reduce((s, i) => s + (i.amount ?? 0), 0);
  const statusColor = invoice.status ? STATUS_COLOR[invoice.status] : C.muted;
  const statusLabel = invoice.status ? STATUS_LABEL[invoice.status] : '';

  // Responsive padding — CSS clamp via inline style using a CSS custom property isn't available,
  // so we use a wrapper class to get responsive padding via Tailwind.
  const padH = 'clamp(16px, 4vw, 52px)';

  return (
    <div
      className={`invoice-preview${darkPrint ? ' dark-print' : ''}`}
      style={{ background: C.charcoal, color: C.text, fontFamily: sans, borderRadius: 12, overflow: 'hidden', boxShadow: '0 16px 60px rgba(0,0,0,0.5), 0 0 0 1px #2E333D' }}
    >

      {/* ── HEADER ── */}
      <div style={{ background: C.dark, padding: `clamp(20px,4vw,40px) ${padH} clamp(16px,3vw,32px)`, borderBottom: `3px solid ${C.lime}`, position: 'relative', overflow: 'hidden' }}>
        <div className="inv-watermark" style={{ position: 'absolute', right: -8, top: -16, fontFamily: syne, fontSize: 'clamp(60px,14vw,140px)', fontWeight: 800, color: 'rgba(170,219,30,0.055)', lineHeight: 1, letterSpacing: -4, pointerEvents: 'none', userSelect: 'none' }}>
          INV
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
          <img src={logoGreen} alt="Mr. H Digital" style={{ height: 'clamp(40px,8vw,68px)', width: 'auto', display: 'block', flexShrink: 0 }} />
          <div style={{ textAlign: 'right', minWidth: 0 }}>
            <p style={{ fontFamily: mono, fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: C.lime, margin: '0 0 4px' }}>Tax Invoice</p>
            <p style={{ fontFamily: syne, fontSize: 'clamp(18px,4vw,30px)', fontWeight: 800, color: C.white, lineHeight: 1, letterSpacing: -0.5, margin: '0 0 10px', wordBreak: 'break-all' }}>
              {invoice.invoiceNumber || 'INV-XXXX-XXX'}
            </p>
            {invoice.status && (
              <span style={{ display: 'inline-block', background: `${statusColor}22`, border: `1px solid ${statusColor}44`, color: statusColor, fontFamily: mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 4 }}>
                {statusLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── PARTIES — stack on very small screens ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ padding: `clamp(16px,3vw,32px) ${padH}`, borderRight: `1px solid ${C.border}` }}>
          <SectionLabel>Billed From</SectionLabel>
          <p style={{ fontFamily: syne, fontSize: 'clamp(13px,2vw,16px)', fontWeight: 700, color: C.white, margin: '0 0 6px', lineHeight: 1.3 }}>Mr. H Digital</p>
          <div style={{ fontFamily: sans, fontSize: 12, color: C.muted, lineHeight: 1.8 }}>
            Lee Hildebrandt<br />
            Cape Town, South Africa<br />
            <span style={{ color: C.lime }}>info@mrhdigital.co.za</span><br />
            <span style={{ color: C.lime }}>mrhdigital.co.za</span><br />
            +27 76 687 1671
          </div>
        </div>
        <div style={{ padding: `clamp(16px,3vw,32px) ${padH}` }}>
          <SectionLabel>Billed To</SectionLabel>
          {snap ? (
            <>
              <p style={{ fontFamily: syne, fontSize: 'clamp(13px,2vw,16px)', fontWeight: 700, color: C.white, margin: '0 0 6px', lineHeight: 1.3 }}>
                {snap.companyName || '—'}
              </p>
              <div style={{ fontFamily: sans, fontSize: 12, color: C.muted, lineHeight: 1.8, wordBreak: 'break-word' }}>
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

      {/* ── DATE STRIP — 2-col on small, 3-col on wider ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', background: 'rgba(0,0,0,0.18)', borderBottom: `1px solid ${C.border}` }}>
        {[
          { label: 'Invoice Date', value: invoice.issueDate ? formatDate(invoice.issueDate) : '—' },
          { label: 'Payment Due',  value: invoice.dueDate   ? formatDate(invoice.dueDate)   : '—' },
          { label: 'Reference',    value: invoice.paymentDetails?.reference || invoice.invoiceNumber || '—' },
        ].map(({ label, value }, i) => (
          <div key={label} style={{ padding: `clamp(12px,2vw,18px) ${padH}`, borderRight: i < 2 ? `1px solid ${C.border}` : 'none' }}>
            <p style={{ fontFamily: mono, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.muted, margin: '0 0 4px' }}>{label}</p>
            <p style={{ fontFamily: syne, fontSize: 'clamp(11px,2vw,14px)', fontWeight: 600, color: C.white, margin: 0, wordBreak: 'break-all' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── LINE ITEMS ── */}
      <div style={{ padding: `0 ${padH}` }}>
        {/* Desktop column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 90px 90px', gap: 8, padding: 'clamp(12px,2vw,18px) 0 8px', borderBottom: `1px solid ${C.border}` }}>
          {['Description', 'Qty', 'Unit Price', 'Amount'].map((h, i) => (
            <span key={h} style={{ fontFamily: mono, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: C.muted, textAlign: i === 0 ? 'left' : 'right' }}>
              {h}
            </span>
          ))}
        </div>

        {items.length === 0 ? (
          <p style={{ textAlign: 'center', color: C.muted, fontStyle: 'italic', padding: '20px 0', margin: 0 }}>No line items yet</p>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 50px 90px 90px',
                gap: 8,
                padding: 'clamp(10px,1.5vw,14px) 0',
                borderBottom: `1px solid rgba(46,50,61,0.5)`,
                background: idx % 2 !== 0 ? 'rgba(255,255,255,0.018)' : 'transparent',
                alignItems: 'start',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: sans, fontSize: 'clamp(11px,1.8vw,13px)', fontWeight: 500, color: C.white, margin: '0 0 2px', wordBreak: 'break-word' }}>{item.name}</p>
                {item.description && (
                  <p style={{ fontFamily: sans, fontSize: 11, color: C.muted, fontStyle: 'italic', lineHeight: 1.4, margin: 0, wordBreak: 'break-word' }}>{item.description}</p>
                )}
              </div>
              <span style={{ fontFamily: mono, fontSize: 11, color: C.muted, textAlign: 'center', paddingTop: 2 }}>{item.quantity}</span>
              <span style={{ fontFamily: mono, fontSize: 11, color: C.text, textAlign: 'right', paddingTop: 2, wordBreak: 'break-all' }}>{formatCurrency(item.unitPrice)}</span>
              <span style={{ fontFamily: mono, fontSize: 11, color: C.white, fontWeight: 600, textAlign: 'right', paddingTop: 2, wordBreak: 'break-all' }}>{formatCurrency(item.amount)}</span>
            </div>
          ))
        )}
      </div>

      {/* ── TOTALS ── */}
      <div style={{ padding: `4px ${padH} clamp(20px,3vw,32px)`, display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '100%', maxWidth: 280 }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'clamp(12px,2vw,18px) clamp(12px,2vw,22px)', background: C.lime, borderRadius: 8, marginTop: 12 }}>
            <span style={{ fontFamily: syne, fontSize: 13, fontWeight: 700, color: C.dark, letterSpacing: 0.3 }}>TOTAL DUE</span>
            <span style={{ fontFamily: mono, fontSize: 'clamp(14px,2.5vw,20px)', fontWeight: 700, color: C.dark }}>{formatCurrency(invoice.total ?? 0)}</span>
          </div>
        </div>
      </div>

      {/* ── PAYMENT DETAILS — stack on small ── */}
      {invoice.paymentDetails && (
        <div style={{ margin: `0 ${padH} clamp(16px,2.5vw,28px)`, padding: 'clamp(16px,2.5vw,24px) clamp(14px,2.5vw,28px)', background: 'rgba(0,0,0,0.22)', border: `1px solid ${C.border}`, borderRadius: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'clamp(16px,3vw,32px)' }}>
          <div>
            <SectionLabel>Payment Details</SectionLabel>
            <PaymentLine label="Bank"       value={invoice.paymentDetails.bank} />
            <PaymentLine label="Acc Name"   value={invoice.paymentDetails.accountName} />
            <PaymentLine label="Acc No."    value={invoice.paymentDetails.accountNumber} />
            <PaymentLine label="Acc Type"   value={invoice.paymentDetails.accountType} />
            <PaymentLine label="Branch"     value={invoice.paymentDetails.branchCode} />
            <PaymentLine label="Reference"  value={invoice.paymentDetails.reference || invoice.invoiceNumber || ''} />
            {invoice.dueDate && <PaymentLine label="Due Date" value={formatDate(invoice.dueDate)} />}
          </div>
          <div>
            <SectionLabel>Payment Terms</SectionLabel>
            <p style={{ fontFamily: sans, fontSize: 12, color: C.muted, lineHeight: 1.7, margin: 0 }}>
              {invoice.notes || 'Payment in full by the due date. Please use the invoice number as your payment reference.'}
            </p>
            <p style={{ fontFamily: sans, fontSize: 11, color: C.muted, marginTop: 10, marginBottom: 0 }}>
              Proof of payment to <span style={{ color: C.lime }}>info@mrhdigital.co.za</span>
            </p>
          </div>
        </div>
      )}

      {/* ── NOTES ── */}
      {invoice.notes && !invoice.paymentDetails && (
        <div style={{ margin: `0 ${padH} clamp(16px,2.5vw,28px)`, padding: 'clamp(14px,2vw,18px) clamp(14px,2vw,22px)', background: 'rgba(170,219,30,0.05)', borderLeft: `3px solid ${C.lime}`, borderRadius: '0 8px 8px 0' }}>
          <p style={{ fontFamily: mono, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.lime, margin: '0 0 6px' }}>Note</p>
          <p style={{ fontFamily: sans, fontSize: 12, color: C.muted, lineHeight: 1.7, margin: 0 }}>{invoice.notes}</p>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div style={{ marginTop: 4, padding: `clamp(14px,2vw,20px) ${padH}`, borderTop: `1px solid ${C.border}`, background: 'rgba(0,0,0,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={logoGreen} alt="Mr. H Digital" style={{ height: 22, width: 'auto', opacity: 0.7, flexShrink: 0 }} />
          <div style={{ fontFamily: mono, fontSize: 10, color: C.muted, lineHeight: 1.6 }}>
            Mr. H Digital · <span style={{ color: C.lime }}>mrhdigital.co.za</span>
          </div>
        </div>
        <p style={{ fontFamily: sans, fontSize: 11, fontStyle: 'italic', color: C.muted, margin: 0 }}>
          Cape Town, SA
        </p>
      </div>

    </div>
  );
}
