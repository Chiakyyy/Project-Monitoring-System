const db = require('../config/db');

// Add a task to a project
exports.addTask = async (req, res) => {
    try {
        const { title, description, deadline, duration, project_id } = req.body;
        const sql = `INSERT INTO tasks (title, description, deadline, duration, project_id) 
                    VALUES (?, ?, ?, ?, ?)`;
        await db.query(sql, [title, description, deadline, duration, project_id]);
        res.status(201).json({ message: 'Tâche ajoutée' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a comment (Urgent, Daily, Informative) 
exports.addComment = async (req, res) => {
    try {
        const { task_id, user_id, content, type } = req.body;
        // type must be 'URGENT', 'DAILY', or 'INFORMATIVE'
        const sql = `INSERT INTO comments (task_id, user_id, content, type) VALUES (?, ?, ?, ?)`;
        await db.query(sql, [task_id, user_id, content, type]);
        res.status(201).json({ message: 'Commentaire ajouté' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Peer Validation: Employee signals a task is validated or not relevant [cite: 9]
exports.peerReviewTask = async (req, res) => {
    try {
        const { task_id, user_id, is_approved } = req.body;

        // Insert or Update the approval record
        const sql = `INSERT INTO task_approvals (task_id, user_id, is_approved) 
                    VALUES (?, ?, ?) 
                    ON DUPLICATE KEY UPDATE is_approved = ?`;

        await db.query(sql, [task_id, user_id, is_approved, is_approved]);
        res.json({ message: 'Avis enregistré' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Notifications for Chef (15 days before deadline) [cite: 11]
exports.getNotifications = async (req, res) => {
    try {
        const sql = `
            SELECT * FROM tasks 
            WHERE status != 'VALIDATED' 
            AND DATEDIFF(deadline, CURDATE()) <= 15 
            AND DATEDIFF(deadline, CURDATE()) >= 0`;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get ALL tasks (For the Employee List)
exports.getAllTasks = async (req, res) => {
    try {
        const sql = `
            SELECT t.*, p.title as project_title 
            FROM tasks t 
            JOIN projects p ON t.project_id = p.id
            ORDER BY t.deadline ASC`;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Full Task Details (Tasks + Comments + Votes) for the Dashboard
exports.getTaskFullDetails = async (req, res) => {
    try {
        // 1. Get All Tasks
        const [tasks] = await db.query(`
            SELECT t.*, p.title as project_title 
            FROM tasks t 
            JOIN projects p ON t.project_id = p.id 
            ORDER BY t.deadline ASC
        `);

        // 2. Get All Comments with User Names
        const [comments] = await db.query(`
            SELECT c.*, u.full_name 
            FROM comments c 
            JOIN users u ON c.user_id = u.id
        `);

        // 3. Get All Approvals with User Names
        const [approvals] = await db.query(`
            SELECT ta.*, u.full_name 
            FROM task_approvals ta 
            JOIN users u ON ta.user_id = u.id
        `);

        // 4. Combine them in JavaScript (Simpler than a complex SQL Join)
        const fullData = tasks.map(task => {
            return {
                ...task,
                // Filter comments for this task
                relatedComments: comments.filter(c => c.task_id === task.id),
                // Filter approvals for this task
                relatedApprovals: approvals.filter(a => a.task_id === task.id)
            };
        });

        res.json(fullData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Manager validates/invalidates a specific task
exports.updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'VALIDATED', 'NOT_VALIDATED', 'IN_PROGRESS'

        const sql = 'UPDATE tasks SET status = ? WHERE id = ?';
        await db.query(sql, [status, id]);

        res.json({ message: `Tâche mise à jour: ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};