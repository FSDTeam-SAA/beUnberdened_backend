import express from "express";
import { adminMiddleware, verifyToken } from "../../core/middlewares/authMiddleware.js";
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } from "./blogController.js";
import { multerUpload } from '../../core/config/multer.js';

const router = express.Router();

router.post('/', verifyToken, adminMiddleware, multerUpload.single('uploadPhoto'), createBlog);
router.get('/', verifyToken, adminMiddleware, getAllBlogs);
router.get('/:id', adminMiddleware, getBlogById);
router.put('/:id', verifyToken, adminMiddleware, multerUpload.single('uploadPhoto'), updateBlog);
router.delete('/:id', verifyToken, adminMiddleware, deleteBlog);


router.get('/test', (req, res)=>{
    res.status(200).json({message: "checking"});
})


export default router;