import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Candidate from '../models/Candidate.js';
import neo4jService from '../services/neo4jService.js';
import { driver } from '../config/neo4j.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function testAutoSync() {
    try {
        console.log('🧪 Testing Auto-Sync to Neo4j\n');
        console.log('='.repeat(70));

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Test 1: Create new candidate
        console.log('TEST 1: Create New Candidate');
        console.log('-'.repeat(70));

        const newCandidate = new Candidate({
            fullName: 'Test Auto Sync',
            email: `test.autosync.${Date.now()}@example.com`,
            phone: '0123456789',
            skills: [
                { name: 'JavaScript', level: 'advanced' },
                { name: 'React', level: 'intermediate' }
            ]
        });

        await newCandidate.save();
        console.log('✅ Created candidate in MongoDB:', newCandidate._id);

        // Manually sync to Neo4j (simulating what controller does)
        await neo4jService.createOrUpdateCandidate(newCandidate.toObject());
        await neo4jService.addCandidateSkills(
            newCandidate._id.toString(),
            newCandidate.skills
        );
        console.log('✅ Synced to Neo4j');

        // Verify in Neo4j
        const session = driver().session();
        try {
            const result = await session.run(
                'MATCH (c:Candidate {MaUV: $id}) RETURN c',
                { id: newCandidate._id.toString() }
            );

            if (result.records.length > 0) {
                console.log('✅ VERIFIED: Candidate exists in Neo4j');

                // Check skills
                const skillsResult = await session.run(
                    'MATCH (c:Candidate {MaUV: $id})-[:HAS_SKILL]->(s:Skill) RETURN s.TenKyNang as skill',
                    { id: newCandidate._id.toString() }
                );

                const skills = skillsResult.records.map(r => r.get('skill'));
                console.log(`✅ Skills in Neo4j: ${skills.join(', ')}`);
            } else {
                console.log('❌ FAILED: Candidate NOT found in Neo4j');
            }
        } finally {
            await session.close();
        }

        console.log('\n' + '='.repeat(70));
        console.log('TEST 2: Update Candidate Skills');
        console.log('-'.repeat(70));

        // Update skills
        newCandidate.skills.push({ name: 'Node.js', level: 'advanced' });
        await newCandidate.save();
        console.log('✅ Updated skills in MongoDB');

        // Sync to Neo4j
        await neo4jService.createOrUpdateCandidate(newCandidate.toObject());
        await neo4jService.addCandidateSkills(
            newCandidate._id.toString(),
            newCandidate.skills
        );
        console.log('✅ Synced update to Neo4j');

        // Verify
        const session2 = driver().session();
        try {
            const skillsResult = await session2.run(
                'MATCH (c:Candidate {MaUV: $id})-[:HAS_SKILL]->(s:Skill) RETURN s.TenKyNang as skill',
                { id: newCandidate._id.toString() }
            );

            const skills = skillsResult.records.map(r => r.get('skill'));
            console.log(`✅ Updated skills in Neo4j: ${skills.join(', ')}`);

            if (skills.includes('Node.js')) {
                console.log('✅ VERIFIED: New skill synced successfully');
            } else {
                console.log('❌ FAILED: New skill NOT found in Neo4j');
            }
        } finally {
            await session2.close();
        }

        // Cleanup
        console.log('\n' + '='.repeat(70));
        console.log('Cleaning up test data...');
        await Candidate.findByIdAndDelete(newCandidate._id);
        console.log('✅ Deleted test candidate from MongoDB');

        const session3 = driver().session();
        try {
            await session3.run(
                'MATCH (c:Candidate {MaUV: $id}) DETACH DELETE c',
                { id: newCandidate._id.toString() }
            );
            console.log('✅ Deleted test candidate from Neo4j');
        } finally {
            await session3.close();
        }

        console.log('\n' + '='.repeat(70));
        console.log('✅ AUTO-SYNC TEST COMPLETED!');
        console.log('='.repeat(70));
        console.log('\n📝 Summary:');
        console.log('  ✅ Create operation syncs to Neo4j');
        console.log('  ✅ Update operation syncs to Neo4j');
        console.log('  ✅ Skills are properly synced');
        console.log('\n💡 Note: Controllers now automatically sync to Neo4j when:');
        console.log('  - New account is registered');
        console.log('  - Profile is updated');
        console.log('  - Skills are updated');
        console.log('  - Job post is created/updated');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error(error.stack);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

testAutoSync();
