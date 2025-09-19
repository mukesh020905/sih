const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  title: { type: String },
  company: { type: String },
  location: { type: String },
  from: { type: Date },
  to: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },
});

const EducationSchema = new mongoose.Schema({
  degree: { type: String },
  institution: { type: String },
  fieldOfStudy: { type: String },
  from: { type: Date },
  to: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  projectUrl: { type: String },
  githubUrl: { type: String },
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  headline: {
    type: String,
  },
  bio: {
    type: String,
  },
  website: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  github: {
    type: String,
  },
  twitter: {
    type: String,
  },
  skills: [
    {
      type: String,
    },
  ],
  experience: [ExperienceSchema],
  education: [EducationSchema],
  projects: [ProjectSchema],
  certifications: [
    {
      type: String,
    },
  ],
  interests: [
    {
      type: String,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  isEnrolledInMentorship: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['Alumni', 'Student', 'Faculty'],
  },
  sentRequests: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
  receivedRequests: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
  connections: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model('User', UserSchema);