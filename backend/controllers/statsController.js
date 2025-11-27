const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Basic KPI: Total Budget
        const [budgetSum] = await db.query("SELECT SUM(budget_estimated) as total_budget FROM projects");

        // 2. Pie Chart: Projects by Status (Validated vs Invalid vs Pending)
        const [projStatus] = await db.query("SELECT status, COUNT(*) as count FROM projects GROUP BY status");

        // 3. Bar Chart: Projects per User (Who is working?)
        const [projByUser] = await db.query(`
            SELECT u.full_name, COUNT(p.id) as count 
            FROM projects p 
            JOIN users u ON p.creator_id = u.id 
            GROUP BY u.full_name
        `);

        // 4. Line Chart: Evolution over Time (Projects per Month)
        const [projByDate] = await db.query(`
            SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count 
            FROM projects 
            GROUP BY month 
            ORDER BY month ASC
        `);

        // 5. Budget Status: Money Validated vs Money Pending
        const [budgetByStatus] = await db.query(`
            SELECT status, SUM(budget_estimated) as total 
            FROM projects 
            GROUP BY status
        `);

        res.json({
            total_budget: budgetSum[0].total_budget,
            projects_by_status: projStatus,
            projects_by_user: projByUser,
            projects_by_date: projByDate,
            budget_by_status: budgetByStatus
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};