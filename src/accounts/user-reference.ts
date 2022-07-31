import User from './user';
import { users } from './data';

export async function resolveUserReference(reference: Pick<User, "id">): Promise<User> {
  return users.find(u => u.id === reference.id)!;
}
