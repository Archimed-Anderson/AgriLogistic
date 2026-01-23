import { Request, Response } from 'express';
import dashboardService from '../services/dashboard.service';

export class DashboardController {
  async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = req.query.from && req.query.to
        ? { from: req.query.from as string, to: req.query.to as string }
        : undefined;

      const metrics = await dashboardService.getMetrics(dateRange);
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAlerts(req: Request, res: Response): Promise<void> {
    try {
      const alerts = await dashboardService.getAlerts();
      res.json(alerts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async dismissAlert(req: Request, res: Response): Promise<void> {
    try {
      await dashboardService.dismissAlert(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async getRecentActivity(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activity = await dashboardService.getRecentActivity(limit);
      res.json(activity);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new DashboardController();
