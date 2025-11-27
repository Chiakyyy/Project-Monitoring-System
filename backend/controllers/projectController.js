const db = require('../config/db');

exports.createProject = async (req, res) => {
    try {
        const { title, objective, budget, hardware, licenses, creator_id, file_path } = req.body;

        const sql = `INSERT INTO projects (title, objective, budget_estimated, hardware_needs, software_licenses, creator_id, file_path) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;

        // FIX: Capture the 'result' object from the query
        const [result] = await db.query(sql, [title, objective, budget, hardware, licenses, creator_id, file_path]);

        // FIX: Send back the 'insertId' (This is the new Project ID)
        res.status(201).json({
            message: 'Projet CPS créé avec succès',
            id: result.insertId
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllProjects = async (req, res) => {
    // For the "Vue globale" [cite: 10]
    try {
        const [rows] = await db.query('SELECT * FROM projects');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.validateProject = async (req, res) => {
    // Requirement: Chef de service validates or invalidates 
    try {
        const { id } = req.params;
        const { status } = req.body; // 'ACCEPTED' or 'INVALID'
        await db.query('UPDATE projects SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: `Projet mis à jour: ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};