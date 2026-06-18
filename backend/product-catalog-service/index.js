const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const variantRoutes = require('./routes/variantRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const { createErrorHandler, sanitizeMiddleware } = require('shared-utils');
app.use(sanitizeMiddleware);

sequelize.sync().then(() => console.log("Catalog DB synced."));

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/variants', variantRoutes);

const { ApiErrors } = require('./errors/apiErrors');
app.use(createErrorHandler(ApiErrors.SERVER_ERROR));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Product Catalog Service running on http://localhost:${PORT}`);
});
