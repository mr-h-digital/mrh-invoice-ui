import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientFormSchema, type ClientFormValues } from '../../schemas/clientSchema';

interface ClientFormProps {
  defaultValues?: Partial<ClientFormValues>;
  onSubmit: (data: ClientFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function ClientForm({ defaultValues, onSubmit, onCancel, submitLabel = 'Save Client' }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      ...defaultValues,
    },
  });

  const submit = handleSubmit(onSubmit);

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-mono text-brand-muted uppercase tracking-wider mb-1.5">
          Company Name *
        </label>
        <input
          {...register('companyName')}
          className="input-field"
          placeholder="Acme Corp (Pty) Ltd"
        />
        {errors.companyName && (
          <p className="text-red-400 text-xs mt-1">{errors.companyName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-mono text-brand-muted uppercase tracking-wider mb-1.5">
          Contact Name
        </label>
        <input {...register('contactName')} className="input-field" placeholder="Jane Smith" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-mono text-brand-muted uppercase tracking-wider mb-1.5">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="input-field"
            placeholder="jane@acme.co.za"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-mono text-brand-muted uppercase tracking-wider mb-1.5">
            Phone
          </label>
          <input {...register('phone')} className="input-field" placeholder="+27 71 000 0000" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-brand-muted uppercase tracking-wider mb-1.5">
          Address
        </label>
        <textarea
          {...register('address')}
          rows={3}
          className="input-field resize-none"
          placeholder="123 Main Rd, Suburb, City, 0001"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg border border-brand-border text-brand-text text-sm hover:bg-brand-card2 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 rounded-lg bg-lime text-brand-dark text-sm font-medium hover:bg-lime-dark transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
