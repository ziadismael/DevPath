import { models } from "../models/index.models.js";

class CommentClass {
    constructor(commentData) {
        this._commentID = commentData.commentID;
        this._userID = commentData.userID;
        this._postID = commentData.postID;
        this._text = commentData.text;
        this._mediaURL = commentData.mediaURL || null;
        this._createdAt = commentData.createdAt;
        this._updatedAt = commentData.updatedAt;
    }

    /**
     * Creates a new comment record in the database.
     * @param {object} commentData - The data for the new comment (text, mediaURL).
     * @param {object} userRecord - The raw Sequelize user record of the author.
     * @param {string} postID - The ID of the post this comment belongs to.
     * @returns {CommentClass} A new instance of the CommentClass.
     */
    static async create(commentData, userRecord, postID) {
        const newCommentRecord = await models.Comment.create({
            text: commentData.text,
            mediaURL: commentData.mediaURL,
            userID: userRecord.userID,
            postID: postID,
        });
        return new CommentClass(newCommentRecord.toJSON());
    }

    /**
     * Finds a single comment by its ID.
     * @param {string} commentID - The UUID of the comment.
     */
    static async findById(commentID) {
        const commentRecord = await models.Comment.findByPk(commentID);
        return commentRecord ? new CommentClass(commentRecord.toJSON()) : null;
    }

    /**
     * Deletes the comment from the database.
     */
    async destroy() {
        await models.Comment.destroy({ where: { commentID: this._commentID } });
    }

    /**
     * Checks if a given user is the author of this comment.
     * @param {object} userRecord - The raw Sequelize user record.
     * @returns {boolean}
     */
    isAuthor(userRecord) {
        return this._userID === userRecord.userID;
    }
}

export default CommentClass;
