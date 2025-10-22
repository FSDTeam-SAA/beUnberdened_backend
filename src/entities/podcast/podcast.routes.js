import express from "express";
import { verifyToken, adminMiddleware } from "../../core/middlewares/authMiddleware.js";
import { multerUpload } from '../../core/config/multer.js';
import { createPodcast, getAllPodcasts, getPodcastById, updatePodcast, deletePodcast } from "./podcast.controller.js";

const router = express.Router();


router
      .route('/')
      .post(verifyToken, adminMiddleware, multerUpload.single('uploadThumbnail'), createPodcast)
      .get(getAllPodcasts);

router
     .route('/:id')
     .get(getPodcastById)
     .put(verifyToken, adminMiddleware, multerUpload.single('uploadThumbnail'), updatePodcast)
     .delete(verifyToken, adminMiddleware, deletePodcast);

export default router;