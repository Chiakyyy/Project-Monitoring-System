const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow Angular to connect
app.use(bodyParser.json());

// Mount Routes
app.use('/api', apiRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Backend ready for Angular connection...');
});