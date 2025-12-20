import { Router } from 'express';
import { writePost, getFriendsPosts, readPost, getAllPosts, editPost, deletePost } from '../controllers/post.controller.js';
import { writeComment, deleteComment } from "../controllers/comment.controller.js";
import authorize, { authorizeAdmin } from "../middlewares/auth.middleware.js";
import { models } from '../models/index.models.js';

const postRouter = Router();

// ---------------------------------POSTS---------------------------------
// CRUD - (user's accessible)
// C(reate) - POST Method
postRouter.post('/', authorize, writePost);

// R(ead) - GET Method
postRouter.get('/feed', authorize, getFriendsPosts);         // <- get all posts on user's feed sorted by newest
postRouter.get('/:postID', readPost);                        // <- get a specific post by it's ID including it's comments
postRouter.get('/', authorize, getAllPosts); // Get all posts (user-accessible)

// U(Pdate) - PUT Method
postRouter.put('/:postID', authorize, editPost);              // <- edit/update post through given ID

// D(elete) - DELETE Method
postRouter.delete('/:postID', authorize, deletePost);

// ---------------------------------COMMENTS---------------------------------
// Create a new comment on a specific post
postRouter.post('/:postID/comments', authorize, writeComment);

// Delete a comment (ownership will be checked in controller)
postRouter.delete('/:postID/comments/:commentID', authorize, deleteComment);

// ---------------------------------LIKES---------------------------------
// Toggle like on a post (like if not liked, unlike if already liked)
postRouter.post('/:postID/like', authorize, async (req, res, next) => {
    try {
        const { postID } = req.params;
        const userID = req.userRecord.userID;

        // Find the post
        const post = await models.Post.findByPk(postID);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if user already liked this post
        const existingLike = await models.Like.findOne({
            where: {
                postID: postID,
                userID: userID
            }
        });

        if (existingLike) {
            // Unlike: Remove the like and decrement counter
            await existingLike.destroy();
            post.likes = Math.max(0, (post.likes || 0) - 1);
            await post.save();

            res.status(200).json({
                success: true,
                message: 'Post unliked successfully',
                liked: false,
                likes: post.likes
            });
        } else {
            // Like: Create new like and increment counter
            await models.Like.create({
                postID: postID,
                userID: userID
            });
            post.likes = (post.likes || 0) + 1;
            await post.save();

            res.status(200).json({
                success: true,
                message: 'Post liked successfully',
                liked: true,
                likes: post.likes
            });
        }
    } catch (error) {
        next(error);
    }
});

export default postRouter;