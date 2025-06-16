import { Router } from "express";

const router = Router();
// Create a new grievance - Only STUDENT can do this
router.post(
  '/',
  auth,                         // Must be logged in
  permit('STUDENT'),            // Only students can submit
  validate(grievanceRequestSchema),  // Validate request body
  grievanceController.createGrievance
);

// Get grievance by ID - STUDENT or ADMIN
router.get(
  '/:id',
  auth,
  grievanceController.getGrievanceById
);

// Update status (IN_PROGRESS, RESOLVED, CLOSED)
router.patch(
  '/:id/status',
  auth,
  permit('DEPT_ADMIN', 'CAMPUS_ADMIN', 'SUPER_ADMIN'),
  grievanceController.updateStatus
);

// Forward grievance to another department
router.patch(
  '/:id/forward',
  auth,
  permit('DEPT_ADMIN', 'CAMPUS_ADMIN', 'SUPER_ADMIN'),
  grievanceController.forwardGrievance
);

// (Optional) Get grievances by logged-in user (for dashboard)
router.get(
  '/',
  auth,
  grievanceController.getMyGrievances
);

export default router;
