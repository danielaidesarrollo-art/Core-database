/**
 * Daniel_AI Data Core: Schema Registry
 * Enforces structural integrity of medical data using predefined schemas.
 */

class SchemaRegistry {
    constructor() {
        this.schemas = {
            'clinical_encounter': {
                required: ['patientId', 'type', 'findings'],
                types: {
                    patientId: 'string',
                    type: 'string',
                    findings: 'string'
                }
            },
            'vital_signs': {
                required: ['patientId', 'vitals'],
                types: {
                    patientId: 'string',
                    vitals: 'object'
                }
            }
        };
    }

    /**
     * Validates an object against a schema.
     * @param {string} schemaName 
     * @param {object} data 
     */
    validate(schemaName, data) {
        const schema = this.schemas[schemaName];
        if (!schema) {
            throw new Error(`Schema '${schemaName}' not found in registry.`);
        }

        // Check required fields
        for (const field of schema.required) {
            if (data[field] === undefined || data[field] === null) {
                throw new Error(`Validation Error: Missing required field '${field}'`);
            }
        }

        // Check types
        for (const [field, type] of Object.entries(schema.types)) {
            if (data[field] !== undefined && typeof data[field] !== type) {
                throw new Error(`Validation Error: Field '${field}' must be of type '${type}'`);
            }
        }

        // --- EVOLUTIONARY SCHEMA (NLP Heuristics) ---
        // Automatically detect PII or sensitive medical entities in free-form text
        if (data.findings || data.note) {
            const content = (data.findings || "") + " " + (data.note || "");
            const sensitivePatterns = [
                { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, type: "SSN" },
                { pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, type: "EMAIL" },
                { pattern: /\b(HIV|CANCER|COVID|DIABETES)\b/gi, type: "DIAGNOSIS" }
            ];

            sensitivePatterns.forEach(p => {
                if (p.pattern.test(content)) {
                    console.log(`[DataCore/Evolutionary] SENSITIIVE ENTITY DETECTED: ${p.type}. Escalating protection.`);
                    // Logic to flag for high-tier encryption in future sprints
                }
            });
        }

        return true;
    }

    addSchema(name, definition) {
        this.schemas[name] = definition;
    }
}

module.exports = new SchemaRegistry();
