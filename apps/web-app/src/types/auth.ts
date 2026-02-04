/**
 * Rôles utilisateurs strictement définis
 */
export enum UserRole {
  ADMIN = 'Admin',
  FARMER = 'Farmer',
  BUYER = 'Buyer',
  TRANSPORTER = 'Transporter',
}

/**
 * Interface utilisateur de base
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

/**
 * Type pour les chemins de dashboard
 */
export type DashboardPath = `/dashboard/${UserRole}`;
