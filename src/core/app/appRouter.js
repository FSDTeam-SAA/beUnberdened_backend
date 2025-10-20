import express from 'express';
import authRoutes from '../../entities/auth/auth.routes.js';
import userRoutes from '../../entities/user/user.routes.js';
import profileRoutes from '../../entities/profile/profileRoutes.js';
import blogRoutes from '../../entities/blog/blogRoutes.js';
import serviceRoutes from '../../entities/service/serviceRoutes.js';
import podcastRoutes from '../../entities/podcast/podcast.routes.js';


const router = express.Router();


router.use('/v1/auth', authRoutes);
router.use('/v1/user', userRoutes);
router.use('/v1/profile', profileRoutes);
router.use('/v1/blog', blogRoutes);
router.use('/v1/services', serviceRoutes);
router.use('/v1/podcasts', podcastRoutes);


export default router;
