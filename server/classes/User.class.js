import {models} from "../models/index.models.js";

export class UserClass {
    constructor (firstName, lastName, email, username, hashedPassword) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
        this._username = username;
        this._password = hashedPassword;
        this._userID = null;
        // await this.setEmail(email);
        // await this.setUsername(username);
        // store hashed password in DB
        // await saveUserDB();
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

    // Factory
    static _createInstance(userRecord) {
        const { firstName, lastName, email, username, password, role } = userRecord;

        if (role === "Admin") {
            const user = new AdminClass(firstName, lastName, email, username, password);
            user._userID = userRecord.userID;
            return user;
        }

        const user = new RegularUserClass(firstName, lastName, email, username, password);
        user._userID = userRecord.userID;
        return user;
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
        const existingUser = await models.User.findOne({ email: value });
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
        const existingUser = await models.User.findOne({ username: value });
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

export class RegularUserClass extends UserClass {
    constructor(firstName, lastName, email, username, hashedPassword) {
        super(firstName, lastName, email, username, hashedPassword);
        this.role = "User"
    }

    applyToInternship (internshipID) {
        const internship = models.Internship.findOne(internshipID);
        if (internship){
           models.Application.create({
               status: 'Applied',
               internshipID,
               userID: this._userID,
           });
        }
    }
}


export class AdminClass extends UserClass {
    constructor(firstName, lastName, email, username, hashedPassword) {
        super(firstName, lastName, email, username, hashedPassword);
        this.role = "Admin";
    }


    banUser(userID) {
        const bannedUser = models.User.findOne({userID: userID});
        if (bannedUser){
            bannedUser.destroy();
            console.log("User banned with id ", userID);
        }
        console.log("No user with the userID: ", userID);
    }
}






