const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CourseContent = sequelize.define('CourseContent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('video', 'document', 'assignment', 'quiz', 'text'),
    allowNull: false
  },
  fileUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes for videos
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  isFree: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'course_content',
  timestamps: true
});

module.exports = CourseContent;

