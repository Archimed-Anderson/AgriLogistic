-- ============================================================
-- Init script for Kong Postgres container
-- Creates the `konga` database required by Konga.
--
-- Notes:
-- - `CREATE DATABASE` cannot run inside a transaction/function block.
-- - We use psql's `\\gexec` to execute the generated CREATE DATABASE statement.
-- ============================================================

SELECT 'CREATE DATABASE konga'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'konga')
\gexec

-- Ensure owner/privileges for the Kong user (Konga connects as this user).
ALTER DATABASE konga OWNER TO kong;
GRANT ALL PRIVILEGES ON DATABASE konga TO kong;

