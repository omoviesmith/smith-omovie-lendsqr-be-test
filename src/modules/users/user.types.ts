export interface UserRecord {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface PersistedUserRecord {
  id: number | string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password_hash: string;
  identity_hash: string;
  encrypted_identity: string;
  created_at: Date | string;
  updated_at: Date | string;
}
