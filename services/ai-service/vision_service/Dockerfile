# ==========================================
# STAGE 1: Builder
# ==========================================
FROM python:3.11-slim as builder

WORKDIR /app

# Désactiver la création de fichiers .pyc et le buffering stdout
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Installer les dépendances système pour compiler certains packages si nécessaire
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Installer les dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --user -r requirements.txt

# ==========================================
# STAGE 2: Runtime
# ==========================================
FROM python:3.11-slim

WORKDIR /app

# Création d'un utilisateur non-root pour la sécurité
RUN groupadd -g 1000 appuser && \
    useradd -u 1000 -g appuser -s /bin/sh -m appuser

# Copier uniquement les librairies installées depuis le builder
COPY --from=builder /root/.local /home/appuser/.local
COPY . .

# Ajuster les permissions
RUN chown -R appuser:appuser /app && \
    chmod -R 755 /app/uploads

# Variables d'environnement
ENV PATH=/home/appuser/.local/bin:$PATH
ENV OLLAMA_HOST=http://host.docker.internal:11434
ENV PORT=3009

USER appuser

EXPOSE 3009

# Healthcheck pour s'assurer que l'API répond
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3009/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3009"]
