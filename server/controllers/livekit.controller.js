// server/controllers/livekit.controller.js
import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';
dotenv.config();

const createToken = async (req, res) => {
    // 1. Get User Info from Query Params (matching VideoRoom.tsx Fetch)
    const { roomName, participantName } = req.query;

    if (!roomName || !participantName) {
        return res.status(400).json({ error: 'Missing required query parameters: roomName, participantName' });
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