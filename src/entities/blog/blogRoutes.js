import express from "express";
import { verifyToken } from "../../core/middlewares/authMiddleware.js";
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } from "./blogController.js";
import { multerUpload } from '../../core/config/multer.js';

const router = express.Router();

router.post('/create', verifyToken, multerUpload.single('uploadPhoto'), createBlog);
router.get('/all', verifyToken, getAllBlogs);
router.get('/single/:id', getBlogById);
router.put('/update/:id', verifyToken, multerUpload.single('uploadPhoto'), updateBlog);
router.delete('/delete-blog/:id', verifyToken, deleteBlog);


router.get('/test', (req, res)=>{
    res.status(200).json({message: "checking"});
})


export default router;