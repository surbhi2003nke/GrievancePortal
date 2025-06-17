import { Router } from "express";
import userRoutes from "./users.routes";

const router = Router();
// Import all v1 routes
router.use("/users", userRoutes);
// Add other v1 routes here as needed
// e.g. router.use("/grievances", grievanceRoutes);

export default router;