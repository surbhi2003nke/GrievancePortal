import { Router } from 'express';
import * as attachmentController from '../controllers/attachment.controller';
import { auth } from '../middlewares/auth.middleware';
import { permit } from '../middlewares/permit.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.post(
  '/',
  auth,
  permit('STUDENT', 'DEPT_ADMIN', 'CAMPUS_ADMIN', 'SUPER_ADMIN'),
  upload.single('file'),
  attachmentController.uploadAttachment
);

router.get(
  '/:id',
  auth,
  permit('STUDENT', 'DEPT_ADMIN', 'CAMPUS_ADMIN', 'SUPER_ADMIN'),
  attachmentController.getAttachmentById
);

router.delete(
  '/:id',
  auth,
  permit('DEPT_ADMIN', 'CAMPUS_ADMIN', 'SUPER_ADMIN'),
  attachmentController.deleteAttachment
);

router.get(
  '/grievance/:grievanceId',
  auth,
  permit('STUDENT', 'DEPT_ADMIN', 'CAMPUS_ADMIN', 'SUPER_ADMIN'),
  attachmentController.getAttachmentsByGrievanceId
);

export default router;