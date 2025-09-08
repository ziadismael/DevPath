import {Router} from 'express';
import userController from '../controllers/user.controller.js';

const userRouter = Router();

// We need to still add the middlewares
//______________________________________

// view my page
userRouter.get('/:username',userController.viewMyProfile);

// update my page
userRouter.put('/:username',userController.updateProfile);

// view other user
userRouter.get('/:userID', userController.viewProfile);

// follow/unfollow
userRouter.post('/:userID/follow', userController.followUser);
userRouter.delete('/:userID/unfollow', userController.unfollowUser);

// get all users (admin)
userRouter.get('/', userController.getAllUsers);

export default userRouter;