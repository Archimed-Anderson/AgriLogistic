import { User } from '@domain/entities/user.entity';

export interface AuthResponseDTO {
  user: User;
  token: string;
}
