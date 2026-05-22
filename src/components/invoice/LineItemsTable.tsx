import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
  const { register, watch, setValue } = useFormContext<InvoiceFormValues>();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const quantity = watch(`lineItems.${index}.quantity`);
  const unitPrice = watch(`lineItems.${index}.unitPrice`);

  const amount = (Number(quantity) || 0) * (Number(unitPrice) || 0);
  // keep amount in sync
  const currentAmount = watch(`lineItems.${index}.amount`);
  if (currentAmount !== amount) {
    setValue(`lineItems.${index}.amount`, amount, { shouldDirty: true });
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-[auto_1fr_80px_100px_100px_auto] gap-2 items-start py-2 border-b border-brand-border last:border-0"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="mt-2 text-brand-muted hover:text-brand-text cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </button>

      <div className="space-y-1">
        <input
          {...register(`lineItems.${index}.name`)}
          placeholder="Item name *"
          className="w-full bg-brand-card2 border border-brand-border rounded-lg px-3 py-1.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-lime transition-colors"
        />
        <input
          {...register(`lineItems.${index}.description`)}
          placeholder="Detail / notes (optional)"
          className="w-full bg-transparent border border-transparent rounded-lg px-3 py-1 text-xs text-brand-muted placeholder:text-brand-muted/50 focus:outline-none focus:border-brand-border transition-colors"
        />
      </div>

      <input
        {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
        type="number"
        min="0"
        step="0.01"
        placeholder="Qty"
        className="bg-brand-card2 border border-brand-border rounded-lg px-3 py-1.5 text-sm text-brand-white text-right placeholder:text-brand-muted focus:outline-none focus:border-lime transition-colors"
      />

      <input
        {...register(`lineItems.${index}.unitPrice`, { valueAsNumber: true })}
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
        className="bg-brand-card2 border border-brand-border rounded-lg px-3 py-1.5 text-sm text-brand-white text-right placeholder:text-brand-muted focus:outline-none focus:border-lime transition-colors"
      />

      <div className="bg-brand-dark/50 border border-brand-border rounded-lg px-3 py-1.5 text-sm font-mono text-right text-brand-white">
        {formatCurrency(amount)}
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        className="mt-1.5 p-1 text-brand-muted hover:text-red-400 transition-colors disabled:opacity-30"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

export function LineItemsTable() {
  const { control } = useFormContext<InvoiceFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'lineItems' });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const from = fields.findIndex((f) => f.id === active.id);
      const to = fields.findIndex((f) => f.id === over.id);
      move(from, to);
    }
  }

  function addRow() {
    append({ id: uuid(), name: '', description: '', quantity: 1, unitPrice: 0, amount: 0 });
  }

  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-[auto_1fr_80px_100px_100px_auto] gap-2 pb-2 border-b border-brand-border mb-1">
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
        onClick={addRow}
        className="mt-3 flex items-center gap-2 text-sm text-lime hover:text-lime-dark transition-colors"
      >
        <Plus size={15} />
        Add line item
      </button>
    </div>
  );
}
