-- Audit Logs (immuabilité, partitionnement par mois) - Prisma migration
CREATE TABLE IF NOT EXISTS "audit_logs" (
    "id" UUID DEFAULT gen_random_uuid(),
    "table_name" VARCHAR(50) NOT NULL,
    "record_id" UUID NOT NULL,
    "action" VARCHAR(10) NOT NULL CHECK ("action" IN ('INSERT', 'UPDATE', 'DELETE')),
    "old_data" JSONB,
    "new_data" JSONB,
    "changed_by" UUID,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" INET,
    "user_agent" TEXT,
    PRIMARY KEY ("id", "changed_at")
) PARTITION BY RANGE ("changed_at") WITH (fillfactor = 100);

CREATE TABLE IF NOT EXISTS "audit_logs_default" PARTITION OF "audit_logs" DEFAULT;

CREATE OR REPLACE FUNCTION create_audit_logs_partition_for_month(month_date DATE)
RETURNS TEXT AS $$
DECLARE
  part_name TEXT;
  start_ts   TIMESTAMP(3);
  end_ts     TIMESTAMP(3);
  sql_exec   TEXT;
BEGIN
  part_name := 'audit_logs_' || to_char(month_date, 'YYYY_MM');
  start_ts   := date_trunc('month', month_date)::TIMESTAMP(3);
  end_ts     := start_ts + INTERVAL '1 month';
  sql_exec   := format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF audit_logs FOR VALUES FROM (%L) TO (%L) WITH (fillfactor = 100)',
    part_name, start_ts, end_ts
  );
  EXECUTE sql_exec;
  RETURN part_name;
END;
$$ LANGUAGE plpgsql;

CREATE INDEX IF NOT EXISTS "idx_audit_logs_table_record" ON "audit_logs"("table_name", "record_id");
CREATE INDEX IF NOT EXISTS "idx_audit_logs_changed_at" ON "audit_logs"("changed_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_audit_logs_changed_by" ON "audit_logs"("changed_by");
CREATE INDEX IF NOT EXISTS "idx_audit_logs_action" ON "audit_logs"("action");
CREATE INDEX IF NOT EXISTS "idx_audit_logs_new_data_gin" ON "audit_logs" USING GIN ("new_data" jsonb_path_ops);
