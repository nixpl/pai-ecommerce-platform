const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const PORT = process.env.DOCS_PORT || 8080;
const openapiPath = path.join(__dirname, 'openapi.yaml');
const openapiDocument = YAML.load(openapiPath);

const app = express();

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openapiDocument, {
    customSiteTitle: 'PAI E-Commerce API',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      tryItOutEnabled: true
    }
  })
);

app.get('/openapi.yaml', (_req, res) => {
  res.sendFile(openapiPath);
});

app.get('/', (_req, res) => {
  res.redirect('/api-docs');
});

app.listen(PORT, () => {
  console.log(`Dokumentacja API: http://localhost:${PORT}/api-docs`);
  console.log(`Plik OpenAPI:    http://localhost:${PORT}/openapi.yaml`);
});
