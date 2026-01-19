import 'express-serve-static-core';
import type { UserRole } from '../models/permission.model';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: UserRole;
      permissions: string[];
    };
  }
}

