import 'express-serve-static-core';

/** User attached to request after authentication (middleware sets this). */
export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'buyer' | 'transporter';
  permissions: string[];
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}
