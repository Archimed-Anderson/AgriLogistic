import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { PasswordService } from '../services/password.service';
import { logAdminAction } from '../services/logger.service';
import { UserRole } from '../models/permission.model';
export class AdminController {
  private userRepository: UserRepository;
  private passwordService: PasswordService;
  constructor() {
    this.userRepository = new UserRepository();
    this.passwordService = new PasswordService();
  }
  /**
   * GET /api/v1/admin/users
   * List all users
   */
  listUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const { users, total } = await this.userRepository.list(page, limit);
      // Don't send password hashes to client
      const sanitizedUsers = users.map(user => ({
        id: user.id,
        email: user.email,
       firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
        phone: user.phone,
        createdAt: user.createdAt,
      }));
      res.status(200).json({
        success: true,
        data: {
          users: sanitizedUsers,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des utilisateurs',
      });
    }
  };
  /**
   * POST /api/v1/admin/users
   * Create a new user
   */
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, firstName, lastName, role, phone } = req.body;
      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        res.status(400).json({
          success: false,
          error: 'Champs requis manquants',
        });
        return;
      }
      // Check if user exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'Un utilisateur avec cet email existe déjà',
        });
        return;
      }
      // Validate role
      const validRoles: UserRole[] = [UserRole.ADMIN, UserRole.BUYER, UserRole.TRANSPORTER];
      if (role && !validRoles.includes(role)) {
        res.status(400).json({
          success: false,
          error: `Rôle invalide. Valeurs acceptées: ${validRoles.join(', ')}`,
        });
        return;
      }
      // Hash password
      const passwordHash = await this.passwordService.hashPassword(password);
      // Create user
      const user = await this.userRepository.create({
        email,
        firstName,
        lastName,
        role: role || UserRole.BUYER,
        phone,
        passwordHash,
      });
      // Log admin action
      logAdminAction(req.user!.id, 'create_user', { userId: user.id, role: user.role });
      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
        },
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la création de l\'utilisateur',
      });
    }
  };
  /**
   * DELETE /api/v1/admin/users/:id
   * Delete a user
   */
  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userRepository.findById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé',
        });
        return;
      }
      // Prevent self-deletion
      if (user.id === req.user!.id) {
        res.status(400).json({
          success: false,
          error: 'Vous ne pouvez pas supprimer votre propre compte',
        });
        return;
      }
      await this.userRepository.softDelete(id);
      // Log admin action
      logAdminAction(req.user!.id, 'delete_user', { userId: id });
      res.status(200).json({
        success: true,
        message: 'Utilisateur supprimé avec succès',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression de l\'utilisateur',
      });
    }
  };
  /**
   * GET /api/v1/admin/analytics
   * Get system analytics
   */
  getAnalytics = async (_req: Request, res: Response): Promise<void> => {
    try {
      // TODO: Implement real analytics
      res.status(200).json({
        success: true,
        data: {
          totalUsers: 0,
          activeUsers: 0,
          totalOrders: 0,
          totalRevenue: 0,
        },
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des analytics',
      });
    }
  };
}
