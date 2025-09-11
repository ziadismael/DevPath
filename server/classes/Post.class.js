import {models} from "../models/index.models.js";
import { Op } from 'sequelize';

class PostClass {
    constructor(postData) {
        this._postID = postData.postID;
        this._userID = postData.userID;
        this._title = postData.title;
        this._bodyText = postData.bodyText;
        this._mediaURL = postData.mediaURL || null;
        this._createdAt = postData.createdAt;
        this._updatedAt = postData.updatedAt;

        // Eager-load comments if they are provided
        this._comments = postData.Comments ? postData.Comments : [];
    }

    static async findById(postID) {
        const postRecord = await models.Post.findByPk(postID, {
            include: {
                model: models.Comment,
                order: [['createdAt', 'ASC']], // Order comments from oldest to newest
            }
        });
        return postRecord ? new PostClass(postRecord.toJSON()) : null;
    }

    static async findAll() {
        const postRecords = await models.Post.findAll({
            order: [['createdAt', 'DESC']],
        });
        return postRecords.map(record => new PostClass(record.toJSON()));
    }

    static async findForUserFeed(user) {
        // 1. Call the helper method we just made to get the IDs
        const followingIDs = await user.getFollowingIDs();

        // 2. Create an array of all author IDs to include in the feed
        // (the user's own posts + the posts from people they follow)
        const authorIDs = [...followingIDs, user.userID];

        // 3. Find all posts where the userID is in our list of authors
        const postRecords = await models.Post.findAll({
            where: {
                userID: {
                    [Op.in]: authorIDs
                }
            },
            order: [['createdAt', 'DESC']],
        });

        return postRecords.map(record => new PostClass(record.toJSON()));
    }

    static async create(postData, userRecord) {
        const newPostRecord = await models.Post.create({
            title: postData.title,
            bodyText: postData.bodyText,
            mediaURL: postData.mediaURL,
            userID: userRecord.userID, // Associate the post with the user
        });
        return new PostClass(newPostRecord.toJSON());
    }

    async saveUpdates() {
        const currentPost = await models.Post.findByPk(this._postID);

        currentPost.title = this._title;
        currentPost.bodyText = this._body;
        currentPost.mediaURL = this._mediaURL;
        currentPost.updatedAt = this._updatedAt;
        currentPost.userID = this._userID;

        await currentPost.save();
    }

    async deletePost() {
        if (!this._postID) {
            throw new Error(`Cannot delete: post ${this._postID} not persisted in DB`);
        }

        await models.Post.destroy({
            where: { postID: this._postID }
        });

        // Optional: clear local state
        this._postID = null;
    }

    isAuthor(userRecord) {
        return this._userID === userRecord.userID;
    }

    set title(value) {
        if (typeof value === "string") {
            this._title = value;
        }
        else {
            throw new Error(`${value} is not a string`);
        }
    }
    set body(value) {
        if (typeof value === "string") {
            this._body = value;
        }
        else {
            throw new Error(`${value} is not a string`);
        }
    }
    get title() { return this._title; }
    get body() { return this._body; }
    get mediaURL() { return this._mediaURL; }
    set mediaURL(value) { this._mediaURL.push(value); }
    get comments() { return this._comments; }
}

export default PostClass;