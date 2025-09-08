import {models} from '../models/index.models.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";
import {UserClass} from "../classes/User.class.js";


export const signup = async (req, res, next) => {
    try {
        // parameters for creating the user
        const { firstName, lastName, email, username, password } = req.body;

        // checking if username with the same username exists
        const existingUser = await models.User.findOne({ where: { username } });
        if (existingUser) {
            const error = new Error("Username already exists");
            error.status = 409;
            throw error;
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating the user and signing a token
        const newUser = await models.User.create({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
            role: "User",
        });

        const token = jwt.sign(
            { userID: newUser.id, role: newUser.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN },
        );

        res.status(201).json({
            message: "User Created Successfully",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
            token,
        });
    }
    catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Rehydrate the class
        const currentUser = await UserClass.findByUsername(username);
        if (!currentUser) {
            const error = new Error("Invalid Username");
            error.status = 404;
            throw error;
        }

        // Check if Password matching
        const isMatch = await bcrypt.compare(password, currentUser.getPassword());
        if (!isMatch) {
            const error = new Error("Invalid Password");
            error.status = 400;
            throw error;
        }

        // 4. Create JWT
        const token = jwt.sign(
            { userID: currentUser.userID, role: currentUser.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN || "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: currentUser.userID, username: currentUser.getUsername(), role: currentUser.role },
        });

    }
    catch (error) {
        next(error);
    }
}

export async function logout(req, res) {
    // For stateless JWT: just tell the client to drop the token
    res.json({ message: "Logout successful. Please delete token on client." });
}
