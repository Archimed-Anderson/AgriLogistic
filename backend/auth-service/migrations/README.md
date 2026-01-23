# Migrations (Alembic)

Ce dossier contient les migrations SQL pour `auth-service`.

## Utilisation (local)

Depuis `AgroDeep/backend/auth-service`:

- Générer une migration (si besoin):
  - `alembic revision -m "message" --autogenerate`
- Appliquer les migrations:
  - `alembic upgrade head`

