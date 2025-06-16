import { Request, Response, NextFunction } from 'express';
import * as attachmentService from '../services/attachment.service';
import { upload } from '../middlewares/upload.middleware';
import path from 'path';

export const uploadAttachment = [
  upload.single('file'),  // multer middleware first
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file!;
      const grievanceId = req.body.grievance_id;
      const uploadedBy = req.user.id;

      const saved = await attachmentService.saveAttachment({
        grievanceId,
        uploadedBy,
        filePath: file.path,
        fileName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size
      });

      res.status(201).json(saved);
    } catch (error) {
      next(error);
    }
  }
];

export const downloadAttachment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attachment = await attachmentService.getAttachmentById(req.params.id);

    if (!attachment) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.sendFile(path.resolve(attachment.file_path));
  } catch (error) {
    next(error);
  }
};

export const getAttachmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attachment = await attachmentService.getAttachmentById(req.params.id);

    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    res.json(attachment);
  } catch (error) {
    next(error);
  }
};
export const deleteAttachment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attachmentId = req.params.id;
    const deleted = await attachmentService.deleteAttachment(attachmentId);

    if (!deleted) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
export function getAttachmentsByGrievanceId(arg0: string, auth: any, arg2: any, getAttachmentsByGrievanceId: any) {
    throw new Error('Function not implemented.');
}
}

