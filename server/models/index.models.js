import User from "./Sequalize/User.model.js";
import Project from "./Sequalize/Project.model.js";
import TeamMember from "./Sequalize/TeamMember.model.js";
import Team from "./Sequalize/Team.model.js";
import Interview from "./Sequalize/Interview.model.js";
import Post from "./Sequalize/Post.model.js";
import Comment from "./Sequalize/Comment.model.js";
import Internship from "./Sequalize/Internship.model.js";
import Application from "./Sequalize/Application.model.js";
import Question from "./Sequalize/Question.model.js";
import Follows from "./Sequalize/Follows.model.js";
import Like from "./Sequalize/Like.model.js";

// Associations and Relationships
// Explicitly define the foreign keys for the Team/User relationship to prevent UserUserID/TeamTeamID.
User.belongsToMany(Team, { through: TeamMember, foreignKey: 'userID' });
Team.belongsToMany(User, { through: TeamMember, foreignKey: 'teamID' });

Team.hasMany(Project, { foreignKey: 'teamID' });
Project.belongsTo(Team, { foreignKey: 'teamID' });

User.hasMany(Interview, { foreignKey: 'userID' });
Interview.belongsTo(User, { foreignKey: 'userID' });

User.hasMany(Post, { foreignKey: 'userID' });
Post.belongsTo(User, { foreignKey: 'userID' });

User.hasMany(Comment, { foreignKey: 'userID' });
Comment.belongsTo(User, { foreignKey: 'userID' });

Post.hasMany(Comment, { foreignKey: 'postID' });
Comment.belongsTo(Post, { foreignKey: 'postID' });

// Like associations
User.belongsToMany(Post, { through: Like, foreignKey: 'userID', as: 'LikedPosts' });
Post.belongsToMany(User, { through: Like, foreignKey: 'postID', as: 'LikedByUsers' });

User.belongsToMany(Internship, { through: Application });
Internship.belongsToMany(User, { through: Application });

User.belongsToMany(User, {
    as: "Following",
    through: Follows,
    foreignKey: 'followerID',
    otherKey: 'followingID',
});
User.belongsTo(User, {
    as: "Followers",
    through: Follows,
    foreignKey: 'followingID',
    otherKey: 'followerID',
});

export const models = {
    User,
    Project,
    Team,
    TeamMember,
    Interview,
    Post,
    Comment,
    Internship,
    Application,
    Question,
    Follows,
    Like,
}