import {Router} from 'express';
import {writePost, getFriendsPosts, readPost, getAllPosts, editPost, deletePost} from '../controllers/post.controller.js';
import {writeComment, deleteComment} from "../controllers/comment.controller.js";
import authorize, {authorizeAdmin} from "../middlewares/auth.middleware.js";

const postRouter = Router();

// ---------------------------------POSTS---------------------------------
// CRUD - (user's accessible)
// C(reate) - POST Method
postRouter.post('/', authorize, writePost);

// R(ead) - GET Method
postRouter.get('/feed', authorize ,getFriendsPosts);         // <- get all posts on user's feed sorted by newest
postRouter.get('/:postID', readPost);                        // <- get a specific post by it's ID including it's comments
postRouter.get('/', authorize, authorizeAdmin, getAllPosts); // Admin-only accessible: get all posts

// U(Pdate) - PUT Method
postRouter.put('/:postID',authorize, editPost);              // <- edit/update post through given ID

// D(elete) - DELETE Method
postRouter.delete('/:postID', authorize, deletePost);

// ---------------------------------COMMENTS---------------------------------
// Create a new comment on a specific post
postRouter.post('/:postID/comments', authorize, writeComment);

// Delete a comment (ownership will be checked in controller)
postRouter.delete('/:postID/comments/:commentID', authorize, deleteComment);

export default postRouter;