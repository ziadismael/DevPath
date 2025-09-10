import { Router } from 'express';
import { signup, login, logout} from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', login);
authRouter.post('/signout', logout);
// authRouter.post('/forgot-password', resetPassword)

export default authRouter;
