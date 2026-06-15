import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import type { InvoiceFormValues } from '../../schemas/invoiceSchema';
import { formatCurrency } from '../../utils/formatCurrency';

interface RowProps {
  index: number;
  onRemove: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  canRemove: boolean;
  isFirst: boolean;
  isLast: boolean;
}

function Row({ index, onRemove, onMoveUp, onMoveDown, canRemove, isFirst, isLast }: RowProps) {
  const { register, setValue, control } = useFormContext<InvoiceFormValues>();

  const quantity  = useWatch({ control, name: `lineItems.${index}.quantity` });
  const unitPrice = useWatch({ control, name: `lineItems.${index}.unitPrice` });
  const amount    = (Number(quantity) || 0) * (Number(unitPrice) || 0);

  useEffect(() => {
    setValue(`lineItems.${index}.amount`, amount, { shouldDirty: true });
  }, [amount, index, setValue]);

  useEffect(() => {
    setValue(`lineItems.${index}.sortOrder`, index, { shouldDirty: true });
  }, [index, setValue]);

  return (
    <div className="py-3 border-b border-brand-border last:border-0">
      {/* Desktop row */}
      <div className="hidden sm:grid grid-cols-[auto_1fr_72px_100px_100px_auto] gap-2 items-start">
        {/* Reorder buttons */}
        <div className="flex flex-col gap-0.5 mt-1.5">
          <button
            type="button"
            onClick={() => onMoveUp(index)}
            disabled={isFirst}
            aria-label="Move up"
            className="p-0.5 text-brand-muted hover:text-brand-text transition-colors disabled:opacity-20"
          >
            <ChevronUp size={14} />
          </button>
          <button
            type="button"
            onClick={() => onMoveDown(index)}
            disabled={isLast}
            aria-label="Move down"
            className="p-0.5 text-brand-muted hover:text-brand-text transition-colors disabled:opacity-20"
          >
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="space-y-1">
          <input
            {...register(`lineItems.${index}.name`)}
            placeholder="Item name *"
            className="input-field text-sm py-2"
          />
          <input
            {...register(`lineItems.${index}.description`)}
            placeholder="Detail / notes (optional)"
            className="w-full bg-transparent border border-transparent rounded-lg px-3 py-1 text-xs text-brand-muted placeholder:text-brand-muted/50 focus:outline-none focus:border-brand-border transition-colors"
          />
        </div>

        <input
          {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
          type="number" min="0" step="0.01" placeholder="1"
          className="input-field text-sm text-right py-2"
        />
        <input
          {...register(`lineItems.${index}.unitPrice`, { valueAsNumber: true })}
          type="number" min="0" step="0.01" placeholder="0.00"
          className="input-field text-sm text-right py-2"
        />
        <div className="bg-brand-dark/50 border border-brand-border rounded-lg px-3 py-2 text-sm font-mono text-right text-brand-white">
          {formatCurrency(amount)}
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
          aria-label="Remove item"
          className="mt-1 p-2 text-brand-muted hover:text-red-400 transition-colors disabled:opacity-30"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Mobile stacked row */}
      <div className="flex flex-col gap-2 sm:hidden">
        <input
          {...register(`lineItems.${index}.name`)}
          placeholder="Item name *"
          className="input-field text-sm"
        />
        <input
          {...register(`lineItems.${index}.description`)}
          placeholder="Detail / notes (optional)"
          className="input-field text-xs text-brand-muted"
        />
        <div className="grid grid-cols-3 gap-2 items-center">
          <div>
            <label className="field-label text-[10px]">Qty</label>
            <input
              {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
              type="number" min="0" step="0.01"
              className="input-field text-sm text-right"
            />
          </div>
          <div>
            <label className="field-label text-[10px]">Unit Price</label>
            <input
              {...register(`lineItems.${index}.unitPrice`, { valueAsNumber: true })}
              type="number" min="0" step="0.01"
              className="input-field text-sm text-right"
            />
          </div>
          <div>
            <label className="field-label text-[10px]">Amount</label>
            <div className="bg-brand-dark/50 border border-brand-border rounded-lg px-3 py-2.5 text-sm font-mono text-right text-brand-white">
              {formatCurrency(amount)}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onMoveUp(index)}
              disabled={isFirst}
              className="p-1.5 text-brand-muted hover:text-brand-text transition-colors disabled:opacity-20"
            >
              <ChevronUp size={14} />
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(index)}
              disabled={isLast}
              className="p-1.5 text-brand-muted hover:text-brand-text transition-colors disabled:opacity-20"
            >
              <ChevronDown size={14} />
            </button>
          </div>
          {canRemove && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors py-1"
            >
              <Trash2 size={13} /> Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function LineItemsTable() {
  const { control } = useFormContext<InvoiceFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'lineItems' });

  return (
    <div>
      {/* Desktop column headers */}
      <div className="hidden sm:grid grid-cols-[auto_1fr_72px_100px_100px_auto] gap-2 pb-2 border-b border-brand-border mb-1">
        <div className="w-6" />
        <span className="text-xs font-mono text-brand-muted uppercase tracking-wider">Description</span>
        <span className="text-xs font-mono text-brand-muted uppercase tracking-wider text-right">Qty</span>
        <span className="text-xs font-mono text-brand-muted uppercase tracking-wider text-right">Unit Price</span>
        <span className="text-xs font-mono text-brand-muted uppercase tracking-wider text-right">Amount</span>
        <div className="w-6" />
      </div>

      {fields.map((field, index) => (
        <Row
          key={field.id}
          index={index}
          onRemove={remove}
          onMoveUp={(i) => move(i, i - 1)}
          onMoveDown={(i) => move(i, i + 1)}
          canRemove={fields.length > 1}
          isFirst={index === 0}
          isLast={index === fields.length - 1}
        />
      ))}

      <button
        type="button"
        onClick={() => append({ id: uuid(), name: '', description: '', quantity: 1, unitPrice: 0, amount: 0, sortOrder: fields.length })}
        className="mt-4 flex items-center gap-2 text-sm text-lime hover:text-lime-dark transition-colors py-1"
      >
        <Plus size={15} />
        Add line item
      </button>
    </div>
  );
}
