// server/routes/livekit.routes.js
import { Router } from 'express';
// Note: Changed to .js extension and named import
import { createToken } from '../controllers/livekit.controller.js';

const router = Router();

// Changed to GET to match Frontend fetch and req.query usage
router.get('/token', createToken);

export default router;