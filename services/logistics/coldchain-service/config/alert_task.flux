import "http"
import "json"

option task = {
    name: "Cold Chain Temperature Alert",
    every: 1m,
    offset: 0s,
}

// Paramètres de l'alerte
threshold = 6.0
backend_url = "http://host.docker.internal:3000/api/v1/alerts/cold-chain"

data = from(bucket: "cold_chain")
    |> range(start: -5m)
    |> filter(fn: (r) => r["_measurement"] == "telemetry")
    |> filter(fn: (r) => r["_field"] == "temperature")
    |> mean()
    |> group(columns: ["truck_id"])

data
    |> filter(fn: (r) => r._value > threshold)
    |> map(fn: (r) => {
        // Déclencher l'alerte HTTP
        return {
            r with
            _status: http.post(
                url: backend_url,
                headers: {"Content-Type": "application/json"},
                data: json.encode(v: {
                    truck_id: r.truck_id,
                    avg_temp: r._value,
                    threshold: threshold,
                    timestamp: string(v: now()),
                    message: "Alerte: Température moyenne critique détectée (> 6°C)!"
                })
            )
        }
    })
    |> yield(name: "alerts")
