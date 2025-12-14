const { sequelize } = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const Subscription = require('./Subscription');
const CourseContent = require('./CourseContent');
const Payment = require('./Payment');

// Define associations
User.hasMany(Course, { foreignKey: 'teacherId', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

Course.hasMany(CourseContent, { foreignKey: 'courseId', as: 'content' });
CourseContent.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

User.belongsToMany(Course, { 
  through: Subscription, 
  foreignKey: 'studentId',
  as: 'subscribedCourses' 
});
Course.belongsToMany(User, { 
  through: Subscription, 
  foreignKey: 'courseId',
  as: 'subscribers' 
});

User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Course.hasMany(Payment, { foreignKey: 'courseId', as: 'payments' });
Payment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

module.exports = {
  sequelize,
  User,
  Course,
  Subscription,
  CourseContent,
  Payment
};

