import express from 'express';
import { createContract, getAllContracts, getContractById, respondToContract, deleteContract} from './contract.controller.js';
import { verifyToken, adminMiddleware } from "../../core/middlewares/authMiddleware.js";

const router = express.Router();

router 
     .route('/')
     .post(verifyToken, createContract)
     .get(verifyToken, adminMiddleware, getAllContracts);

router 
      .route('/:id')
      .get(verifyToken, adminMiddleware, getContractById)
      .put(verifyToken, adminMiddleware, respondToContract)
      .delete(verifyToken, adminMiddleware, deleteContract);

export default router;
