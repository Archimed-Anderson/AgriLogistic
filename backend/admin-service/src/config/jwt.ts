import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

let publicKey: string | null = null;

export function loadPublicKey(): string {
  if (publicKey) {
    return publicKey;
  }

  const keyPath = process.env.JWT_PUBLIC_KEY_PATH || '../auth-service/keys/public.pem';
  const absolutePath = path.resolve(__dirname, '../../', keyPath);

  try {
    publicKey = fs.readFileSync(absolutePath, 'utf8');
    console.log('✅ JWT public key loaded successfully');
    return publicKey;
  } catch (error) {
    console.error('❌ Failed to load JWT public key:', error);
    throw new Error('JWT public key not found');
  }
}

export interface JWTPayload {
  user_id: string;
  email: string;
  roles?: string[];
  permissions?: string[];
  iat?: number;
  exp?: number;
}

export function verifyToken(token: string): JWTPayload {
  try {
    const publicKey = loadPublicKey();
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
