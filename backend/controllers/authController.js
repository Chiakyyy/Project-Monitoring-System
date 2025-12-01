const db = require('../config/db');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const user = rows[0];

        // Return the user info (excluding password)
        res.json({
            message: 'Connexion réussie',
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                service_id: user.service_id
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};