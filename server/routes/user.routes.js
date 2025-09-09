import {Router} from 'express';
import {viewProfile, updateProfile, followUser, unfollowUser, getAllUsers} from '../controllers/user.controller.js';
import {authorize, authorizeAdmin} from "../middlewares/auth.middleware.js";

const userRouter = Router();


// view my page
userRouter.get('/:username',authorize, viewProfile);

// update my page
userRouter.put('/:username',authorize, updateProfile);

// view other user
userRouter.get('/:userID', authorize, viewProfile);

// follow/unfollow
userRouter.post('/:username/follow', authorize, followUser);
userRouter.delete('/:username/unfollow', authorize, unfollowUser);

// get all users (admin)
userRouter.get('/', authorize ,authorizeAdmin, getAllUsers);

export default userRouter;