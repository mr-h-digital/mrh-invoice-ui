import { v4 as uuid } from 'uuid';
import type { Client } from '../types/client';
import api from './api';

const USE_API = import.meta.env.VITE_USE_API === 'true';

// ─── localStorage implementation ──────────────────────────────────────────
const STORAGE_KEY = 'mrh_clients';

const DEFAULT_CLIENTS: Client[] = [
  { id: 'client-001', companyName: 'Timeline Vehicle Export Company (Pty) Ltd', contactName: 'Thabo Seabi', email: 'thabo@tveco.co.za', phone: '+27 72 266 3988', address: '7 Blinkblaar St, Zwartkop, Centurion, 0157', createdAt: '2026-01-15T08:00:00.000Z', updatedAt: '2026-01-15T08:00:00.000Z' },
  { id: 'client-002', companyName: 'R.O.C.K. Mission Ministries', contactName: 'Pastor Chernay Hildebrandt', email: 'info@rockmission.co.za', phone: '', address: "Mitchell's Plain, Cape Town", createdAt: '2026-02-01T08:00:00.000Z', updatedAt: '2026-02-01T08:00:00.000Z' },
  { id: 'client-003', companyName: 'K&T Transport', contactName: 'Contact', email: 'info@ktransport.co.za', phone: '', address: 'Cape Town', createdAt: '2026-03-10T08:00:00.000Z', updatedAt: '2026-03-10T08:00:00.000Z' },
];

function lsLoad(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CLIENTS)); return DEFAULT_CLIENTS; }
    return JSON.parse(raw) as Client[];
  } catch { return DEFAULT_CLIENTS; }
}

function lsSave(clients: Client[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

// ─── Service ──────────────────────────────────────────────────────────────
export const clientService = {
  async getClients(): Promise<Client[]> {
    if (!USE_API) return lsLoad();
    const res = await api.get<Client[]>('/clients');
    return res.data;
  },

  async getClient(id: string): Promise<Client> {
    if (!USE_API) {
      const client = lsLoad().find((c) => c.id === id);
      if (!client) throw new Error(`Client ${id} not found`);
      return client;
    }
    const res = await api.get<Client>(`/clients/${id}`);
    return res.data;
  },

  async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    if (!USE_API) {
      const now = new Date().toISOString();
      const client: Client = { ...data, id: uuid(), createdAt: now, updatedAt: now };
      lsSave([...lsLoad(), client]);
      return client;
    }
    const res = await api.post<Client>('/clients', data);
    return res.data;
  },

  async updateClient(id: string, data: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client> {
    if (!USE_API) {
      const clients = lsLoad();
      const idx = clients.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error(`Client ${id} not found`);
      const updated: Client = { ...clients[idx], ...data, updatedAt: new Date().toISOString() };
      clients[idx] = updated;
      lsSave(clients);
      return updated;
    }
    const res = await api.put<Client>(`/clients/${id}`, data);
    return res.data;
  },

  async deleteClient(id: string): Promise<void> {
    if (!USE_API) { lsSave(lsLoad().filter((c) => c.id !== id)); return; }
    // Backend returns 409 if client has invoices — api.ts interceptor surfaces this as a toast
    await api.delete(`/clients/${id}`);
  },
};
