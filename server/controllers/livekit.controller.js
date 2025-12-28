// server/controllers/livekit.controller.js
import { AccessToken } from 'livekit-server-sdk';
import { models } from '../models/index.models.js';
import dotenv from 'dotenv';
dotenv.config();

const createToken = async (req, res) => {
    // 1. Get User Info from Query Params (matching VideoRoom.tsx Fetch)
    const { roomName, participantName } = req.query;

    if (!roomName || !participantName) {
        return res.status(400).json({ error: 'Missing required query parameters: roomName, participantName' });
    }

    // 1b. Check Usage Limit (Free Launch Cap)
    try {
        // Find user by username to get ID
        const user = await models.User.findOne({ where: { username: participantName } });

        if (!user) {
            return res.status(404).json({ error: 'User not found in database' });
        }

        const interviewCount = await models.Interview.count({ where: { userID: user.userID } });

        if (interviewCount > 0) {
            // Rejection: Already interviewed
            return res.status(403).json({ error: 'Free limit reached. You have already used your 1 free interview.' });
        }

        // Create the "Ticket" immediately to mark usage
        await models.Interview.create({
            userID: user.userID,
            typeOfInterview: "Tech", // Default, will be updated by Agent or user later optionally
            score: 0
        });

    } catch (dbError) {
        console.error("Database error checking limits:", dbError);
        // Fallback: Allow if DB fails? Or Deny? Deny for safety.
        return res.status(500).json({ error: 'Failed to verify usage limits.' });
    }

    // 2. Create Access Token
    const at = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {
            identity: participantName,
            ttl: '10m',
        }
    );

    // 3. Give permissions
    at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true
    });

    // 4. Return the JWT String and URL (Frontend expects 'url' too for serverUrl)
    const token = await at.toJwt();
    res.json({
        token,
        url: process.env.LIVEKIT_URL // Frontend needs this to connect
    });
};

export { createToken };