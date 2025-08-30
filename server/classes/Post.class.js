import {models} from "../models/index.models.js";
import * as console from "node:console";

class Post {
    constructor(title, body, mediaURL, authorID){
        this._postID = null;
        this._userID = authorID;
        this._title = title;
        this._body = body;
        this._mediaURL = [];
        this._mediaURL.push(mediaURL);
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

export default Post;