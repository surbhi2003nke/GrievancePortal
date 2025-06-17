import { Request, Response, NextFunction } from 'express';
import * as historyService from '../services/history.service';

export const getGrievanceHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const grievanceId = req.params.id;
    const history = await historyService.getGrievanceHistory(grievanceId);
    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};

export const getRecentActions = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const actions = await historyService.getRecentActions();
    res.status(200).json(actions);
  } catch (error) {
    next(error);
  }
};
