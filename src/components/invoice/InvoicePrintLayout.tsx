/**
 * InvoicePrintLayout — renders only in print media.
 * Hybrid design: dark branded header, white body, lime accents.
 * Completely independent of InvoicePreview so no CSS fighting.
 */
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import type { Invoice } from '../../types/invoice';
import logoGreen from '../../assets/mrhdigital-logo-green.png';

interface Props { invoice: Invoice }

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'DRAFT', SENT: 'SENT', PAID: 'PAID', OVERDUE: 'OVERDUE',
};
const STATUS_COLOR: Record<string, string> = {
  DRAFT: '#5A6478', SENT: '#1D4ED8', PAID: '#166534', OVERDUE: '#B91C1C',
};
const STATUS_BG: Record<string, string> = {
  DRAFT: '#F1F5F9', SENT: '#DBEAFE', PAID: '#DCFCE7', OVERDUE: '#FEE2E2',
};

// ── Design tokens ──────────────────────────────────────────────────────────
const dark    = '#16181D';
const lime    = '#AADB1E';
const ink     = '#111827';
const sub     = '#374151';
const muted   = '#6B7280';
const rule    = '#E5E7EB';
const bgGray  = '#F9FAFB';
const white   = '#FFFFFF';

const mono = "'Space Mono', monospace";
const syne = "'Syne', sans-serif";
const sans = "'DM Sans', sans-serif";

const label = (text: string) => (
  <div style={{ fontFamily: mono, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: muted, marginBottom: 6 }}>
    {text}
  </div>
);

export function InvoicePrintLayout({ invoice }: Props) {
  const snap  = invoice.clientSnapshot;
  const items = invoice.lineItems ?? [];
  const statusLabel = STATUS_LABEL[invoice.status] ?? invoice.status;
  const statusColor = STATUS_COLOR[invoice.status] ?? muted;
  const statusBg    = STATUS_BG[invoice.status]    ?? bgGray;

  return (
    <div id="invoice-print-area" style={{
      fontFamily: sans, color: ink,
      background: white, width: '100%',
      zoom: 0.88,
    }}>

      {/* ══ HEADER — dark brand band ═══════════════════════════════════════ */}
      <div style={{
        background: dark,
        borderBottom: `4px solid ${lime}`,
        padding: '28px 36px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src={logoGreen} alt="Mr. H Digital"
            style={{ height: 52, width: 'auto' }} />
          <div>
            <div style={{ fontFamily: syne, fontWeight: 800, fontSize: 18, color: '#E8EDF5', letterSpacing: -0.3 }}>
              Mr. H Digital
            </div>
            <div style={{ fontFamily: mono, fontSize: 9, color: lime, letterSpacing: '0.12em', marginTop: 3 }}>
              CUSTOM WEBSITES &amp; DIGITAL PRODUCTS
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.15em', color: lime, marginBottom: 4 }}>
            TAX INVOICE
          </div>
          <div style={{ fontFamily: syne, fontWeight: 800, fontSize: 26, color: '#E8EDF5', letterSpacing: -0.5, lineHeight: 1 }}>
            {invoice.invoiceNumber}
          </div>
          <div style={{
            display: 'inline-block', marginTop: 8,
            background: statusBg, color: statusColor,
            fontFamily: mono, fontSize: 9, letterSpacing: '0.12em',
            padding: '3px 10px', borderRadius: 3, border: `1px solid ${statusColor}44`,
          }}>
            {statusLabel}
          </div>
        </div>
      </div>

      {/* ══ PARTIES — white, two columns ══════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${rule}` }}>
        <div style={{ padding: '22px 36px', borderRight: `1px solid ${rule}` }}>
          {label('Billed From')}
          <div style={{ fontFamily: syne, fontWeight: 700, fontSize: 14, color: ink, marginBottom: 6 }}>
            Mr. H Digital
          </div>
          <div style={{ fontSize: 12, color: sub, lineHeight: 1.8 }}>
            Lee Hildebrandt<br />
            Cape Town, South Africa<br />
            <span style={{ color: '#1D4ED8' }}>info@mrhdigital.co.za</span><br />
            <span style={{ color: '#1D4ED8' }}>mrhdigital.co.za</span><br />
            +27 76 687 1671
          </div>
        </div>

        <div style={{ padding: '22px 36px' }}>
          {label('Billed To')}
          {snap && (
            <>
              <div style={{ fontFamily: syne, fontWeight: 700, fontSize: 14, color: ink, marginBottom: 6, lineHeight: 1.3 }}>
                {snap.companyName}
              </div>
              <div style={{ fontSize: 12, color: sub, lineHeight: 1.8 }}>
                {snap.contactName && <>{snap.contactName}<br /></>}
                {snap.address && <>{snap.address}<br /></>}
                {snap.email && <><span style={{ color: '#1D4ED8' }}>{snap.email}</span><br /></>}
                {snap.phone && <>{snap.phone}</>}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ══ DATE STRIP — light grey band ═══════════════════════════════════ */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        background: bgGray, borderBottom: `1px solid ${rule}`,
      }}>
        {[
          { l: 'Invoice Date', v: formatDate(invoice.issueDate) },
          { l: 'Payment Due',  v: formatDate(invoice.dueDate) },
          { l: 'Reference',    v: invoice.paymentDetails?.reference || invoice.invoiceNumber },
        ].map(({ l, v }, i) => (
          <div key={l} style={{ padding: '14px 36px', borderRight: i < 2 ? `1px solid ${rule}` : 'none' }}>
            {label(l)}
            <div style={{ fontFamily: syne, fontWeight: 600, fontSize: 13, color: ink }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ══ LINE ITEMS ══════════════════════════════════════════════════════ */}
      <div style={{ padding: '0 36px' }}>
        {/* Column headers */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 52px 100px 100px',
          gap: 8, padding: '14px 0 8px',
          borderBottom: `2px solid ${ink}`,
        }}>
          {['Description', 'Qty', 'Unit Price', 'Amount'].map((h, i) => (
            <div key={h} style={{
              fontFamily: mono, fontSize: 8, letterSpacing: '0.12em',
              textTransform: 'uppercase' as const, color: ink, fontWeight: 700,
              textAlign: i === 0 ? 'left' : 'right',
            }}>{h}</div>
          ))}
        </div>

        {items.map((item, idx) => (
          <div key={item.id} style={{
            display: 'grid', gridTemplateColumns: '1fr 52px 100px 100px',
            gap: 8, padding: '10px 0',
            borderBottom: `1px solid ${rule}`,
            background: idx % 2 !== 0 ? bgGray : white,
            margin: idx % 2 !== 0 ? '0 -36px' : 0,
            paddingLeft: idx % 2 !== 0 ? 36 : 0,
            paddingRight: idx % 2 !== 0 ? 36 : 0,
          }}>
            <div>
              <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 500, color: ink }}>{item.name}</div>
              {item.description && (
                <div style={{ fontFamily: sans, fontSize: 10, color: muted, fontStyle: 'italic', marginTop: 2 }}>{item.description}</div>
              )}
            </div>
            <div style={{ fontFamily: mono, fontSize: 11, color: muted, textAlign: 'center', paddingTop: 2 }}>{item.quantity}</div>
            <div style={{ fontFamily: mono, fontSize: 11, color: sub, textAlign: 'right', paddingTop: 2 }}>{formatCurrency(item.unitPrice)}</div>
            <div style={{ fontFamily: mono, fontSize: 11, color: ink, fontWeight: 700, textAlign: 'right', paddingTop: 2 }}>{formatCurrency(item.amount)}</div>
          </div>
        ))}
      </div>

      {/* ══ TOTALS + PAYMENT + FOOTER — single block, never split across pages ══ */}
      <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>

        {/* Totals — right-aligned */}
        <div style={{ padding: '16px 36px 20px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 260 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${rule}` }}>
              <span style={{ fontSize: 12, color: muted }}>Subtotal</span>
              <span style={{ fontFamily: mono, fontSize: 12, color: ink }}>{formatCurrency(invoice.subtotal)}</span>
            </div>

            {(invoice.discountAmount ?? 0) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${rule}` }}>
                <span style={{ fontSize: 12, color: muted }}>
                  Discount{invoice.discountType === 'PERCENT' ? ` (${invoice.discountValue}%)` : ''}
                </span>
                <span style={{ fontFamily: mono, fontSize: 12, color: '#B91C1C' }}>
                  − {formatCurrency(invoice.discountAmount)}
                </span>
              </div>
            )}

            {invoice.vatEnabled && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${rule}` }}>
                <span style={{ fontSize: 12, color: muted }}>VAT ({((invoice.vatRate ?? 0.15) * 100).toFixed(0)}%)</span>
                <span style={{ fontFamily: mono, fontSize: 12, color: ink }}>{formatCurrency(invoice.vatAmount)}</span>
              </div>
            )}

            {/* Total due — dark band, lime text */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', marginTop: 10,
              background: dark, borderRadius: 5,
            }}>
              <span style={{ fontFamily: syne, fontWeight: 700, fontSize: 13, color: lime, letterSpacing: 0.3 }}>
                TOTAL DUE
              </span>
              <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 19, color: lime }}>
                {formatCurrency(invoice.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment details + terms — NO overflow:hidden (breaks page rendering) */}
        <div style={{
          margin: '0 36px 20px',
          border: `1px solid ${rule}`,
          borderRadius: 5,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          background: bgGray,
        }}>
          <div style={{ padding: '16px 20px', borderRight: `1px solid ${rule}` }}>
            {label('Payment Details')}
            {[
              ['Bank',         invoice.paymentDetails?.bank],
              ['Account Name', invoice.paymentDetails?.accountName],
              ['Account No.',  invoice.paymentDetails?.accountNumber],
              ['Account Type', invoice.paymentDetails?.accountType],
              ['Branch Code',  invoice.paymentDetails?.branchCode],
              ['Reference',    invoice.paymentDetails?.reference || invoice.invoiceNumber],
              ['Due Date',     formatDate(invoice.dueDate)],
            ].filter(([, v]) => v).map(([l, v]) => (
              <div key={l as string} style={{ display: 'flex', gap: 8, fontSize: 11, marginBottom: 3 }}>
                <span style={{ fontWeight: 600, color: ink, minWidth: 86, flexShrink: 0 }}>{l}</span>
                <span style={{ color: sub }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: '16px 20px' }}>
            {label('Payment Terms')}
            <p style={{ fontSize: 11, color: sub, lineHeight: 1.7, margin: '0 0 8px' }}>
              {invoice.notes || 'Payment in full by the due date. Please use the invoice number as your payment reference.'}
            </p>
            <p style={{ fontSize: 11, color: muted, margin: 0 }}>
              Proof of payment to{' '}
              <span style={{ color: '#1D4ED8' }}>info@mrhdigital.co.za</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: `1px solid ${rule}`,
          padding: '12px 36px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={logoGreen} alt="Mr. H Digital" style={{ height: 18, width: 'auto', opacity: 0.6 }} />
            <span style={{ fontFamily: mono, fontSize: 9, color: muted }}>
              Mr. H Digital &nbsp;·&nbsp; <span style={{ color: '#1D4ED8' }}>mrhdigital.co.za</span>
            </span>
          </div>
          <span style={{ fontFamily: sans, fontSize: 10, color: muted, fontStyle: 'italic' }}>
            Cape Town, South Africa
          </span>
        </div>

      </div>{/* end break-inside block */}

    </div>
  );
}
