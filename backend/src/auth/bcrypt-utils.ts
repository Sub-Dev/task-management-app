// src/auth/bcrypt-utils.ts

import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(providedPassword: string, storedPasswordHash: string): Promise<boolean> {
  return bcrypt.compare(providedPassword, storedPasswordHash);
}
