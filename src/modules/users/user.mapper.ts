import type { PersistedUserRecord, UserRecord } from './user.types';

export const toUserProfile = (user: PersistedUserRecord): UserRecord => {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
  };
};
