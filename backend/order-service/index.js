const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const { createErrorHandler, sanitizeMiddleware } = require('shared-utils');
app.use(sanitizeMiddleware);

sequelize.sync().then(() => console.log('Order DB synced.'));

app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

const { ApiErrors } = require('./errors/apiErrors');
app.use(createErrorHandler(ApiErrors.SERVER_ERROR));

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Order Service running on http://localhost:${PORT}`);
});
