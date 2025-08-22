import User from "./Sequalize/User.model.js";
import Project from "./Sequalize/Project.model.js";
import TeamMember from "./Sequalize/TeamMember.model.js";
import Team from "./Sequalize/Team.model.js";
import Interview from "./Sequalize/Interview.model.js";
import Post from "./Sequalize/Post.model.js";
import Comment from "./Sequalize/Comment.model.js";


// Associations and Relationships
User.belongsToMany(Team, {through: TeamMember});
Team.belongsToMany(User, {through: TeamMember});

Team.hasMany(Project, {foreignKey: 'teamID'});
Project.belongsTo(Team, {foreignKey: 'teamID'});

User.hasMany(Interview, {foreignKey: 'userID'});
Interview.belongsTo(User, {foreignKey: 'userID'});

User.hasMany(Post, {foreignKey: 'userID'});
Post.belongsTo(User, {foreignKey: 'userID'});

User.hasMany(Comment, {foreignKey: 'userID'});
Comment.belongsTo(User, {foreignKey: 'userID'});

Post.hasMany(Comment, {foreignKey: 'postID'});
Comment.belongsTo(Post, {foreignKey: 'postID'});

export const models = {
    User,
    Project,
    Team,
    TeamMember,
    Interview,
    Post,
    Comment,
}