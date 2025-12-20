import { Router } from 'express';
import { viewProfile, updateProfile, followUser, unfollowUser, getAllUsers } from '../controllers/user.controller.js';
import { authorize, authorizeAdmin } from "../middlewares/auth.middleware.js";

const userRouter = Router();

// Get all users with optional search (moved before /:username to avoid conflicts)
// Remove admin requirement to allow user search
userRouter.get('/', authorize, getAllUsers);

// Get current user's profile (must be before /:username to avoid conflicts)
userRouter.get('/profile', authorize, viewProfile);

// view my page
userRouter.get('/:username', authorize, viewProfile);

// update my page
userRouter.put('/:username', authorize, updateProfile);

// view other user
userRouter.get('/:userID', authorize, viewProfile);

// follow/unfollow
userRouter.post('/:username/follow', authorize, followUser);
userRouter.delete('/:username/unfollow', authorize, unfollowUser);

export default userRouter;