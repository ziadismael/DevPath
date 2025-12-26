import bcrypt from 'bcrypt';
import { models } from '../models/index.models.js';
import { Op } from 'sequelize';

export const viewProfile = async (req, res, next) => {
    try {
        let targetUser;

        // If username is provided in params, fetch that user
        if (req.params.username) {
            targetUser = await models.User.findOne({
                where: { username: req.params.username }
            });

            if (!targetUser) {
                const error = new Error('User not found.');
                error.status = 404;
                throw error;
            }
        } else {
            // Otherwise, return current user's profile
            targetUser = req.userRecord;
        }

        // Get followers and following with user details
        const followers = await targetUser.getFollowers({
            attributes: ['userID', 'username', 'firstName', 'lastName'],
            joinTableAttributes: []
        });

        const following = await targetUser.getFollowing({
            attributes: ['userID', 'username', 'firstName', 'lastName'],
            joinTableAttributes: []
        });

        res.status(200).json({
            userID: targetUser.userID,
            username: targetUser.username,
            firstName: targetUser.firstName,
            lastName: targetUser.lastName,
            email: targetUser.email,
            role: targetUser.role,
            university: targetUser.university,
            country: targetUser.country,
            followers: followers || [],
            following: following || []
        });
    }
    catch (error) {
        next(error);
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const currentUser = req.user;
        if (currentUser.getUsername() !== req.params.username) {
            return res.status(403).json({ error: "Forbidden" });
        }

        // Allowed fields to update
        const { firstName, lastName, email, username, password, university, country } = req.body;

        // Update only if provided
        if (firstName) currentUser.firstName = firstName;
        if (lastName) currentUser.lastName = lastName;
        // Only call setEmail if email is different from current email
        if (email && email !== currentUser.getEmail()) await currentUser.setEmail(email);
        // Only call setUsername if username is different from current username
        if (username && username !== currentUser.getUsername()) await currentUser.setUsername(username);
        if (university !== undefined) currentUser.university = university;
        if (country !== undefined) currentUser.country = country;
        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            currentUser.setPassword(hashed);
        }
        await currentUser.saveUpdates();

        return res.status(200).json({
            username: currentUser.getUsername(),
            email: currentUser.getEmail(),
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            userID: currentUser.userID,
            role: currentUser.role,
            university: currentUser.university,
            country: currentUser.country,
        })
    }
    catch (error) {
        next(error);
    }
}

export const getAllUsers = async (req, res, next) => {
    try {
        const { search } = req.query;

        let whereClause = {};
        if (search) {
            whereClause = {
                username: {
                    [Op.iLike]: `%${search}%`
                }
            };
        }

        const usersList = await models.User.findAll({
            where: whereClause,
            attributes: ['userID', 'username', 'firstName', 'lastName'],
            limit: 10
        });

        res.status(200).json(usersList);
    }
    catch (error) {
        next(error);
    }
}

export const followUser = async (req, res, next) => {
    try {
        const userToFollowRecord = await models.User.findOne({ where: { username: req.params.username } });

        if (!userToFollowRecord) {
            const error = new Error('User not found.');
            error.status = 404;
            throw error;
        }

        await req.user.follow(userToFollowRecord, req.userRecord);

        res.status(200).json({ success: true, message: `You are now following ${req.params.username}.` });
    } catch (error) {
        next(error);
    }
};

export const unfollowUser = async (req, res, next) => {
    try {
        const userToUnfollowRecord = await models.User.findOne({ where: { username: req.params.username } });

        if (!userToUnfollowRecord) {
            const error = new Error('User not found.');
            error.status = 404;
            throw error;
        }

        await req.user.unfollow(userToUnfollowRecord, req.userRecord);

        res.status(200).json({ success: true, message: `You have unfollowed ${req.params.username}.` });
    } catch (error) {
        next(error);
    }
};
