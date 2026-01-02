/**
 * Daniel_AI Data Core: Versioning System
 * Handles immutable storage and history of data objects.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class VersionControl {
    constructor() {
        this.vaultDir = path.join(__dirname, '../../data/vault');
        this.historyDir = path.join(__dirname, '../../data/history');

        if (!fs.existsSync(this.vaultDir)) fs.mkdirSync(this.vaultDir, { recursive: true });
        if (!fs.existsSync(this.historyDir)) fs.mkdirSync(this.historyDir, { recursive: true });
    }

    /**
     * Commits a new version of a data object.
     * @param {string} id Unique identifier for the object
     * @param {object} data The object content
     */
    commit(id, data) {
        const filePath = path.join(this.vaultDir, `${id}.json`);
        let version = 1;

        // If file exists, move old version to history
        if (fs.existsSync(filePath)) {
            const oldDataRaw = fs.readFileSync(filePath, 'utf8');
            const oldData = JSON.parse(oldDataRaw);
            version = (oldData._version || 0) + 1;

            const historyPath = path.join(this.historyDir, `${id}.v${oldData._version}.json`);
            fs.writeFileSync(historyPath, oldDataRaw);
        }

        const commitData = {
            ...data,
            _id: id,
            _version: version,
            _timestamp: new Date().toISOString(),
            _hash: this.calculateHash(data)
        };

        fs.writeFileSync(filePath, JSON.stringify(commitData, null, 2));
        return commitData;
    }

    /**
     * Retrieves the latest version of an object.
     * @param {string} id 
     */
    checkout(id) {
        const filePath = path.join(this.vaultDir, `${id}.json`);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Data Object '${id}' not found.`);
        }
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    /**
     * Retrieves a specific version from history.
     */
    getHistory(id, version) {
        const historyPath = path.join(this.historyDir, `${id}.v${version}.json`);
        if (!fs.existsSync(historyPath)) {
            throw new Error(`Version ${version} of object '${id}' not found in history.`);
        }
        return JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    }

    calculateHash(data) {
        return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    }
}

module.exports = new VersionControl();
