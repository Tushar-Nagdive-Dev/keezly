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