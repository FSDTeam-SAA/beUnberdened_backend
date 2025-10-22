import express from "express";
import { verifyToken, adminMiddleware } from "../../core/middlewares/authMiddleware.js";
import { createService, getAllServices, getServiceById, updateService, deleteService } from "./serviceController.js";
import { multerUpload } from '../../core/config/multer.js';

const router = express.Router();

router.post('/', verifyToken, adminMiddleware, multerUpload.single('uploadPhoto'), createService);
router.get('/',  getAllServices);
router.get('/:id', getServiceById);
router.put('/:id', verifyToken, adminMiddleware, multerUpload.single('uploadPhoto'), updateService);
router.delete('/:id', verifyToken, adminMiddleware, deleteService);


router.get('/test', (req, res)=>{
    res.status(200).json({message: "checking"});
})


export default router;