// src/app/models/keezly-item.ts

export interface KeezlyItem {
  id: number | null; // Null when creating a new item
  title: string;     // The service name (Required by API service definition)
  username: string;
  password?: string; // Decrypted password (used for display, not stored directly)
  url?: string;
  notes?: string;
  
  // Custom properties used by your Python backend:
  password_encrypted?: string; // The field received/sent to Python for storage
  category?: string;
  last_modified?: string;
}   