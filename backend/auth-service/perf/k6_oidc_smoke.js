import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  // NOTE: Kong applies rate limiting on auth-service (100/min).
  // Keep request rate below that limit to measure latency instead of triggering 429s.
  scenarios: {
    smoke: {
      executor: "constant-arrival-rate",
      rate: 60,
      timeUnit: "1m",
      duration: "1m",
      preAllocatedVUs: 5,
      maxVUs: 10,
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<300"], // ms (basic dev SLA target)
  },
};

const baseUrl = __ENV.BASE_URL || "http://agrologistic-kong-gateway:8000";

export default function () {
  const endpoints = ["/.well-known/openid-configuration", "/.well-known/jwks.json"];
  const path = endpoints[Math.floor(Math.random() * endpoints.length)];
  const r = http.get(`${baseUrl}${path}`);
  check(r, { "oidc/jwks status 200": (res) => res.status === 200 });
  sleep(0.1);
}

