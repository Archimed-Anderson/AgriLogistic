import { UseCase } from '../use-case.interface';
import { LoginRequestDTO } from '../../dto/request/login-request.dto';
import { AuthResponseDTO } from '../../dto/response/auth-response.dto';
import { AuthPort } from '../../ports/auth.port';

export class LoginUseCase implements UseCase<LoginRequestDTO, AuthResponseDTO> {
  constructor(private readonly authPort: AuthPort) {}

  async execute(request: LoginRequestDTO): Promise<AuthResponseDTO> {
    if (!request.email || !request.password) {
      throw new Error('Email and password are required');
    }

    // Delegate authentication to the infrastructure port
    return this.authPort.login(request.email, request.password);
  }
}
