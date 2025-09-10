import {Router} from 'express';
import {} from '../controllers/mediaPost.controller.js';

const postRouter = Router();

// View Posts
postRouter.get('/:postID', readPost);
postRouter.get('/feed', getFriendsPosts);

// Admin get all posts -> middleware
postRouter.get('/', getAllPosts);

// CRUD for posts
postRouter.post('/', writePost);
postRouter.put('/:postID', editPost);
postRouter.delete('/:postID', deletePost);
postRouter.post('/:postID', writeComment);