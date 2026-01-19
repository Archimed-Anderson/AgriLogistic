# 🚀 AgroLogistic Platform - Phase 4 Implementation Plan

## Overview
Phase 4 establishes production-grade infrastructure with comprehensive observability, DevOps automation, and platform optimization.

**Timeline:** Q4 2026 (12 weeks)  
**Priority:** 🟣 ESSENTIAL  
**Prerequisites:** Phases 1, 2 & 3 complete

---

## 📋 Phase 4 Objectives

### Success Criteria
- ✅ Full observability stack operational
- ✅ CI/CD pipeline automating deployments
- ✅ Infrastructure as Code (IaC) managing all resources
- ✅ Performance optimized for scale
- ✅ Disaster recovery & backup systems
- ✅ Security hardening complete

---

## 📊 Component 1: Observability Stack

### **Weeks 1-3: Prometheus, Grafana, Jaeger, ELK**

#### 1.1 Prometheus Setup

```yaml
# /infrastructure/monitoring/prometheus/prometheus.yml

global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'AgroLogistic-prod'
    environment: 'production'

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

# Load rules
rule_files:
  - '/etc/prometheus/rules/*.yml'

# Scrape configurations
scrape_configs:
  # Prometheus itself
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Kubernetes API server
  - job_name: 'kubernetes-apiservers'
    kubernetes_sd_configs:
      - role: endpoints
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
      - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
        action: keep
        regex: default;kubernetes;https

  # Kubernetes nodes
  - job_name: 'kubernetes-nodes'
    kubernetes_sd_configs:
      - role: node
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
      - action: labelmap
        regex: __meta_kubernetes_node_label_(.+)

  # Kubernetes pods
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__

  # Services
  - job_name: 'auth-service'
    static_configs:
      - targets: ['auth-service:3001']
        labels:
          service: 'auth'

  - job_name: 'product-service'
    static_configs:
      - targets: ['product-service:3002']
        labels:
          service: 'product'

  - job_name: 'order-service'
    static_configs:
      - targets: ['order-service:3003']
        labels:
          service: 'order'

  - job_name: 'payment-service'
    static_configs:
      - targets: ['payment-service:3004']
        labels:
          service: 'payment'

  # PostgreSQL exporter
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  # Redis exporter
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']

  # Node exporter
  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']
```

**Alert Rules:**
```yaml
# /infrastructure/monitoring/prometheus/rules/alerts.yml

groups:
  - name: service_availability
    interval: 30s
    rules:
      - alert: ServiceDown
        expr: up{job=~".*-service"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.job }} is down"
          description: "{{ $labels.job }} has been down for more than 2 minutes"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate on {{ $labels.service }}"
          description: "Error rate is {{ $value | humanizePercentage }}"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High latency on {{ $labels.service }}"
          description: "95th percentile latency is {{ $value }}s"

  - name: resource_usage
    interval: 30s
    rules:
      - alert: HighCPUUsage
        expr: rate(process_cpu_seconds_total[5m]) > 0.8
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.job }}"
          description: "CPU usage is {{ $value | humanizePercentage }}"

      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes / 1024 / 1024 / 1024 > 2
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.job }}"
          description: "Memory usage is {{ $value }}GB"

  - name: database_alerts
    interval: 30s
    rules:
      - alert: DatabaseConnectionsHigh
        expr: pg_stat_database_numbackends / pg_settings_max_connections > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High database connections"
          description: "{{ $value | humanizePercentage }} of max connections used"

      - alert: SlowQueries
        expr: rate(pg_stat_statements_mean_time_seconds[5m]) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow database queries detected"
          description: "Average query time: {{ $value }}s"
```

#### 1.2 Grafana Dashboards

```json
// /infrastructure/monitoring/grafana/dashboards/service-overview.json
{
  "dashboard": {
    "title": "AgroLogistic Services Overview",
    "tags": ["AgroLogistic", "services"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total[5m])) by (service)",
            "legendFormat": "{{ service }}"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 0}
      },
      {
        "id": 2,
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) by (service) / sum(rate(http_requests_total[5m])) by (service)",
            "legendFormat": "{{ service }}"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 0}
      },
      {
        "id": 3,
        "title": "Response Time (p95)",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (service, le))",
            "legendFormat": "{{ service }}"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 8}
      },
      {
        "id": 4,
        "title": "Active Users",
        "type": "stat",
        "targets": [
          {
            "expr": "count(count by (user_id) (http_requests_total{user_id!=\"\"}) )"
          }
        ],
        "gridPos": {"h": 4, "w": 6, "x": 12, "y": 8}
      },
      {
        "id": 5,
        "title": "Total Requests (24h)",
        "type": "stat",
        "targets": [
          {
            "expr": "sum(increase(http_requests_total[24h]))"
          }
        ],
        "gridPos": {"h": 4, "w": 6, "x": 18, "y": 8}
      }
    ]
  }
}
```

#### 1.3 Jaeger Distributed Tracing

```yaml
# /infrastructure/monitoring/jaeger/jaeger-all-in-one.yml

apiVersion: v1
kind: Service
metadata:
  name: jaeger
  namespace: monitoring
spec:
  type: LoadBalancer
  ports:
    - name: query-http
      port: 16686
      targetPort: 16686
    - name: collector-grpc
      port: 14250
      targetPort: 14250
    - name: collector-http
      port: 14268
      targetPort: 14268
  selector:
    app: jaeger

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: jaeger
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jaeger
  template:
    metadata:
      labels:
        app: jaeger
    spec:
      containers:
        - name: jaeger
          image: jaegertracing/all-in-one:1.51
          env:
            - name: COLLECTOR_OTLP_ENABLED
              value: "true"
            - name: SPAN_STORAGE_TYPE
              value: elasticsearch
            - name: ES_SERVER_URLS
              value: http://elasticsearch:9200
          ports:
            - containerPort: 16686
              name: query
            - containerPort: 14250
              name: grpc
            - containerPort: 14268
              name: http
          resources:
            requests:
              cpu: 500m
              memory: 1Gi
            limits:
              cpu: 1000m
              memory: 2Gi
```

**OpenTelemetry Instrumentation:**
```typescript
// /services/shared/tracing/opentelemetry.ts

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME,
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.SERVICE_VERSION || '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'production',
  }),
  traceExporter: new JaegerExporter({
    endpoint: process.env.JAEGER_ENDPOINT || 'http://jaeger:14268/api/traces',
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),
  ],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

export default sdk;
```

#### 1.4 ELK Stack (Elasticsearch, Logstash, Kibana)

```yaml
# /infrastructure/monitoring/elk/docker-compose.yml

version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms2g -Xmx2g"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
    networks:
      - elk

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
      - ./logstash/config/logstash.yml:/usr/share/logstash/config/logstash.yml
    ports:
      - "5044:5044"
      - "9600:9600"
    depends_on:
      - elasticsearch
    networks:
      - elk

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
    networks:
      - elk

  filebeat:
    image: docker.elastic.co/beats/filebeat:8.11.0
    user: root
    volumes:
      - ./filebeat/filebeat.yml:/usr/share/filebeat/filebeat.yml
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    command: filebeat -e -strict.perms=false
    depends_on:
      - elasticsearch
      - logstash
    networks:
      - elk

volumes:
  elasticsearch-data:

networks:
  elk:
    driver: bridge
```

**Logstash Pipeline:**
```conf
# /infrastructure/monitoring/elk/logstash/pipeline/logstash.conf

input {
  beats {
    port => 5044
  }
}

filter {
  if [container][name] =~ /AgroLogistic/ {
    json {
      source => "message"
      target => "log"
    }

    mutate {
      add_field => {
        "service" => "%{[container][name]}"
        "environment" => "${ENVIRONMENT}"
      }
    }

    date {
      match => ["[log][timestamp]", "ISO8601"]
      target => "@timestamp"
    }

    if [log][level] {
      mutate {
        add_field => { "log_level" => "%{[log][level]}" }
      }
    }

    if [log][error] {
      mutate {
        add_tag => ["error"]
      }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "AgroLogistic-logs-%{+YYYY.MM.dd}"
  }

  if "error" in [tags] {
    http {
      url => "${SLACK_WEBHOOK_URL}"
      http_method => "post"
      format => "json"
      content_type => "application/json"
      mapping => {
        "text" => "Error in %{service}: %{[log][message]}"
      }
    }
  }
}
```

---

## 🔄 Component 2: CI/CD Pipeline

### **Weeks 4-6: GitHub Actions, ArgoCD**

#### 2.1 CI Pipeline

```yaml
# /.github/workflows/ci.yml

name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x]
    
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Generate coverage report
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix={{branch}}-

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  security-scan:
    needs: build
    runs-on: ubuntu-latest

    steps:
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

#### 2.2 CD Pipeline (ArgoCD)

```yaml
# /infrastructure/argocd/application.yml

apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: AgroLogistic-services
  namespace: argocd
spec:
  project: default
  
  source:
    repoURL: https://github.com/AgroLogistic/platform
    targetRevision: HEAD
    path: k8s/overlays/production
    
  destination:
    server: https://kubernetes.default.svc
    namespace: AgroLogistic
  
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    
    syncOptions:
      - CreateNamespace=true
      - PrunePropagationPolicy=foreground
      - PruneLast=true
    
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
  
  revisionHistoryLimit: 10

---

apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: AgroLogistic
  namespace: argocd
spec:
  description: AgroLogistic Platform
  
  sourceRepos:
    - 'https://github.com/AgroLogistic/*'
  
  destinations:
    - namespace: 'AgroLogistic'
      server: https://kubernetes.default.svc
    - namespace: 'AgroLogistic-staging'
      server: https://kubernetes.default.svc
  
  clusterResourceWhitelist:
    - group: '*'
      kind: '*'
  
  namespaceResourceWhitelist:
    - group: '*'
      kind: '*'
```

**Progressive Delivery with Argo Rollouts:**
```yaml
# /k8s/base/rollout.yml

apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: product-service
spec:
  replicas: 5
  strategy:
    canary:
      steps:
        - setWeight: 10
        - pause: {duration: 5m}
        - setWeight: 25
        - pause: {duration: 5m}
        - setWeight: 50
        - pause: {duration: 5m}
        - setWeight: 75
        - pause: {duration: 5m}
      
      analysis:
        templates:
          - templateName: success-rate
        startingStep: 2
        args:
          - name: service-name
            value: product-service
      
      trafficRouting:
        istio:
          virtualService:
            name: product-service
            routes:
              - primary
  
  revisionHistoryLimit: 3
  
  selector:
    matchLabels:
      app: product-service
  
  template:
    metadata:
      labels:
        app: product-service
    spec:
      containers:
        - name: product-service
          image: ghcr.io/AgroLogistic/product-service:latest
          ports:
            - containerPort: 3002
          resources:
            requests:
              cpu: 100m
              memory: 256Mi
            limits:
              cpu: 500m
              memory: 512Mi

---

apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: success-rate
spec:
  args:
    - name: service-name
  
  metrics:
    - name: success-rate
      interval: 1m
      successCondition: result[0] >= 0.95
      failureLimit: 3
      provider:
        prometheus:
          address: http://prometheus:9090
          query: |
            sum(rate(http_requests_total{service="{{args.service-name}}",status!~"5.."}[5m]))
            /
            sum(rate(http_requests_total{service="{{args.service-name}}"}[5m]))
```

---

## 🏗️ Component 3: Infrastructure as Code

### **Weeks 7-9: Terraform, Helm Charts**

#### 3.1 Terraform AWS Infrastructure

```hcl
# /infrastructure/terraform/main.tf

terraform {
  required_version = ">= 1.6"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.24"
    }
  }
  
  backend "s3" {
    bucket         = "AgroLogistic-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment = var.environment
      Project     = "AgroLogistic"
      ManagedBy   = "Terraform"
    }
  }
}

# VPC
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "5.4.0"
  
  name = "AgroLogistic-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway = true
  enable_vpn_gateway = false
  enable_dns_hostnames = true
  
  tags = {
    "kubernetes.io/cluster/AgroLogistic-eks" = "shared"
  }
}

# EKS Cluster
module "eks" {
  source = "terraform-aws-modules/eks/aws"
  version = "19.21.0"
  
  cluster_name    = "AgroLogistic-eks"
  cluster_version = "1.28"
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  cluster_endpoint_public_access = true
  
  eks_managed_node_groups = {
    general = {
      desired_size = 3
      min_size     = 2
      max_size     = 10
      
      instance_types = ["t3.large"]
      capacity_type  = "ON_DEMAND"
      
      labels = {
        role = "general"
      }
    }
    
    compute = {
      desired_size = 2
      min_size     = 1
      max_size     = 5
      
      instance_types = ["c5.2xlarge"]
      capacity_type  = "SPOT"
      
      labels = {
        role = "compute"
      }
      
      taints = [{
        key    = "workload"
        value  = "compute"
        effect = "NoSchedule"
      }]
    }
  }
}

# RDS PostgreSQL
module "db" {
  source = "terraform-aws-modules/rds/aws"
  version = "6.3.0"
  
  identifier = "AgroLogistic-postgres"
  
  engine               = "postgres"
  engine_version       = "15.4"
  family               = "postgres15"
  major_engine_version = "15"
  instance_class       = "db.r6g.xlarge"
  
  allocated_storage     = 100
  max_allocated_storage = 500
  
  db_name  = "AgroLogistic"
  username = "AgroLogistic_admin"
  port     = 5432
  
  multi_az               = true
  db_subnet_group_name   = module.vpc.database_subnet_group_name
  vpc_security_group_ids = [module.security_group_db.security_group_id]
  
  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "mon:04:00-mon:05:00"
  
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  
  deletion_protection = true
}

# ElastiCache Redis
module "redis" {
  source = "terraform-aws-modules/elasticache/aws"
  version = "1.2.0"
  
  cluster_id           = "AgroLogistic-redis"
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = "cache.r6g.large"
  num_cache_nodes      = 2
  parameter_group_name = "default.redis7"
  
  subnet_group_name = module.vpc.elasticache_subnet_group_name
  security_group_ids = [module.security_group_redis.security_group_id]
  
  snapshot_retention_limit = 5
  snapshot_window          = "03:00-05:00"
}

# S3 Buckets
resource "aws_s3_bucket" "assets" {
  bucket = "AgroLogistic-assets-${var.environment}"
}

resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id
  
  rule {
    id     = "archive-old-versions"
    status = "Enabled"
    
    noncurrent_version_transition {
      noncurrent_days = 30
      storage_class   = "GLACIER"
    }
    
    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }
}

# CloudFront CDN
resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "AgroLogistic CDN"
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  
  origin {
    domain_name = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_id   = "S3-AgroLogistic-assets"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.cdn.cloudfront_access_identity_path
    }
  }
  
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-AgroLogistic-assets"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# Outputs
output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "rds_endpoint" {
  value = module.db.db_instance_endpoint
}

output "redis_endpoint" {
  value = module.redis.primary_endpoint_address
}

output "cdn_domain" {
  value = aws_cloudfront_distribution.cdn.domain_name
}
```

#### 3.2 Helm Charts

```yaml
# /infrastructure/helm/AgroLogistic/Chart.yaml

apiVersion: v2
name: AgroLogistic
description: AgroLogistic Platform Helm Chart
type: application
version: 1.0.0
appVersion: "1.0.0"

dependencies:
  - name: postgresql
    version: 13.2.0
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled
  
  - name: redis
    version: 18.4.0
    repository: https://charts.bitnami.com/bitnami
    condition: redis.enabled
  
  - name: elasticsearch
    version: 19.16.0
    repository: https://charts.bitnami.com/bitnami
    condition: elasticsearch.enabled
```

```yaml
# /infrastructure/helm/AgroLogistic/values.yaml

global:
  environment: production
  domain: AgroLogistic.com

services:
  auth:
    enabled: true
    replicaCount: 3
    image:
      repository: ghcr.io/AgroLogistic/auth-service
      tag: "1.0.0"
    resources:
      requests:
        cpu: 100m
        memory: 256Mi
      limits:
        cpu: 500m
        memory: 512Mi
    autoscaling:
      enabled: true
      minReplicas: 3
      maxReplicas: 10
      targetCPUUtilizationPercentage: 70

  product:
    enabled: true
    replicaCount: 5
    image:
      repository: ghcr.io/AgroLogistic/product-service
      tag: "1.0.0"
    resources:
      requests:
        cpu: 200m
        memory: 512Mi
      limits:
        cpu: 1000m
        memory: 1Gi
    autoscaling:
      enabled: true
      minReplicas: 5
      maxReplicas: 20
      targetCPUUtilizationPercentage: 70

postgresql:
  enabled: false  # Using RDS
  
redis:
  enabled: false  # Using ElastiCache

ingress:
  enabled: true
  className: istio
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: api.AgroLogistic.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: AgroLogistic-tls
      hosts:
        - api.AgroLogistic.com
```

---

## 🔒 Component 4: Security Hardening

### **Weeks 10-11: Security Scanning, Compliance**

#### 4.1 OWASP Dependency Check

```yaml
# /.github/workflows/security-scan.yml

name: Security Scan

on:
  schedule:
    - cron: '0 0 * * *'  # Daily
  push:
    branches: [main]

jobs:
  dependency-check:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Run OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'AgroLogistic'
          path: '.'
          format: 'HTML'
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: dependency-check-report
          path: ${{github.workspace}}/reports

  sonarqube:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

#### 4.2 Network Policies

```yaml
# /k8s/base/network-policy.yml

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
  namespace: AgroLogistic
spec:
  podSelector: {}
  policyTypes:
    - Ingress
  ingress: []

---

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-gateway
  namespace: AgroLogistic
spec:
  podSelector:
    matchLabels:
      tier: backend
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: api-gateway
      ports:
        - protocol: TCP
          port: 3000

---

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-database
  namespace: AgroLogistic
spec:
  podSelector:
    matchLabels:
      app: postgres
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              tier: backend
      ports:
        - protocol: TCP
          port: 5432
```

---

## 🎯 Phase 4 Success Criteria

**Technical:**
- Deployment frequency: >10 per day
- Lead time for changes: <1 hour
- MTTR (Mean Time To Recovery): <30 minutes
- Change failure rate: <5%
- Service availability: 99.95%
- All security scans passing
- 100% infrastructure as code

**Business:**
- Zero-downtime deployments
- Automated rollback on failures
- Complete audit trail
- Compliance certifications achieved

---

**Last Updated:** January 2026  
**Version:** 1.0  
**Status:** 🟢 Ready for Implementation
