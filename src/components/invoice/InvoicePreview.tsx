import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import type { Invoice } from '../../types/invoice';

interface InvoicePreviewProps {
  invoice: Partial<Invoice> & {
    invoiceNumber?: string;
    clientSnapshot?: Invoice['clientSnapshot'];
    lineItems?: Invoice['lineItems'];
  };
  darkPrint?: boolean;
}

const STATUS_LABEL: Record<string, string> = {
  draft: 'DRAFT',
  sent: 'SENT',
  paid: 'PAID',
  overdue: 'OVERDUE',
};

const STATUS_COLOR: Record<string, string> = {
  draft: '#5A6478',
  sent: '#60A5FA',
  paid: '#AADB1E',
  overdue: '#EF4444',
};

export function InvoicePreview({ invoice, darkPrint = false }: InvoicePreviewProps) {
  const snap = invoice.clientSnapshot;
  const items = invoice.lineItems ?? [];
  const subtotal = invoice.subtotal ?? items.reduce((s, i) => s + (i.amount ?? 0), 0);

  return (
    <div
      className={`invoice-preview rounded-xl overflow-hidden text-sm ${
        darkPrint ? 'dark-print' : ''
      }`}
      style={{
        background: '#1E2128',
        color: '#B8C4D4',
        fontFamily: "'DM Sans', sans-serif",
        minWidth: 0,
      }}
    >
      {/* Header */}
      <div style={{ background: '#16181D', padding: '32px 32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: '#AADB1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  color: '#0F1013',
                  fontSize: 14,
                }}
              >
                MH
              </span>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  color: '#E8EDF5',
                  fontSize: 16,
                  margin: 0,
                }}
              >
                Mr. H Digital
              </p>
              <p style={{ color: '#5A6478', fontSize: 11, margin: 0 }}>
                Custom websites & digital products
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 20,
                fontWeight: 700,
                color: '#E8EDF5',
                margin: 0,
              }}
            >
              {invoice.invoiceNumber || 'INV-XXXX-XXX'}
            </p>
            {invoice.status && (
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 10px',
                  borderRadius: 999,
                  fontSize: 10,
                  fontFamily: "'Space Mono', monospace",
                  background: STATUS_COLOR[invoice.status] + '22',
                  color: STATUS_COLOR[invoice.status],
                  border: `1px solid ${STATUS_COLOR[invoice.status]}44`,
                  marginTop: 4,
                }}
              >
                {STATUS_LABEL[invoice.status]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Billed from / to + dates */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 24,
          padding: '24px 32px',
          borderBottom: '1px solid #2E333D',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              letterSpacing: '0.1em',
              color: '#5A6478',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            From
          </p>
          <p style={{ color: '#AADB1E', fontWeight: 600, margin: '0 0 2px' }}>Mr. H Digital</p>
          <p style={{ color: '#B8C4D4', margin: '0 0 2px', fontSize: 12 }}>Lee Hildebrandt</p>
          <p style={{ color: '#5A6478', margin: '0 0 2px', fontSize: 11 }}>info@mrhdigital.co.za</p>
          <p style={{ color: '#5A6478', margin: '0 0 2px', fontSize: 11 }}>+27 76 687 1671</p>
          <p style={{ color: '#5A6478', margin: 0, fontSize: 11 }}>Cape Town, South Africa</p>
        </div>

        <div>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              letterSpacing: '0.1em',
              color: '#5A6478',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Billed To
          </p>
          {snap ? (
            <>
              <p style={{ color: '#E8EDF5', fontWeight: 600, margin: '0 0 2px' }}>
                {snap.companyName || '—'}
              </p>
              {snap.contactName && (
                <p style={{ color: '#B8C4D4', margin: '0 0 2px', fontSize: 12 }}>{snap.contactName}</p>
              )}
              {snap.email && (
                <p style={{ color: '#5A6478', margin: '0 0 2px', fontSize: 11 }}>{snap.email}</p>
              )}
              {snap.phone && (
                <p style={{ color: '#5A6478', margin: '0 0 2px', fontSize: 11 }}>{snap.phone}</p>
              )}
              {snap.address && (
                <p style={{ color: '#5A6478', margin: 0, fontSize: 11, whiteSpace: 'pre-line' }}>
                  {snap.address}
                </p>
              )}
            </>
          ) : (
            <p style={{ color: '#5A6478', fontStyle: 'italic' }}>No client selected</p>
          )}
        </div>

        <div>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              letterSpacing: '0.1em',
              color: '#5A6478',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Dates
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div>
              <p style={{ color: '#5A6478', fontSize: 10, margin: '0 0 1px' }}>Invoice Date</p>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  color: '#B8C4D4',
                  fontSize: 11,
                  margin: 0,
                }}
              >
                {invoice.issueDate ? formatDate(invoice.issueDate) : '—'}
              </p>
            </div>
            <div>
              <p style={{ color: '#5A6478', fontSize: 10, margin: '0 0 1px' }}>Due Date</p>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  color: '#B8C4D4',
                  fontSize: 11,
                  margin: 0,
                }}
              >
                {invoice.dueDate ? formatDate(invoice.dueDate) : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Line items */}
      <div style={{ padding: '24px 32px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr
              style={{
                borderBottom: '1px solid #2E333D',
              }}
            >
              {['Description', 'Qty', 'Unit Price', 'Amount'].map((h, i) => (
                <th
                  key={h}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 9,
                    letterSpacing: '0.08em',
                    color: '#5A6478',
                    textTransform: 'uppercase',
                    fontWeight: 400,
                    textAlign: i === 0 ? 'left' : 'right',
                    paddingBottom: 8,
                    paddingLeft: i === 0 ? 0 : 8,
                    paddingRight: i === 3 ? 0 : 8,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: 'center', color: '#5A6478', padding: '24px 0', fontStyle: 'italic' }}
                >
                  No line items yet
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.025)',
                  }}
                >
                  <td style={{ padding: '10px 8px 10px 0' }}>
                    <p style={{ color: '#E8EDF5', margin: '0 0 2px', fontWeight: 500 }}>
                      {item.name}
                    </p>
                    {item.description && (
                      <p style={{ color: '#5A6478', fontSize: 11, margin: 0 }}>{item.description}</p>
                    )}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      fontFamily: "'Space Mono', monospace",
                      color: '#B8C4D4',
                      padding: '10px 8px',
                      fontSize: 12,
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      fontFamily: "'Space Mono', monospace",
                      color: '#B8C4D4',
                      padding: '10px 8px',
                      fontSize: 12,
                    }}
                  >
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      fontFamily: "'Space Mono', monospace",
                      color: '#E8EDF5',
                      padding: '10px 0 10px 8px',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div
        style={{
          padding: '0 32px 24px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <div style={{ minWidth: 240 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: '1px solid #2E333D',
            }}
          >
            <span style={{ color: '#5A6478', fontSize: 12 }}>Subtotal</span>
            <span
              style={{ fontFamily: "'Space Mono', monospace", color: '#B8C4D4', fontSize: 12 }}
            >
              {formatCurrency(subtotal)}
            </span>
          </div>

          {(invoice.discountAmount ?? 0) > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: '1px solid #2E333D',
              }}
            >
              <span style={{ color: '#5A6478', fontSize: 12 }}>
                Discount
                {invoice.discountType === 'percent' ? ` (${invoice.discountValue}%)` : ''}
              </span>
              <span
                style={{ fontFamily: "'Space Mono', monospace", color: '#EF4444', fontSize: 12 }}
              >
                -{formatCurrency(invoice.discountAmount ?? 0)}
              </span>
            </div>
          )}

          {invoice.vatEnabled && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: '1px solid #2E333D',
              }}
            >
              <span style={{ color: '#5A6478', fontSize: 12 }}>
                VAT ({((invoice.vatRate ?? 0.15) * 100).toFixed(0)}%)
              </span>
              <span
                style={{ fontFamily: "'Space Mono', monospace", color: '#B8C4D4', fontSize: 12 }}
              >
                {formatCurrency(invoice.vatAmount ?? 0)}
              </span>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(170,219,30,0.1)',
              border: '1px solid rgba(170,219,30,0.25)',
              borderRadius: 8,
              marginTop: 8,
            }}
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                letterSpacing: '0.08em',
                color: '#AADB1E',
                textTransform: 'uppercase',
              }}
            >
              Total Due
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 18,
                fontWeight: 700,
                color: '#AADB1E',
              }}
            >
              {formatCurrency(invoice.total ?? 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment details */}
      {invoice.paymentDetails && (
        <div
          style={{
            margin: '0 32px 24px',
            padding: '16px',
            background: '#16181D',
            borderRadius: 8,
            border: '1px solid #2E333D',
          }}
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              letterSpacing: '0.1em',
              color: '#5A6478',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Payment Details
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
            {[
              ['Bank', invoice.paymentDetails.bank],
              ['Account Name', invoice.paymentDetails.accountName],
              ['Account Number', invoice.paymentDetails.accountNumber],
              ['Account Type', invoice.paymentDetails.accountType],
              ['Branch Code', invoice.paymentDetails.branchCode],
              ['Reference', invoice.paymentDetails.reference || invoice.invoiceNumber || ''],
            ].map(([label, value]) =>
              value ? (
                <div key={label}>
                  <span style={{ color: '#5A6478', fontSize: 10 }}>{label}: </span>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      color: '#B8C4D4',
                      fontSize: 11,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div style={{ margin: '0 32px 24px' }}>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              letterSpacing: '0.1em',
              color: '#5A6478',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            Notes
          </p>
          <p style={{ color: '#5A6478', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
            {invoice.notes}
          </p>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          borderTop: '1px solid #2E333D',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p style={{ color: '#5A6478', fontSize: 10, margin: 0 }}>
          mrhdigital.co.za • info@mrhdigital.co.za
        </p>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            color: '#2E333D',
            fontSize: 10,
            margin: 0,
          }}
        >
          {invoice.invoiceNumber}
        </p>
      </div>
    </div>
  );
}
