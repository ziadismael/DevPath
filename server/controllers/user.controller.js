
export const viewMyProfile = async (req, res, next) => {
    try {
        const currentUser = req.user;
        if (currentUser.getUsername() !== req.params.username) {
            return res.status(403).json({ error: "Forbidden" });
        }
        res.status(200).json({
            username: currentUser.getUsername(),
            email: currentUser.getEmail(),
            password: currentUser.getPassword(),
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            userID: currentUser.userID,
        });
    }
    catch (error) {
        next(error);
    }
}

