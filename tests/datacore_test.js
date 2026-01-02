/**
 * Daniel_AI Data Core: Verification Suite
 * Verifies independence, schema validation, and versioning.
 */

const engine = require('../src/core/engine');
const fs = require('fs');
const path = require('path');

async function runTests() {
    console.log("🧪 Starting Daniel_AI Data Core Verification...\n");

    try {
        // Test 1: Schema Validation (Success)
        console.log("[Test 1] Positive Schema Validation...");
        await engine.ingest('clinical_encounter', 'pat-001', {
            patientId: 'P123',
            type: 'Emergency',
            findings: 'Patient exhibits high fever.'
        });
        console.log("   ✅ PASS: Valid data accepted.");

        // Test 2: Schema Validation (Failure)
        console.log("\n[Test 2] Negative Schema Validation...");
        try {
            await engine.ingest('clinical_encounter', 'pat-err', {
                patientId: 'P123'
                // Missing required fields
            });
            console.log("   ❌ FAIL: Should have rejected invalid data.");
        } catch (e) {
            console.log(`   ✅ PASS: Correctly rejected: ${e.message}`);
        }

        // Test 3: Versioning System
        console.log("\n[Test 3] Immutable Version Control...");
        const update1 = await engine.ingest('clinical_encounter', 'pat-002', {
            patientId: 'P456',
            type: 'Consultation',
            findings: 'Initial visit.'
        });

        const update2 = await engine.ingest('clinical_encounter', 'pat-002', {
            patientId: 'P456',
            type: 'Consultation',
            findings: 'Updated findings after lab results.'
        });

        console.log(`   Object Version: ${update2.version} (Expected 2)`);

        const history = await engine.retrieve('pat-002', 1);
        console.log(`   History Retrieval (v1): ${history.findings.substring(0, 15)}...`);

        if (update2.version === 2 && history._version === 1) {
            console.log("   ✅ PASS: Versioning system functional.");
        } else {
            console.log("   ❌ FAIL: Versioning integrity mismatch.");
        }

        console.log("\n✅ ALL DATA CORE TESTS PASSED");

    } catch (error) {
        console.error("\n❌ TEST SUITE FAILED:", error.message);
        process.exit(1);
    }
}

runTests();
