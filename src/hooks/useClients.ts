import { useEffect } from 'react';
import { useClientStore } from '../store/clientStore';
import type { Client } from '../types/client';

export function useClients() {
  const { clients, loading, error, fetchClients, addClient, updateClient, deleteClient } =
    useClientStore();

  useEffect(() => {
    if (clients.length === 0 && !loading) {
      fetchClients();
    }
  }, []);

  return { clients, loading, error, addClient, updateClient, deleteClient, refetch: fetchClients };
}

export function useClient(id: string | undefined): Client | undefined {
  const clients = useClientStore((s) => s.clients);
  return clients.find((c) => c.id === id);
}
