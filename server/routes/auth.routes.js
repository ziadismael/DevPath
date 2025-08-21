import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/signup', authController.signup);
authRouter.post('/signin', authController.signin);
authRouter.post('/signout', authController.signout);
authRouter.post('/forgot-password', authController.resetPassword)

export default authRouter;
