import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider, type SubmitHandler, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { invoiceFormSchema, type InvoiceFormValues } from '../schemas/invoiceSchema';
import { InvoiceForm } from '../components/invoice/InvoiceForm';
import invoicesBg from '../assets/invoices-bg.jpg';
import { InvoicePreview } from '../components/invoice/InvoicePreview';
import { TopBar } from '../components/layout/TopBar';
import { useInvoices } from '../hooks/useInvoices';
import { useInvoiceStore } from '../store/invoiceStore';
import { generateInvoiceNumber } from '../utils/generateInvoiceNumber';
import { calculateTotals } from '../utils/invoiceTotals';
import { todayISO, addDaysISO } from '../utils/formatDate';
import { v4 as uuid } from 'uuid';

export function NewInvoicePage() {
  const navigate = useNavigate();
  const { addInvoice } = useInvoices();
  const invoices = useInvoiceStore((s) => s.invoices);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  const today = todayISO();
  const invoiceNumber = generateInvoiceNumber(invoices);

  const methods = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema) as Resolver<InvoiceFormValues>,
    defaultValues: {
      invoiceNumber,
      status: 'draft',
      issueDate: today,
      dueDate: addDaysISO(today, 30),
      clientId: null,
      clientSnapshot: { companyName: '', contactName: '', email: '', phone: '', address: '' },
      lineItems: [{ id: uuid(), name: '', description: '', quantity: 1, unitPrice: 0, amount: 0 }],
      discountType: null,
      discountValue: 0,
      vatEnabled: false,
      vatRate: 0.15,
      notes: 'Payment due within 30 days. Please use your invoice number as payment reference.',
      paymentDetails: {
        bank: 'Capitec Bank',
        accountName: 'Mr H Digital',
        accountNumber: '2496091865',
        accountType: 'Entrepreneur',
        branchCode: '470010',
        reference: invoiceNumber,
      },
    },
  });

  const formValues = methods.watch();
  const totals = calculateTotals({
    lineItems: formValues.lineItems ?? [],
    discountType: formValues.discountType,
    discountValue: formValues.discountValue ?? 0,
    vatEnabled: formValues.vatEnabled,
    vatRate: formValues.vatRate ?? 0.15,
  });

  const previewInvoice = { ...formValues, ...totals };

  const onSubmit: SubmitHandler<InvoiceFormValues> = async (data) => {
    const computed = calculateTotals({
      lineItems: data.lineItems,
      discountType: data.discountType,
      discountValue: data.discountValue,
      vatEnabled: data.vatEnabled,
      vatRate: data.vatRate,
    });
    try {
      const invoice = await addInvoice({ ...data, ...computed } as never);
      toast.success(`Invoice ${data.invoiceNumber} created`);
      navigate(`/invoices/${invoice.id}`);
    } catch {
      toast.error('Failed to create invoice');
    }
  };

  return (
    <FormProvider {...methods}>
      <div
        className="flex-1 flex flex-col relative"
        style={{ backgroundImage: `url(${invoicesBg})`, backgroundSize: 'cover', backgroundPosition: 'center 35%' }}
      >
        <div className="absolute inset-0 bg-brand-dark/88 pointer-events-none" />
        <div className="relative z-10 flex flex-col flex-1 min-h-0">
        <TopBar
          title="New Invoice"
          subtitle={methods.watch('invoiceNumber')}
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
                Save Invoice
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
            <InvoicePreview invoice={previewInvoice as never} />
          </div>
        </div>
        </div>
      </div>
    </FormProvider>
  );
}
