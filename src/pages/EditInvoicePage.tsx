import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider, type SubmitHandler, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { invoiceFormSchema, type InvoiceFormValues } from '../schemas/invoiceSchema';
import { InvoiceForm } from '../components/invoice/InvoiceForm';
import invoicesBg from '../assets/invoices-bg.jpg';
import { InvoicePreview } from '../components/invoice/InvoicePreview';
import { TopBar } from '../components/layout/TopBar';
import { useInvoices, useInvoice } from '../hooks/useInvoices';
import { calculateTotals } from '../utils/invoiceTotals';

export function EditInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateInvoice, loading } = useInvoices();
  const invoice = useInvoice(id);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  const methods = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema) as Resolver<InvoiceFormValues>,
  });

  useEffect(() => {
    if (invoice) {
      methods.reset({
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        clientId: invoice.clientId,
        clientSnapshot: invoice.clientSnapshot,
        lineItems: invoice.lineItems,
        discountType: invoice.discountType,
        discountValue: invoice.discountValue,
        vatEnabled: invoice.vatEnabled,
        vatRate: invoice.vatRate,
        notes: invoice.notes,
        paymentDetails: invoice.paymentDetails,
      });
    }
  }, [invoice, methods]);

  const formValues = methods.watch();
  const totals = calculateTotals({
    lineItems: formValues.lineItems ?? [],
    discountType: formValues.discountType,
    discountValue: formValues.discountValue ?? 0,
    vatEnabled: formValues.vatEnabled,
    vatRate: formValues.vatRate ?? 0.15,
  });

  const onSubmit: SubmitHandler<InvoiceFormValues> = async (data) => {
    if (!id) return;
    const computed = calculateTotals({
      lineItems: data.lineItems,
      discountType: data.discountType,
      discountValue: data.discountValue,
      vatEnabled: data.vatEnabled,
      vatRate: data.vatRate,
    });
    try {
      await updateInvoice(id, { ...data, ...computed } as never);
      toast.success('Invoice updated');
      navigate(`/invoices/${id}`);
    } catch {
      toast.error('Failed to update invoice');
    }
  };

  if (!invoice && !loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-brand-muted">
        Invoice not found.
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div
        className="flex-1 flex flex-col relative"
        style={{ backgroundImage: `url(${invoicesBg})`, backgroundSize: 'cover', backgroundPosition: 'center 35%' }}
      >
        <div className="absolute inset-0 bg-brand-dark/88 pointer-events-none" />
        <div className="relative z-10 flex flex-col flex-1 min-h-0">
        <TopBar
          title="Edit Invoice"
          subtitle={invoice?.invoiceNumber}
          actions={
            <div className="flex items-center gap-3">
              <div className="flex lg:hidden bg-brand-card border border-brand-border rounded-lg p-1 gap-1">
                {(['form', 'preview'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-md text-xs capitalize transition-colors ${
                      activeTab === tab
                        ? 'bg-lime text-brand-dark font-medium'
                        : 'text-brand-muted'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button
                onClick={methods.handleSubmit(onSubmit)}
                className="flex items-center gap-2 px-4 py-2 bg-lime text-brand-dark text-sm font-medium rounded-lg hover:bg-lime-dark transition-colors"
              >
                <Save size={15} />
                Save Changes
              </button>
            </div>
          }
        />

        <div className="flex-1 flex min-h-0">
          <div
            className={`flex-1 overflow-y-auto p-6 lg:max-w-xl xl:max-w-2xl ${
              activeTab === 'preview' ? 'hidden lg:block' : ''
            }`}
          >
            <InvoiceForm />
          </div>

          <div
            className={`flex-1 bg-brand-dark/60 border-l border-brand-border overflow-y-auto p-6 ${
              activeTab === 'form' ? 'hidden lg:block' : ''
            }`}
          >
            <p className="text-xs font-mono text-brand-muted uppercase tracking-wider mb-3">
              Live Preview
            </p>
            <InvoicePreview invoice={{ ...formValues, ...totals } as never} />
          </div>
        </div>
        </div>
      </div>
    </FormProvider>
  );
}
