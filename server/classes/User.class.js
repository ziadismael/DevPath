import {models} from "../models/index.models.js";
import ProjectClass from "../classes/Project.class.js"
import PostClass from "./Post.class.js";

export class UserClass {
    constructor (userData) {
        this._firstName = userData.firstName;
        this._lastName = userData.lastName;
        this._fullName = userData.fullName;
        this._email = userData.email;
        this._username = userData.username;
        this._password = userData.password;
        this._userID = userData.userID;
        this._posts = [];
    }

    // Rehydrate by ID
    static async findById(userID) {
        const userRecord = await models.User.findByPk(userID);
        return userRecord ? UserClass._createInstance(userRecord) : null;
    }

    // Rehydrate by username
    static async findByUsername(username) {
        const userRecord = await models.User.findOne({ where: { username } });
        return userRecord ? UserClass._createInstance(userRecord) : null;
    }

    // Factory Pattern Applied
    static _createInstance(userRecord) {
        const userData = userRecord.toJSON();
        if (userData.role === "Admin") {
            const user = new AdminClass(userData);
            user._userID = userRecord.userID;
            return user;
        }

        const user = new RegularUserClass(userData);
        user._userID = userRecord.userID;
        return user;
    }

    async writePost(title, body, mediaURL) {
        const currentPost = new PostClass(title, body ,this._userID);
        if (mediaURL) {
            currentPost.mediaURL = mediaURL;
        }
        await currentPost.saveToDB();
    }

    async deletePost(postID) {
        const currentPost = await PostClass.findById(postID);
        if (!currentPost) {
            throw new Error(`Post with the id ${postID} not found`);
        }

        if (currentPost.authorID !== this._userID && this._role !== "Admin") {
            throw new Error("You are not authorized to delete this post");
        }

        await currentPost.deleteProject();
    }

    // Encapsulation/ Abstraction Principles applied  for Getters/Setters
    async getPosts() {
        const posts = await models.Post.findAll({where: {authorID: this._userID}});
        posts.forEach(post => {
            this._posts.push(post);
        })
        return this._posts;
    }

    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        if (typeof value !== "string"){
            throw new Error("First name must be a string.");
        }
        value = value.trim();
        if (!/^[A-Za-z]+$/.test(value)){
            throw new Error("First name must only contain letters.");
        }
        this._firstName = value;
    }

    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        if (typeof value !== "string"){
            throw new Error("First name must be a string.");
        }
        value = value.trim();
        if (!/^[A-Za-z]+$/.test(value)){
            throw new Error("Last name must only contain letters.");
        }
        this._lastName = value;
    }

    async setEmail (value) {
        if (typeof value !== "string"){
            throw new Error("Email must be a string.");
        }
        value = value.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)){
            throw new Error("Email must be a valid email format.");
        }
        const existingUser = await models.User.findOne({ where: { email: value } });
        if (existingUser){
            throw new Error("Email already exists");
        }
        this._email = value;
    }

    getEmail () {
        return this._email;
    }

    async setUsername(value) {
        if (typeof value !== "string"){
            throw new Error("username must be a string.");
        }
        value = value.trim();
        const existingUser = await models.User.findOne({ where: { username: value } });
        if (existingUser){
            throw new Error("username already exists");
        }
        this._username = value;
    }

    getUsername() {
        return this._username;
    }

    get userID() {
        return this._userID;
    }

// Password Setter/ Getter
    getPassword() {
        return this._password;
    }

    setPassword(value) {
        if (typeof value !== "string"){
            throw new Error("Password must be a string.");
        }
        this._password = value;
    }

    async saveUserDB () {
        try {
            const newUser = await models.User.create({
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.getEmail(),
                username: this.getUsername(),
                password: this.getPassword(),
            })
            console.log("user created successfully.", newUser.toJSON());
            this._userID = newUser.userID;
        }
        catch (error) {
            console.error("Error saving the user to the DB:", error);
            throw error;
        }
    }

    async getUser(username){
        const currentUser = await models.User.findOne({username: username});
        if(!currentUser){
            throw new Error("User not found");
        }
        return currentUser;
    }
}

// Inheritance Principle Applied
export class RegularUserClass extends UserClass {
    constructor(userData) {
        super(userData);
        this._role = "User";
        this._projects = [];
        this._following = [];
        this._followers = [];
    }

    async follow(username){
        const userToFollow = await UserClass.findByUsername(username);
        const currentUser = await UserClass.findByUsername(this._username);
        const isFollowing = await userToFollow.hasFollowing(currentUser)
        if(isFollowing){
           console.log(`You already are following user ${userToFollow.username}.`);
        }
        currentUser.addFollowing(userToFollow);
    }

    async unfollow(username){
        const userToFollow = await UserClass.findByUsername(username);
        const currentUser = await UserClass.findByUsername(this._username);
        const isFollowing = await userToFollow.hasFollowing(currentUser)
        if(!isFollowing){
            console.log(`You are not following user ${userToFollow.username}.`);
        }
        currentUser.removeFollowing(userToFollow);
    }

    async getProjects () {
        const projects = await models.Project.findAll({
            include: {
                model: models.Team,
                include: {
                    model: models.User,
                    where: { id: this._userID } // only teams that include this user
                }
            }
        });
        projects.forEach(project => {
            this._projects.push(project);
        })
        return this._projects;
    }

    async addProject(name, repoLink, teamID) {
        if (!teamID) {
            let team = await models.Team.findOne({
                where: { isPersonal: true },
                include: {
                    model: models.User,
                    where: { id: this._userID }
                }
            });

            if (!team) {
                team = await models.Team.create({
                    name: `${this._username}'s Personal Projects`,
                    isPersonal: true
                });
                await models.TeamMember.create({
                    teamID: team.id,
                    userID: this._userID
                });
            }
            teamID = team.teamID;
        }
        const project = new ProjectClass(name);
        await project.setTeam(teamID);
        if (repoLink) {
            await project.setGitHubRepo(repoLink);
        }
        await project.saveToDB();
    }

    async deleteProject(projectID) {
        const currentProject = await ProjectClass.findById(projectID);
        if (!currentProject) {
            throw new Error(`Project with the id ${projectID} not found`);
        }

        const currentTeam = await models.Team.findByPk(currentProject.teamID, {
            include: {
                model: models.User,
                where: { userID: this._userID }
            }
        });

        if (!currentTeam) {
            throw new Error("You are not authorized to delete this project");
        }

        await currentProject.deleteProject();

    }

    async applyToInternship (internshipID) {
        const internship = await models.Internship.findByPk(internshipID);
        if (internship){
            await models.Application.create({
                status: 'Applied',
                internshipID,
                userID: this._userID,
            });
        }
    }
    get role(){
        return this._role;
    }
}


export class AdminClass extends UserClass {
    constructor(userData) {
        super(userData);
        this._role = "Admin";
    }


    async banUser(userID) {
        const bannedUser = await models.User.findByPk(userID);
        if (bannedUser){
            await bannedUser.destroy();
            console.log(`User ${userID} banned,`);
        }
        console.log("No user with the userID: ", userID);
    }

    get role(){
        return this._role;
    }
}






