import CommentClass from '../classes/Comment.class.js';
import PostClass from '../classes/Post.class.js';

// Corresponds to: postRouter.post('/:postID/comments', authorize, writeComment);
export const writeComment = async (req, res, next) => {
    try {
        const { postID } = req.params;
        const { text, mediaURL } = req.body;

        if (!text) {
            const error = new Error('Comment text is required.');
            error.status = 400;
            throw error;
        }

        // Ensure the post exists before adding a comment
        const post = await PostClass.findById(postID);
        if (!post) {
            const error = new Error('Post not found.');
            error.status = 404;
            throw error;
        }

        const comment = await CommentClass.create({ text, mediaURL }, req.userRecord, postID);
        res.status(201).json({ success: true, message: 'Comment created successfully.', data: comment });
    } catch (error) {
        next(error);
    }
};


// Corresponds to: postRouter.delete('/:postID/comments/:commentID', authorize, deleteComment);
export const deleteComment = async (req, res, next) => {
    try {
        const { commentID } = req.params;
        const comment = await CommentClass.findById(commentID);

        if (!comment) {
            const error = new Error('Comment not found.');
            error.status = 404;
            throw error;
        }

        // Authorization Check
        if (!comment.isAuthor(req.userRecord) && req.user.getRole() !== 'Admin') {
            const error = new Error('You are not authorized to delete this comment.');
            error.status = 403;
            throw error;
        }

        await comment.destroy();
        res.status(200).json({ success: true, message: 'Comment deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

