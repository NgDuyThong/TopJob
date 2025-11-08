import express from 'express';
import {
  getRecommendedJobsNeo4j,
  getMatchingCandidatesNeo4j,
  comparePerformance
} from '../controllers/neo4jComparisonController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * ROUTES SO SÁNH MongoDB vs Neo4j
 */

// Candidate: Recommended Jobs (Neo4j version)
router.get('/neo4j/candidate/recommended-jobs', verifyToken, getRecommendedJobsNeo4j);

// Employer: Matching Candidates (Neo4j version)
router.get('/neo4j/employer/matching-candidates/:jobId', verifyToken, getMatchingCandidatesNeo4j);

// Performance Comparison
router.get('/compare/performance', verifyToken, comparePerformance);

export default router;
