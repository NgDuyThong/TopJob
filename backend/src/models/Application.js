import mongoose from "mongoose";

const viewHistorySchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const statusSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Submitted', 'Reviewed', 'Interviewed', 'Rejected', 'Hired'],
    default: 'Submitted'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const jobSummarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  employerName: {
    type: String,
    required: true
  }
}, { _id: false });

const candidateSummarySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  jobpostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPost',
    required: true
  },
  resumeFile: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String
  },
  submitDate: {
    type: Date,
    default: Date.now
  },
  status: statusSchema,
  viewedHistory: [viewHistorySchema],
  jobSummary: jobSummarySchema,
  candidateSummary: candidateSummarySchema
});

// Middleware để cập nhật thời gian khi thay đổi trạng thái
applicationSchema.pre('save', function(next) {
  if (this.isModified('status.name')) {
    this.status.updatedAt = new Date();
  }
  next();
});

export default mongoose.model('Application', applicationSchema);