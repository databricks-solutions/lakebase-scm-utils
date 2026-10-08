require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi');
const healthRoutes = require('./routes/health');

const app = express();
app.use(express.json());
app.use('/', healthRoutes);

// Swagger / OpenAPI UI for acceptance review (parity with FastAPI's /docs): the interactive UI at
// /docs and the raw spec at /openapi.json, both derived from the route @openapi annotations. For an
// API-only story, the acceptance gate points the reviewer here to exercise the endpoints.
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get('/openapi.json', (req, res) => res.json(openapiSpec));

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
