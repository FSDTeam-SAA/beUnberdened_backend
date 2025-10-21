import express from "express";
import { adminMiddleware, verifyToken } from "../../core/middlewares/authMiddleware.js";
import adminManagement from "./admin.controller.js";


const router = express.Router();

router.get('/', verifyToken, adminMiddleware, adminManagement);

export default router;
