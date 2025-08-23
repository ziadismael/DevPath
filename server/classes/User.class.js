import {User} from '../models/Sequalize/User.model.js'
import {models} from "../models/index.models.js";


class UserClass {
    constructor (firstName, lastName, email, username, hashedPassword) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
        this._username = username;
        // await this.setEmail(email);
        // await this.setUsername(username);
        this.password = hashedPassword;
        // store hashed password in DB
        // await saveUserDB();
    }

    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        if (typeof value !== "string"){
            throw new Error("First name must be a string.");
        }
        value = value.trim();
        if (value.length < 2 || value.length > 50){
            throw new Error("First name must be between 2 and 50 characters.");
        }
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
        if (value.length < 2 || value.length > 50){
            throw new Error("Last name must be between 2 and 50 characters.");
        }
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

// Password Setter/ Getter


    saveUserDB () {
        const newUser = User.create({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.getEmail(),
            username: this.getUsername(),
            password: this.getPassword(),
        })
        console.log("user created successfully.", newUser.toJSON());
    }

}

class SWUserClass extends UserClass {
    constructor(firstName, lastName, email, username, hashedPassword) {
        super(firstName, lastName, email, username, hashedPassword);
        this.role = "User"
    }
}


class AdminClass extends UserClass {
    constructor(firstName, lastName, email, username, hashedPassword) {
        super(firstName, lastName, email, username, hashedPassword);
        this.role = "Admin";
    }
    // Create Internships and delete them
}
export default UserClass;





