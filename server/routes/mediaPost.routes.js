import {Router} from 'express';
import mediaPostController from '../controllers/mediaPost.controller.js';

const postRouter = Router();

// View Posts
postRouter.get('/:postID', mediaPostController.readPost);
postRouter.get('/feed', mediaPostController.getFriendsPosts);

// Admin get all posts -> middleware
postRouter.get('/', mediaPostController.getAllPosts);

// CRUD for posts
postRouter.post('/', mediaPostController.writePost);
postRouter.put('/:postID', mediaPostController.editPost);
postRouter.delete('/:postID', mediaPostController.deletePost);
postRouter.post('/:postID', mediaPostController.writeComment);