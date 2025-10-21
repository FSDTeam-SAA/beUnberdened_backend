import express from "express";
import { 
    createSubscriber, 
    getAllSubscribers, 
    getSubscriberById, 
    deleteSubscriber, 
    sendBroadcast, 
    sendBroadcastToAll, 
    getAllBroadcasts,
    getBroadcastById,
    deleteBroadcast
} from './broadcast.controller.js';
import { verifyToken } from "../../core/middlewares/authMiddleware.js";


const router = express.Router();


//subscribe routes
router.post('/subscribe', verifyToken, createSubscriber);
router.get('/subscribe', verifyToken, getAllSubscribers);
router.get('/subscribe/:id', verifyToken, getSubscriberById);
router.delete('/subscribe/:id', verifyToken, deleteSubscriber);


//broadcast routes
router.post('/specific', verifyToken, sendBroadcast);
router.post('/', verifyToken, sendBroadcastToAll);
router.get('/:id', verifyToken, getAllBroadcasts);
router.get('/:id', verifyToken, getBroadcastById);
router.delete('/:id', verifyToken, deleteBroadcast);

export default router;