/**
 * Type augmentation pour résoudre les problèmes de compatibilité
 * entre zodResolver et les versions de Zod
 */
import { ZodType, ZodTypeDef } from 'zod';

declare module '@hookform/resolvers/zod' {
  export function zodResolver<T extends ZodType<any, ZodTypeDef, any>>(schema: T): any;
}
