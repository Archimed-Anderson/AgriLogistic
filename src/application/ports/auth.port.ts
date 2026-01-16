import { User } from '../../domain/entities/user.entity';

export interface AuthPort {
  login(email: string, password: string): Promise<{ user: User; token: string }>;
  register(firstName: string, lastName: string, email: string, password: string): Promise<{ user: User; token: string }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
