import { models } from "../models/index.models.js";
import { Op } from 'sequelize';

class PostClass {
    constructor(postData) {
        this._postID = postData.postID;
        this._userID = postData.userID;
        this._title = postData.title;
        this._bodyText = postData.bodyText;
        this._mediaURL = postData.mediaURL || null;
        this._likes = postData.likes || 0;
        this._createdAt = postData.createdAt;
        this._updatedAt = postData.updatedAt;

        // Eager-load user/author if provided
        this._user = postData.User || null;

        // Eager-load comments if they are provided
        this._comments = postData.Comments ? postData.Comments : [];

        // Track if current user liked this post
        this._likedByCurrentUser = postData.likedByCurrentUser || false;
    }

    static async findById(postID) {
        const postRecord = await models.Post.findByPk(postID, {
            include: [{
                model: models.Comment,
                order: [['createdAt', 'ASC']], // Order comments from oldest to newest
                include: {
                    model: models.User,
                    attributes: ['userID', 'username', 'firstName', 'lastName']
                }
            }, {
                model: models.User,
                attributes: ['userID', 'username', 'firstName', 'lastName']
            }]
        });
        return postRecord ? new PostClass(postRecord.toJSON()) : null;
    }

    static async findAll(currentUserID = null) {
        const postRecords = await models.Post.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: models.User,
                    attributes: ['userID', 'username', 'firstName', 'lastName']
                },
                {
                    model: models.Comment,
                    include: {
                        model: models.User,
                        attributes: ['userID', 'username', 'firstName', 'lastName']
                    }
                },
                {
                    model: models.User,
                    as: 'LikedByUsers',
                    attributes: ['userID'],
                    through: { attributes: [] }
                }
            ]
        });

        return postRecords.map(record => {
            const postData = record.toJSON();
            // Check if current user liked this post
            if (currentUserID && postData.LikedByUsers) {
                postData.likedByCurrentUser = postData.LikedByUsers.some(
                    user => user.userID === currentUserID
                );
            }
            return new PostClass(postData);
        });
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
            include: [
                {
                    model: models.User,
                    attributes: ['userID', 'username', 'firstName', 'lastName']
                },
                {
                    model: models.Comment,
                    include: {
                        model: models.User,
                        attributes: ['userID', 'username', 'firstName', 'lastName']
                    }
                }
            ]
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
        currentPost.bodyText = this._bodyText;
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
        return (this._userID === userRecord.userID) && (userRecord.role !== "Admin");
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
    set mediaURL(value) { this._mediaURL = value; }
    get comments() { return this._comments; }
    get user() { return this._user; }

    // Serialize for JSON responses - remove underscore prefixes
    toJSON() {
        return {
            postID: this._postID,
            userID: this._userID,
            title: this._title,
            bodyText: this._bodyText,
            mediaURL: this._mediaURL,
            likes: this._likes,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
            User: this._user,
            Comments: this._comments,
            likedByCurrentUser: this._likedByCurrentUser
        };
    }
}

export default PostClass;