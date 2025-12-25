import PostClass from '../classes/Post.class.js';
import { models } from '../models/index.models.js';

// Corresponds to: postRouter.post('/', authorize, writePost);
export const writePost = async (req, res, next) => {
    try {
        const { title, bodyText, mediaURL } = req.body;
        if (!title || !bodyText) {
            const error = new Error('Title and body are required.');
            error.status = 400;
            throw error;
        }

        const post = await PostClass.create({ title, bodyText, mediaURL }, req.userRecord);
        res.status(201).json({ success: true, message: 'Post created successfully.', data: post });
    } catch (error) {
        next(error);
    }
};

// Corresponds to: postRouter.get('/feed', authorize ,getFriendsPosts);
export const getFriendsPosts = async (req, res, next) => {
    try {
        // req.user is an instance of UserClass, which now has a getFollowingIDs method
        const posts = await PostClass.findForUserFeed(req.user);
        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (error) {
        next(error);
    }
};

// Corresponds to: postRouter.get('/:postID', readPost);
export const readPost = async (req, res, next) => {
    try {
        const { postID } = req.params;
        const post = await PostClass.findById(postID);
        if (!post) {
            const error = new Error('Post not found.');
            error.status = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: post });
    } catch (error) {
        next(error);
    }
};

// Corresponds to: postRouter.get('/', authorize, getAllPosts);
export const getAllPosts = async (req, res, next) => {
    try {
        const currentUserID = req.userRecord?.userID || null;
        const posts = await PostClass.findAll(currentUserID);
        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (error) {
        next(error);
    }
};

// Corresponds to: postRouter.put('/:postID',authorize, editPost);
export const editPost = async (req, res, next) => {
    try {
        const { postID } = req.params;
        const post = await PostClass.findById(postID);

        if (!post) {
            const error = new Error('Post not found.');
            error.status = 404;
            throw error;
        }

        // Authorization Check
        if (!post.isAuthor(req.userRecord) && req.user.role !== 'Admin') {
            const error = new Error('You are not authorized to edit this post.');
            error.status = 403;
            throw error;
        }

        const { title, bodyText, mediaURL } = req.body;
        post.title = title;
        post.bodyText = bodyText;
        post.mediaURL = mediaURL !== undefined ? mediaURL : post.mediaURL;
        await post.saveUpdates();
        const updatedPost = await PostClass.findById(postID); // Re-fetch to get latest data
        res.status(200).json({ success: true, message: 'Post updated successfully.', data: updatedPost });
    } catch (error) {
        console.error('Error in editPost:', error);
        next(error);
    }
};

// Corresponds to: postRouter.delete('/:postID', deletePost);
export const deletePost = async (req, res, next) => {
    try {

        // ADDED: Guard clause to ensure req.user and req.userRecord exist.
        if (!req.user || !req.userRecord) {
            const error = new Error('Authentication error: User not found.');
            error.status = 401; // Unauthorized
            throw error;
        }

        const post = await PostClass.findById(req.params.postID);
        if (!post) {
            const error = new Error('Post not found.');
            error.status = 404;
            throw error;
        }

        // Authorization Check
        const isAuthorized = await post.isAuthor(req.userRecord);
        if (!isAuthorized) {
            const error = new Error('You are not authorized to delete this post.');
            error.status = 403;
            throw error;
        }

        await post.deletePost();
        res.status(200).json({ success: true, message: 'Post deleted successfully.' });
    } catch (error) {
        next(error);
    }
};
