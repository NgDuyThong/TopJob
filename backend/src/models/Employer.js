import mongoose from "mongoose";

const jobPostSummarySchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPost',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  }
}, { _id: false });

const employerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  field: {
    type: String,
    required: false,
    trim: true,
    default: ''
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
  address: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    required: false,
    default: ''
  },
  companySize: {
    type: String,
    enum: ['1-10 nhân viên', '10-50 nhân viên', '50-100 nhân viên', '100-500 nhân viên', '500+ nhân viên'],
    default: '1-10 nhân viên'
  },
  website: {
    type: String,
    trim: true,
    default: ''
  },
  savedCandidates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate'
  }],
  jobPosts: [jobPostSummarySchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Employer', employerSchema);