/**
 * Daniel_AI Data Core: Secure Ports API
 * Exposes the Data Core functionality via REST.
 */

const express = require('express');
const engine = require('../core/engine');
const path = require('path');

const app = express();
const PORT = process.env.DATA_CORE_PORT || 4000;

app.use(express.json());

// --- Health Port ---
app.get('/health', (req, res) => {
    res.json({
        module: 'Daniel_AI_DataCore',
        status: 'ONLINE',
        storage: 'LOCAL_FS',
        capabilities: ['SchemaValidation', 'ImmutableVersioning']
    });
});

// --- Ingestion Port ---
app.post('/api/data/ingest', async (req, res) => {
    const { schema, id, payload } = req.body;

    if (!schema || !id || !payload) {
        return res.status(400).json({ error: 'Missing schema, id, or payload' });
    }

    try {
        const result = await engine.ingest(schema, id, payload);
        res.status(201).json(result);
    } catch (error) {
        console.error(`[DataCore API] Ingestion failed: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
});

// --- Retrieval Port ---
app.get('/api/data/retrieve/:id', async (req, res) => {
    const { id } = req.params;
    const { v } = req.query; // Version param

    try {
        const result = await engine.retrieve(id, v ? parseInt(v) : null);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Daniel_AI Data Core ONLINE`);
    console.log(`📡 Independent Port active on: http://localhost:${PORT}\n`);
});
