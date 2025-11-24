import mongoose from 'mongoose';

const jobPreferenceSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true,
    unique: true
  },
  preferredLocations: [{
    type: String,
    trim: true
  }],
  salaryRange: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    }
  },
  jobTypes: [{
    type: String,
    enum: ['Full-time', 'Part-time', 'Remote', 'Freelance', 'Internship']
  }],
  experienceLevels: [{
    type: String,
    enum: ['Intern', 'Junior', 'Middle', 'Senior', 'Lead']
  }],
  companyTypes: [{
    type: String,
    enum: ['Product', 'Outsourcing', 'Startup', 'Enterprise', 'Agency']
  }],
  industries: [{
    type: String,
    trim: true
  }],
  preferredSkills: [{
    type: String,
    trim: true
  }],
  willingToRelocate: {
    type: Boolean,
    default: false
  },
  receiveRecommendations: {
    type: Boolean,
    default: true
  },
  notificationFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'never'],
    default: 'weekly'
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh
jobPreferenceSchema.index({ candidateId: 1 });

export default mongoose.model('JobPreference', jobPreferenceSchema);
