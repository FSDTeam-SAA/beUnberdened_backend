import express from "express";
import { adminMiddleware, verifyToken } from "../../core/middlewares/authMiddleware.js";
import { adminManagement, getMonthlyActiveUsersController } from "./admin.controller.js";


const router = express.Router();

router.get('/', verifyToken, adminMiddleware, adminManagement);
router.get('/active-users', verifyToken, adminMiddleware, getMonthlyActiveUsersController)

export default router;
