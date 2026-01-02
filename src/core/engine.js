/**
 * Daniel_AI Data Core: Core Engine
 * Coordinates data lifecycle: Validation -> Versioning -> Persistence.
 */

const schemaRegistry = require('./schema_registry');
const versionControl = require('./version_control');

class CoreEngine {
    /**
     * Ingests a clinical record.
     * @param {string} schemaName 
     * @param {string} id 
     * @param {object} payload 
     */
    async ingest(schemaName, id, payload) {
        console.log(`[DataCore] Ingesting record: ${id} (Schema: ${schemaName})`);

        // 1. Structural Validation
        schemaRegistry.validate(schemaName, payload);

        // 2. Commit to Immutable Storage
        const result = versionControl.commit(id, payload);

        return {
            status: 'COMMITTED',
            id: result._id,
            version: result._version,
            timestamp: result._timestamp
        };
    }

    /**
     * Retrieves a record.
     * @param {string} id 
     * @param {number} version (Optional)
     */
    async retrieve(id, version = null) {
        if (version) {
            return versionControl.getHistory(id, version);
        }
        return versionControl.checkout(id);
    }
}

module.exports = new CoreEngine();
