import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config/env.js";
import { UserClass } from "../classes/User.class.js";
import {models} from "../models/index.models.js";

export async function authorize(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Not Authorized" });

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("✅ Decoded Token:", decoded);
        const userRecord = await models.User.findByPk(decoded.userID);
        const user = await UserClass.findById(decoded.userID); // returns correct Admin/Regular class
        if (!user) {
            return res.status(401).json({message : "Not Authorized"});
        }
        req.user = user; // now controller has the class instance
        req.userRecord = userRecord;
        next();
    } catch (err) {
        console.error("Auth error:", err);
        res.status(401).json({ error: "Unauthorized" });
    }
}

export async function authorizeAdmin(req, res, next) {
    try {
        if (req.user.role !== "Admin") {
            const error = new Error("Forbidden: Admin access required");
            error.status = 403;
            throw error;
        }
        next();
    }
    catch (error) {
        console.error("Auth error:", error);
        res.status(401).json({ error: "Unauthorized" });
    }
}

export default authorize;