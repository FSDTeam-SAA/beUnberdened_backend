import express from "express";
import { verifyToken } from '../../core/middlewares/authMiddleware.js';
import { multerUpload } from '../../core/config/multer.js';
import 
{ 
    updateProfile, 
    getProfile, 
    deleteProfile, 
    updateProfileImage, 
    deleteProfileImage 
} from "./profileController.js";

const router = express.Router();

router.put("/update-profile/me", verifyToken, multerUpload.single('profileImage'), updateProfile);
router.get("/me", verifyToken, getProfile);
router.delete("/delete-profile/me", verifyToken, deleteProfile);
router.put("/update-profile-image", verifyToken, multerUpload.single('profileImage'), updateProfileImage);
router.delete("/delete-profile-image", verifyToken, deleteProfileImage);

export default router;