import { v4 as uuid } from 'uuid';
import type { Client } from '../types/client';

const STORAGE_KEY = 'mrh_clients';

const DEFAULT_CLIENTS: Client[] = [
  {
    id: 'client-001',
    companyName: 'Timeline Vehicle Export Company (Pty) Ltd',
    contactName: 'Thabo Seabi',
    email: 'thabo@tveco.co.za',
    phone: '+27 72 266 3988',
    address: '7 Blinkblaar St, Zwartkop, Centurion, 0157',
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'client-002',
    companyName: 'R.O.C.K. Mission Ministries',
    contactName: 'Pastor Chernay Hildebrandt',
    email: 'info@rockmission.co.za',
    phone: '',
    address: "Mitchell's Plain, Cape Town",
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-02-01T08:00:00.000Z',
  },
  {
    id: 'client-003',
    companyName: 'K&T Transport',
    contactName: '',
    email: '',
    phone: '',
    address: 'Cape Town',
    createdAt: '2026-03-10T08:00:00.000Z',
    updatedAt: '2026-03-10T08:00:00.000Z',
  },
];

function load(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CLIENTS));
      return DEFAULT_CLIENTS;
    }
    return JSON.parse(raw) as Client[];
  } catch {
    return DEFAULT_CLIENTS;
  }
}

function save(clients: Client[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export const clientService = {
  async getClients(): Promise<Client[]> {
    return load();
  },

  async getClient(id: string): Promise<Client> {
    const clients = load();
    const client = clients.find((c) => c.id === id);
    if (!client) throw new Error(`Client ${id} not found`);
    return client;
  },

  async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const clients = load();
    const now = new Date().toISOString();
    const client: Client = { ...data, id: uuid(), createdAt: now, updatedAt: now };
    save([...clients, client]);
    return client;
  },

  async updateClient(id: string, data: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client> {
    const clients = load();
    const idx = clients.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`Client ${id} not found`);
    const updated: Client = { ...clients[idx], ...data, updatedAt: new Date().toISOString() };
    clients[idx] = updated;
    save(clients);
    return updated;
  },

  async deleteClient(id: string): Promise<void> {
    const clients = load();
    save(clients.filter((c) => c.id !== id));
  },
};
