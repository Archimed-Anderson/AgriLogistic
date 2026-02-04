# =============================================================================
# Apache Superset - Configuration (Cahier Monitoring Métier)
# =============================================================================
# Datasources : agrilogistic_prod (PostgreSQL métier), analytics_warehouse (ClickHouse)
# RLS : agriculteur / transporteur / admin (voir documentation)
# =============================================================================
import os

# -----------------------------------------------------------------------------
# Base
# -----------------------------------------------------------------------------
ROW_LIMIT = 50000
SUPERSET_WEBSERVER_PORT = 8088
SECRET_KEY = os.environ.get("SUPERSET_SECRET_KEY", "CHANGE_ME")
WTF_CSRF_ENABLED = True
WTF_CSRF_EXEMPT_LIST = []
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SECURE = False

# -----------------------------------------------------------------------------
# Database (metadata Superset)
# -----------------------------------------------------------------------------
SQLALCHEMY_DATABASE_URI = (
    f"postgresql://{os.environ.get('DATABASE_USER', 'superset')}:"
    f"{os.environ.get('DATABASE_PASSWORD', '')}@"
    f"{os.environ.get('DATABASE_HOST', 'superset-db')}:"
    f"{os.environ.get('DATABASE_PORT', '5432')}/"
    f"{os.environ.get('DATABASE_DB', 'superset')}"
)
SQLALCHEMY_TRACK_MODIFICATIONS = False

# -----------------------------------------------------------------------------
# Redis / Celery
# -----------------------------------------------------------------------------
REDIS_HOST = os.environ.get("REDIS_HOST", "superset-redis")
REDIS_PORT = int(os.environ.get("REDIS_PORT", "6379"))
CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", f"redis://{REDIS_HOST}:{REDIS_PORT}/0")
CELERY_RESULT_BACKEND = os.environ.get("CELERY_RESULT_BACKEND", f"redis://{REDIS_HOST}:{REDIS_PORT}/1")
CACHE_DEFAULT_TIMEOUT = 300
CACHE_CONFIG = {
    "CACHE_TYPE": "RedisCache",
    "CACHE_DEFAULT_TIMEOUT": CACHE_DEFAULT_TIMEOUT,
    "CACHE_KEY_PREFIX": "superset_",
    "CACHE_REDIS_HOST": REDIS_HOST,
    "CACHE_REDIS_PORT": REDIS_PORT,
    "CACHE_REDIS_DB": 2,
}
# Données historiques : cache 1h (3600s). Surcharger par dataset/database si besoin.
CACHE_DEFAULT_TIMEOUT_HISTORICAL = 3600
# Données temps réel : 5min (300s) — configurer cache_timeout sur les datasets ClickHouse (events, iot_telemetry).
DATA_CACHE_CONFIG = {
    **CACHE_CONFIG,
    "CACHE_KEY_PREFIX": "superset_data_",
    "CACHE_DEFAULT_TIMEOUT": CACHE_DEFAULT_TIMEOUT_HISTORICAL,
}
# -----------------------------------------------------------------------------
# Async queries (datasets > 1M lignes) — Celery + Redis RESULTS_BACKEND
# RESULTS_BACKEND doit être une instance BaseCache (Flask-Caching).
# Activer "Asynchronous Query Execution" sur chaque DB dans Superset (Data > Databases).
# -----------------------------------------------------------------------------
try:
    from flask_caching.backends.rediscache import RedisCache
    RESULTS_BACKEND = RedisCache(
        host=REDIS_HOST,
        port=REDIS_PORT,
        db=3,
        key_prefix="superset_results",
    )
except Exception:
    RESULTS_BACKEND = None  # désactive async si Redis non dispo
GLOBAL_ASYNC_QUERIES_TRANSPORT = "polling"
GLOBAL_ASYNC_QUERIES_POLLING_DELAY = 500  # ms
FEATURE_FLAGS = {
    "ALERT_REPORTS": True,
    "DASHBOARD_NATIVE_FILTERS": True,
    "EMBEDDABLE_CHARTS": True,
    "GLOBAL_ASYNC_QUERIES": True,
}


# -----------------------------------------------------------------------------
# RLS (Row Level Security) - à configurer dans l'UI ou via API
# Agriculteur : filtre sur farmer_id / user_id
# Transporteur : filtre sur transporter_id / missions
# Admin : pas de filtre (UNFILTERED)
# Voir documentation superset/dashboards/README.md
# -----------------------------------------------------------------------------
# ROW_LEVEL_SECURITY = True  # activé par défaut si rôles configurés

# -----------------------------------------------------------------------------
# CORS (si iframe / SSO)
# -----------------------------------------------------------------------------
ENABLE_CORS = True
CORS_OPTIONS = {"supports_credentials": True, "allow_headers": ["*"], "origins": ["*"]}

# -----------------------------------------------------------------------------
# Logging
# -----------------------------------------------------------------------------
ENABLE_TIME_ROTATE = False
LOG_LEVEL = os.environ.get("SUPERSET_LOG_LEVEL", "INFO")
