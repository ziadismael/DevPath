import bcrypt from 'bcrypt';

export const viewProfile = async (req, res, next) => {
    try {
        const currentUser = req.user;

        res.status(200).json({
            username: currentUser.getUsername(),
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            posts: currentUser.posts,
            projects: await currentUser.getProjects()
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
        const { firstName, lastName, email, username, password } = req.body;

        // Update only if provided
        if (firstName) currentUser.firstName = firstName;
        if (lastName) currentUser.lastName = lastName;
        if (email) await currentUser.setEmail(email);
        if (username) await currentUser.setUsername(username);
        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            currentUser.setPassword(hashed);
        }
        currentUser.saveUpdates();

        return res.status(200).json({
            username: currentUser.getUsername(),
            email: currentUser.getEmail(),
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            userID: currentUser.userID,
            role: currentUser.role,
        })
    }
    catch (error) {
        next(error);
    }
}

