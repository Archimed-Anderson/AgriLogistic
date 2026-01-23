-- ============================================================
-- Custom Kong Plugin: Request Logger avec enrichissement
-- Logs toutes les requêtes avec métadonnées business
-- ============================================================

local kong = kong
local cjson = require "cjson"

local RequestLogger = {
  PRIORITY = 1000,
  VERSION = "1.0.0",
}

function RequestLogger:access(conf)
  -- Capture request start time
  kong.ctx.plugin.start_time = ngx.now()
  
  -- Extract request metadata
  local request_data = {
    request_id = kong.request.get_header("X-Request-ID") or kong.ctx.plugin.request_id,
    method = kong.request.get_method(),
    path = kong.request.get_path(),
    query = kong.request.get_query(),
    headers = kong.request.get_headers(),
    client_ip = kong.client.get_forwarded_ip(),
    consumer = kong.client.get_consumer(),
    timestamp = os.date("!%Y-%m-%dT%H:%M:%SZ"),
  }
  
  -- Store in context for response phase
  kong.ctx.plugin.request_data = request_data
  
  -- Log to stderr for aggregation
  if conf.log_requests then
    kong.log.info("REQUEST: ", cjson.encode(request_data))
  end
end

function RequestLogger:response(conf)
  local request_data = kong.ctx.plugin.request_data
  if not request_data then
    return
  end
  
  -- Calculate latency
  local latency = (ngx.now() - (kong.ctx.plugin.start_time or 0)) * 1000
  
  -- Build response log
  local response_data = {
    request_id = request_data.request_id,
    status = kong.response.get_status(),
    latency_ms = latency,
    upstream_latency = kong.ctx.balancer_data.try_count or 0,
    size = kong.response.get_header("Content-Length"),
  }
  
  -- Enrich with error details if present
  if response_data.status >= 400 then
    response_data.error = true
    local body = kong.response.get_raw_body()
    if body then
      response_data.error_body = body:sub(1, 200)  -- First 200 chars
    end
  end
  
  -- Combined log entry
  local log_entry = {
    request = request_data,
    response = response_data,
  }
  
  if conf.log_responses then
    kong.log.info("RESPONSE: ", cjson.encode(log_entry))
  end
  
  -- Add custom headers for debugging
  if conf.debug_mode then
    kong.response.set_header("X-Kong-Latency", tostring(latency))
    kong.response.set_header("X-Request-ID", request_data.request_id)
  end
end

return RequestLogger
