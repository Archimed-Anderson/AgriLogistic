-- ============================================================
-- Custom Kong Plugin: Custom Authentication
-- Authentification personnalisée pour AgroLogistic
-- ============================================================

local kong = kong
local cjson = require "cjson"

local CustomAuth = {
  PRIORITY = 1005,
  VERSION = "1.0.0",
}

-- Vérifie si un token est dans la blacklist (Redis)
local function is_token_blacklisted(token)
  -- TODO: Implement Redis check
  -- local redis = require "resty.redis"
  -- local red = redis:new()
  -- red:connect("redis", 6379)
  -- return red:exists("blacklist:" .. token)
  return false
end

-- Vérifie les permissions spécifiques au rôle
local function check_role_permissions(role, path)
  local role_permissions = {
    admin = {"/api/v1/.*"},
    user = {"/api/v1/products", "/api/v1/orders", "/api/v1/users/profile"},
    driver = {"/api/v1/logistics", "/api/v1/orders"},
    farmer = {"/api/v1/products", "/api/v1/marketplace"},
  }
  
  local allowed_paths = role_permissions[role] or {}
  
  for _, pattern in ipairs(allowed_paths) do
    if ngx.re.match(path, pattern) then
      return true
    end
  end
  
  return false
end

function CustomAuth:access(conf)
  -- Récupère le token JWT
  local authorization = kong.request.get_header("Authorization")
  
  if not authorization then
    return kong.response.exit(401, {
      error = "Unauthorized",
      message = "Missing Authorization header"
    })
  end
  
  -- Extract token
  local token = authorization:match("Bearer%s+(.+)")
  if not token then
    return kong.response.exit(401, {
      error = "Unauthorized",
      message = "Invalid Authorization format"
    })
  end
  
  -- Vérifie si le token est blacklisté
  if is_token_blacklisted(token) then
    return kong.response.exit(401, {
      error = "Unauthorized",
      message = "Token has been revoked"
    })
  end
  
  -- Récupère le consumer JWT (déjà vérifié par le plugin JWT)
  local consumer = kong.client.get_consumer()
  if not consumer then
    return kong.response.exit(401, {
      error = "Unauthorized",
      message = "Invalid consumer"
    })
  end
  
  -- Récupère le rôle depuis les credentials JWT
  local credential = kong.client.get_credential()
  local role = credential and credential.custom_id or "user"
  
  -- Vérifie les permissions
  local path = kong.request.get_path()
  if conf.enforce_permissions and not check_role_permissions(role, path) then
    kong.log.warn("Permission denied for role ", role, " on path ", path)
    return kong.response.exit(403, {
      error = "Forbidden",
      message = "Insufficient permissions"
    })
  end
  
  -- Ajoute des headers pour les services downstream
  kong.service.request.set_header("X-User-ID", consumer.id)
  kong.service.request.set_header("X-User-Role", role)
  kong.service.request.set_header("X-Consumer-Username", consumer.username)
  
  -- Log successful auth
  if conf.log_auth then
    kong.log.info("Auth success: ", cjson.encode({
      consumer = consumer.username,
      role = role,
      path = path,
    }))
  end
end

return CustomAuth
