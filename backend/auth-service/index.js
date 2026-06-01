const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const AuthService = require('./services/authService');

const app = express();
app.use(cors());
app.use(express.json());

const { createErrorHandler, sanitizeMiddleware } = require('shared-utils');
app.use(sanitizeMiddleware);

sequelize.sync().then(async () => {
  console.log("Auth DB synced.");
  await AuthService.seedSuperAdmin();
});

app.use('/api/auth', authRoutes);

const { ApiErrors } = require('./errors/apiErrors');
app.use(createErrorHandler(ApiErrors.SERVER_ERROR));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth Service running on http://localhost:${PORT}`);
});
