/**
 * Données de test pour les comptes Modern Login
 * Utilisé par les tests Playwright
 */

export interface TestAccount {
  email: string;
  password: string;
  role: 'admin' | 'buyer' | 'farmer' | 'transporter';
  expectedRedirect: string;
  permissions: string[];
  description?: string;
}

export const TEST_ACCOUNTS: Record<string, TestAccount> = {
  admin: {
    email: 'admintest@gmail.com',
    password: 'Admin123', // Fallback: Admin@123
    role: 'admin',
    expectedRedirect: '/admin/overview',
    permissions: ['*'],
    description: 'Compte administrateur avec tous les droits',
  },
  buyer: {
    email: 'buyer@test.com',
    password: 'Buyer123!',
    role: 'buyer',
    expectedRedirect: '/customer/overview',
    permissions: ['marketplace:read', 'orders:create'],
    description: 'Compte acheteur standard',
  },
  farmer: {
    email: 'farmer@test.com',
    password: 'Farmer123!',
    role: 'farmer',
    expectedRedirect: '/customer/overview',
    permissions: ['products:create', 'products:update'],
    description: 'Compte agriculteur/producteur',
  },
  transporter: {
    email: 'transporter@test.com',
    password: 'Transport123!',
    role: 'transporter',
    expectedRedirect: '/customer/overview',
    permissions: ['transport:read', 'transport:update'],
    description: 'Compte transporteur/logisticien',
  },
};

export const INVALID_CREDENTIALS = {
  wrongEmail: {
    email: 'nonexistent@example.com',
    password: 'Password123!',
    expectedError: /incorrect|erreur|invalid|credentials/i,
  },
  wrongPassword: {
    email: 'admintest@gmail.com',
    password: 'WrongPassword123!',
    expectedError: /incorrect|erreur|invalid|credentials/i,
  },
  emptyEmail: {
    email: '',
    password: 'Password123!',
    expectedError: /requis|vide|obligatoire/i,
  },
  emptyPassword: {
    email: 'test@example.com',
    password: '',
    expectedError: /requis|vide|obligatoire/i,
  },
};

export const INVALID_EMAIL_FORMATS = [
  'invalid-email',
  'test@',
  '@example.com',
  'test..test@example.com',
  'test@example',
  'test @example.com',
  'test@example..com',
];

export const WEAK_PASSWORDS = [
  { value: 'short', reason: 'Trop court (< 8 caractères)' },
  { value: 'nouppercase123!', reason: 'Pas de majuscule' },
  { value: 'NOLOWERCASE123!', reason: 'Pas de minuscule' },
  { value: 'NoNumbers!', reason: 'Pas de chiffre' },
  { value: 'NoSpecial123', reason: 'Pas de caractère spécial' },
];
