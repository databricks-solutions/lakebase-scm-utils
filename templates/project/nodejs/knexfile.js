require('dotenv').config();

const { mintToken, endpointPathFromEnv, currentUser } = require('./src/lakebase-credentials');

// Build the knex/pg connection from env. No DB token is read from .env: the
// password is minted at RUNTIME via pg's async password callback, so a
// long-running pool never carries an expired Lakebase credential.
function getConnection() {
  // Label reflecting WHO opened the connection: PGAPPNAME (post-checkout writes the resolved
  // label into .env), else consort/<consort-version> under a Consort drive, else scm-utils/unknown.
  const appName = process.env.PGAPPNAME || (process.env.CONSORT_VERSION ? 'consort/' + process.env.CONSORT_VERSION : 'scm-utils/{{LAKEBASE_SCM_UTILS_VERSION}}');

  // Explicit DATABASE_URL wins (a CI secret, Docker, or the ephemeral-verify DSN the deploy
  // substrate exports). Stamp application_name when the URL lacks one (an existing one is
  // respected) , a CI/verify DSN without it would otherwise connect UNlabeled.
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    let connectionString = dbUrl;
    try {
      const u = new URL(dbUrl);
      if (!u.searchParams.get('application_name')) {
        u.searchParams.set('application_name', appName);
        connectionString = u.toString();
      }
    } catch {
      // Non-URL connection string: leave verbatim.
    }
    return { connectionString, ssl: { rejectUnauthorized: false } };
  }

  const host = process.env.LAKEBASE_HOST || process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT || '5432');
  const database = process.env.DB_NAME || 'databricks_postgres';
  const user = process.env.DB_USERNAME || '';

  // Metadata present => mint at runtime. pg calls the async password function on
  // every new physical connection, so each gets a fresh short-lived token.
  if (host && endpointPathFromEnv()) {
    return {
      host,
      port,
      database,
      user: user || currentUser(),
      password: async () => mintToken(),
      application_name: appName,
      ssl: { rejectUnauthorized: false },
    };
  }

  // Local fallback: no Lakebase metadata and no explicit URL.
  return { connectionString: `postgresql://${host}:${port}/${database}`, application_name: appName, ssl: false };
}

module.exports = {
  client: 'pg',
  connection: getConnection(),
  migrations: {
    directory: './migrations',
  },
};
