import { User } from '../../domain/entities/user.entity';
import { RegisterRequestDTO } from '../dto/request/register-request.dto';

export interface AuthPort {
  login(email: string, password: string): Promise<{ user: User; token: string }>;
  register(request: RegisterRequestDTO): Promise<{ user: User; token: string }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
