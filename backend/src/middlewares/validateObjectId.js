import mongoose from 'mongoose';

// Factory to validate a param as a Mongo ObjectId
export const validateObjectId = (paramName) => (req, res, next) => {
  const value = req.params[paramName];
  if (!value) return next();

  if (!mongoose.isValidObjectId(value)) {
    return res.status(400).json({
      status: 'error',
      message: `Invalid ObjectId for param '${paramName}': ${value}`
    });
  }

  next();
};

export default validateObjectId;
