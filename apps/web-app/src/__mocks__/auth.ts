/**
 * Mock manuel du module auth (Better Auth) pour les tests unitaires.
 * Évite de charger better-auth (ESM) dans Jest.
 */
export const auth = {
  api: {
    signUpEmail: jest.fn(),
    signInEmail: jest.fn(),
    signInSocial: jest.fn(),
    signOut: jest.fn(),
  },
};
