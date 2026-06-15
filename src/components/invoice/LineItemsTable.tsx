import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuid } from 'uuid';
import type { InvoiceFormValues } from '../../schemas/invoiceSchema';
import { formatCurrency } from '../../utils/formatCurrency';

interface SortableRowProps {
  id: string;
  index: number;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

function SortableRow({ id, index, onRemove, canRemove }: SortableRowProps) {
  const { register, setValue, control } = useFormContext<InvoiceFormValues>();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const quantity  = useWatch({ control, name: `lineItems.${index}.quantity` });
  const unitPrice = useWatch({ control, name: `lineItems.${index}.unitPrice` });
  const amount    = (Number(quantity) || 0) * (Number(unitPrice) || 0);

  // Sync computed amount and sortOrder — inside useEffect so it never fires during render
  useEffect(() => {
    setValue(`lineItems.${index}.amount`, amount, { shouldDirty: true });
  }, [amount, index, setValue]);

  useEffect(() => {
    setValue(`lineItems.${index}.sortOrder`, index, { shouldDirty: true });
  }, [index, setValue]);

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="py-3 border-b border-brand-border last:border-0"
    >
      {/* Desktop row */}
      <div className="hidden sm:grid grid-cols-[auto_1fr_72px_100px_100px_auto] gap-2 items-start">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="mt-2 p-1 text-brand-muted hover:text-brand-text cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical size={16} />
        </button>

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
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors self-start py-1"
          >
            <Trash2 size={13} /> Remove item
          </button>
        )}
      </div>
    </div>
  );
}

export function LineItemsTable() {
  const { control } = useFormContext<InvoiceFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'lineItems' });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      move(
        fields.findIndex((f) => f.id === active.id),
        fields.findIndex((f) => f.id === over.id)
      );
    }
  }

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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          {fields.map((field, index) => (
            <SortableRow
              key={field.id}
              id={field.id}
              index={index}
              onRemove={remove}
              canRemove={fields.length > 1}
            />
          ))}
        </SortableContext>
      </DndContext>

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
