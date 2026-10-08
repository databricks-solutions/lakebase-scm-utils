const express = require('express');
const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Liveness probe
 *     description: Returns ok when the service is up. Pattern for annotating routes so they appear in /docs.
 *     responses:
 *       200:
 *         description: Service is up
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
