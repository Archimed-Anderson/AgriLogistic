import { SetMetadata } from '@nestjs/common';
import { Role } from '../../common/dto/auth.dto';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
