// src/app/features/vault/models/vault-item.model.ts
export interface VaultItem {
  id: number | null;
  title: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}