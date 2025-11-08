import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced'],
    required: true
  }
}, { _id: false });

const candidateSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  gender: {
    type: String,
    required: false,
    default: ''
  },
  birthDate: {
    type: Date,
    required: false
  },
  education: {
    type: String,
    required: false,
    default: ''
  },
  experience: {
    type: String,
    required: false,
    default: ''
  },
  skills: [skillSchema],
  summary: {
    type: String,
    required: false,
    default: ''
  },
  // CV Builder fields
  cv: {
    personal: {
      address: String,
      linkedin: String,
      github: String,
      website: String
    },
    experience: [{
      company: String,
      position: String,
      location: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      description: String
    }],
    education: [{
      institution: String,
      degree: String,
      field: String,
      startDate: String,
      endDate: String,
      gpa: String,
      description: String
    }],
    projects: [{
      name: String,
      description: String,
      technologies: String,
      url: String,
      startDate: String,
      endDate: String
    }],
    languages: [{
      language: String,
      proficiency: String
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: String,
      credentialId: String,
      url: String
    }]
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],
  savedJobs: [{
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPost'
    },
    savedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Candidate', candidateSchema);