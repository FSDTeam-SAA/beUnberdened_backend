import express from "express";
import { verifyToken } from "../../core/middlewares/authMiddleware.js";
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } from "./blogController.js";
import { multerUpload } from '../../core/config/multer.js';

const router = express.Router();

router.post('/', verifyToken, multerUpload.single('uploadPhoto'), createBlog);
router.get('/', verifyToken, getAllBlogs);
router.get('/:id', getBlogById);
router.put('/:id', verifyToken, multerUpload.single('uploadPhoto'), updateBlog);
router.delete('/:id', verifyToken, deleteBlog);


router.get('/test', (req, res)=>{
    res.status(200).json({message: "checking"});
})


export default router;