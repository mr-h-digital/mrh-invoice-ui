import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useClients } from '../hooks/useClients';
import { useInvoices } from '../hooks/useInvoices';
import { ClientCard } from '../components/clients/ClientCard';
import { ClientForm } from '../components/clients/ClientForm';
import { Modal } from '../components/shared/Modal';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { EmptyState } from '../components/shared/EmptyState';
import { TopBar } from '../components/layout/TopBar';
import type { Client } from '../types/client';
import type { ClientFormValues } from '../schemas/clientSchema';

export function ClientsPage() {
  const { clients, loading, addClient, updateClient, deleteClient } = useClients();
  const { invoices } = useInvoices();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Client | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleAddClient(data: ClientFormValues) {
    await addClient(data);
    toast.success('Client added');
    setModalOpen(false);
  }

  async function handleEditClient(data: ClientFormValues) {
    if (!editTarget) return;
    await updateClient(editTarget.id, data);
    toast.success('Client updated');
    setEditTarget(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteClient(deleteTarget.id);
      toast.success('Client deleted');
    } catch {
      toast.error('Failed to delete client');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  const deleteHasInvoices =
    deleteTarget && invoices.some((i) => i.clientId === deleteTarget.id);

  return (
    <div className="flex-1">
      <TopBar
        title="Clients"
        subtitle={`${clients.length} saved`}
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-lime text-brand-dark text-sm font-medium rounded-lg hover:bg-lime-dark transition-colors"
          >
            <Plus size={16} />
            Add Client
          </button>
        }
      />

      <div className="p-8">
        {loading ? (
          <div className="text-center py-16 text-brand-muted">Loading…</div>
        ) : clients.length === 0 ? (
          <EmptyState
            icon={<Users size={28} />}
            title="No clients yet"
            description="Save client details to quickly populate invoices."
            action={
              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 bg-lime text-brand-dark text-sm font-medium rounded-lg hover:bg-lime-dark transition-colors"
              >
                Add Client
              </button>
            }
          />
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((client, i) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <ClientCard
                    client={client}
                    invoices={invoices}
                    onEdit={setEditTarget}
                    onDelete={setDeleteTarget}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Add client modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Client" size="lg">
        <ClientForm
          onSubmit={handleAddClient}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Edit client modal */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Client"
        size="lg"
      >
        {editTarget && (
          <ClientForm
            defaultValues={editTarget}
            onSubmit={handleEditClient}
            onCancel={() => setEditTarget(null)}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Client"
        description={
          deleteHasInvoices
            ? `${deleteTarget?.companyName} has existing invoices. Deleting won't remove those invoices. Continue?`
            : `Delete ${deleteTarget?.companyName}? This cannot be undone.`
        }
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
