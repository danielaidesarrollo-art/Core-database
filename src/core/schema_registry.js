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

        return true;
    }

    addSchema(name, definition) {
        this.schemas[name] = definition;
    }
}

module.exports = new SchemaRegistry();
