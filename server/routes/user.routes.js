import {Router} from 'express';
import {viewProfile, updateProfile} from '../controllers/user.controller.js';
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();


// view my page
userRouter.get('/:username',authorize, viewProfile);

// update my page
userRouter.put('/:username',authorize, updateProfile);

// view other user
userRouter.get('/:userID', authorize, viewProfile);

// follow/unfollow
userRouter.post('/:userID/follow', authorize, followUser);
userRouter.delete('/:userID/unfollow', authorize, unfollowUser);

// get all users (admin)
userRouter.get('/', authorize, getAllUsers);

export default userRouter;