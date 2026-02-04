import { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';
import { UserRepository } from '../repositories/user.repository';
import { getPermissionsByRole, UserRole } from '../models/permission.model';
export class BuyerController {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }
  /**
   * GET /api/v1/buyer/profile
   * Get buyer profile
   */
  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userRepository.findById((req as AuthenticatedRequest).user!.id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé',
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            phone: user.phone,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
            avatarUrl: user.avatarUrl,
            permissions: getPermissionsByRole(user.role as UserRole),
          },
        },
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération du profil',
      });
    }
  };
  /**
   * PUT /api/v1/buyer/profile
   * Update buyer profile
   */
  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { firstName, lastName, phone } = req.body;
      const user = await this.userRepository.update((req as AuthenticatedRequest).user!.id, {
        firstName,
        lastName,
        phone,
      });
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé',
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
          },
        },
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la mise à jour du profil',
      });
    }
  };
  /**
   * GET /api/v1/buyer/orders
   * Get buyer's orders
   */
  getOrders = async (_req: Request, res: Response): Promise<void> => {
    try {
      // TODO: Implement order fetching
      res.status(200).json({
        success: true,
        data: {
          orders: [],
        },
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des commandes',
      });
    }
  };
  /**
   * GET /api/v1/buyer/orders/:id
   * Get specific order details
   */
  getOrderDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      // TODO: Implement order detail fetching
      res.status(200).json({
        success: true,
        data: {
          order: {
            id,
            status: 'pending',
          },
        },
      });
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des détails de la commande',
      });
    }
  };
}
