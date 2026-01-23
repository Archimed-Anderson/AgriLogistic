import { User } from '../../domain/entities/user.entity';
import { RegisterRequestDTO } from '../dto/request/register-request.dto';
import { RegisterResponseDTO } from '../dto/response/register-response.dto';

export interface AuthPort {
  login(email: string, password: string): Promise<{ user: User; token: string }>;
  register(request: RegisterRequestDTO): Promise<RegisterResponseDTO>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
