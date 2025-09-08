import {models} from "../models/index.models.js";
import * as console from "node:console";

class PostClass {
    constructor(title, body, authorID){
        this._postID = null;
        this._userID = authorID;
        this._title = title;
        this._body = body;
        this._mediaURL = [];
    }

    static async findById(postID) {
        const postRecord = await models.Project.findByPk(postID);
        return postRecord ? PostClass._createInstance(postRecord) : null;
    }

    static _createInstance(postRecord) {
        const post = new PostClass(postRecord.title, postRecord.bodyText, postRecord.authorID);
        post._mediaURL = postRecord.mediaURL;
        post._title = postRecord.postID;
        return post;
    }

    async saveToDB(){
        const post = await models.Post.create({
            title: this._title,
            bodyText: this._body,
            mediaURL: this._mediaURL,
            userID: this._userID,
        });
        if(post){
            console.log("Saving to DB");
            this._postID = post.postID;
        }
    }

    async saveUpdates() {
        const currentPost = await models.Post.findByPk(this._postID);

        currentPost.title = this._title;
        currentPost.bodyText = this._body;
        currentPost.mediaURL = this._mediaURL;
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


    get title() {
        return this._title;
    }

    set title(value) {
        if (typeof value === "string") {
            this._title = value;
        }
        else {
            throw new Error(`${value} is not a string`);
        }
    }

    get body() {
        return this._body;
    }

    set body(value) {
        if (typeof value === "string") {
            this._body = value;
        }
        else {
            throw new Error(`${value} is not a string`);
        }
    }

    get mediaURL() {
        return this._mediaURL;
    }

    set mediaURL(value) {
        this._mediaURL.push(value);
    }
}

export default PostClass;