import { Request, Response, NextFunction } from 'express';
import * as grievanceService from '../services/grievance.service';

export const createGrievance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const newGrievance = await grievanceService.createGrievance({
      ...req.body,
      date_time: Date.now(),
      status: 'PENDING',
      attachment: false,
      issue_id: `${Date.now()}-${userId}`, // generate unique issue_id
    });
    res.status(201).json(newGrievance);
  } catch (error) {
    next(error);
  }
};

export const getGrievanceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const grievance = await grievanceService.getGrievanceById(req.params.id);
    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });
    res.status(200).json(grievance);
  } catch (error) {
    next(error);
  }
};

export const getAllGrievances = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const grievances = await grievanceService.getAllGrievances();
    res.status(200).json(grievances);
  } catch (error) {
    next(error);
  }
};

export const updateGrievance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await grievanceService.updateGrievance(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteGrievance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await grievanceService.deleteGrievance(req.params.id);
    res.status(200).json(deleted);
  } catch (error) {
    next(error);
  }
};

export const getGrievanceWithResponses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await grievanceService.getGrievanceWithResponses(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
