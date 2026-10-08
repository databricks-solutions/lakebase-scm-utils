const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

// The OpenAPI spec is built from the `@openapi` JSDoc blocks on the route files, so the Swagger UI
// at /docs reflects the real endpoints as they are added — the Express analogue of FastAPI's
// automatic /docs. Annotate every route you add with an `@openapi` block (see src/routes/health.js
// for the pattern); it then appears in /docs and /openapi.json with no extra wiring.
const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: '{{PROJECT_NAME}}',
      version: '1.0.0',
      description: 'API surface for acceptance review (Swagger UI at /docs).',
    },
  },
  apis: [path.join(__dirname, 'routes', '*.js')],
});

module.exports = spec;
