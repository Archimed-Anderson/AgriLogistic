import { Request, Response } from 'express';
import systemService from '../services/system.service';

export class SystemController {
  async getServicesHealth(_req: Request, res: Response): Promise<void> {
    try {
      const health = await systemService.getServicesHealth();
      res.json(health);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMetrics(_req: Request, res: Response): Promise<void> {
    try {
      const metrics = await systemService.getMetrics();
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getLogs(req: Request, res: Response): Promise<void> {
    try {
      const params = {
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        level: req.query.level as string,
      };
      const logs = await systemService.getLogs(params);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async restartService(req: Request, res: Response): Promise<void> {
    try {
      await systemService.restartService(req.params.name);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new SystemController();
