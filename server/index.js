require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', db: 'connected' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});