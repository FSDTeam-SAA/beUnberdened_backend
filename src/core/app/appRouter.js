import express from 'express';
import authRoutes from '../../entities/auth/auth.routes.js';
import profileRoutes from '../../entities/profile/profileRoutes.js';
import blogRoutes from '../../entities/blog/blogRoutes.js';
import serviceRoutes from '../../entities/service/serviceRoutes.js';
import podcastRoutes from '../../entities/podcast/podcast.routes.js';
import contractRoutes from '../../entities/contract/contract.routes.js';
import brodcastRoutes from '../../entities/brodcast/broadcast.routes.js';
import adminRoutes from '../../entities/admin/admin.routes.js';


const router = express.Router();


router.use('/v1/auth', authRoutes);
router.use('/v1/profile', profileRoutes);
router.use('/v1/blogs', blogRoutes);
router.use('/v1/services', serviceRoutes);
router.use('/v1/podcasts', podcastRoutes);
router.use('/v1/contracts', contractRoutes);
router.use('/v1/broadcast', brodcastRoutes);
router.use('/v1/admin', adminRoutes);


export default router;
