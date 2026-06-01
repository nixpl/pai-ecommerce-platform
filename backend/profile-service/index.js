const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const profileRoutes = require('./routes/profileRoutes');
const addressRoutes = require('./routes/addressRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const { createErrorHandler, sanitizeMiddleware } = require('shared-utils');
app.use(sanitizeMiddleware);

sequelize.sync().then(() => console.log("Profile DB synced."));

app.use('/api/profiles', profileRoutes);
app.use('/api/profiles/addresses', addressRoutes);

const { ApiErrors } = require('./errors/apiErrors');
app.use(createErrorHandler(ApiErrors.SERVER_ERROR));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Profile Service running on http://localhost:${PORT}`);
});
