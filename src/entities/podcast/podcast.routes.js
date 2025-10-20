import express from "express";
import { verifyToken } from "../../core/middlewares/authMiddleware.js";
import { multerUpload } from '../../core/config/multer.js';
import { createPodcast, getAllPodcasts, getPodcastById, updatePodcast, deletePodcast } from "./podcast.controller.js";

const router = express.Router();


router
      .route('/')
      .post(verifyToken, multerUpload.single('uploadThumbnail'), createPodcast)
      .get(verifyToken, getAllPodcasts);


router
     .route('/:id')
     .get(verifyToken, getPodcastById)
     .put(verifyToken, multerUpload.single('uploadThumbnail', updatePodcast))
     .delete(verifyToken, deletePodcast);


export default router;