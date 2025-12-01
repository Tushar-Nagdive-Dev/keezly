import { VaultItem } from "../components/vault/models/vault-item.model";

export interface Item {
  id?: number; 
  title?: string; // Add the missing property to resolve the conflict
  service: string; 
  username: string; 
  password_encrypted: string; 
  category: string; 
  notes: string;
  last_modified: string;
}

export interface SaveResponse {
  success: boolean;
  item?: VaultItem;
  message?: string;
}

export interface SimpleResponse {
  success: boolean;
  message?: string;
}

export interface PasswordResponse {
  success: boolean;
  password?: string;
  message?: string;
}

export interface Toast {
  id?: number;
  message: string;
  type: 'success' | 'error' | 'info';
  timeout?: number; // in milliseconds
}