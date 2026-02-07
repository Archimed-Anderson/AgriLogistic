import requests
import socket
import os
import sys
from datetime import datetime

# Aggregating all service URLs from previous steps
SERVICES = {
    "AI_RAG": "http://localhost:8000/health",
    "RENTALS_API": "http://localhost:3007/health",
    "CREDIT_API": "http://localhost:3008/api/v1/credit/health",
    "VISION_API": "http://localhost:3009/health",
    "INSURANCE_API": "http://localhost:3010/health",
}

INFRASTRUCTURE = {
    "MQTT_BROKER": ("localhost", 1883),
    "INFLUXDB": ("localhost", 8086),
    "QDRANT": ("localhost", 6333),
}


class GlobalIntegrationTester:
    def __init__(self):
        self.results = {}
        self.start_time = datetime.now()

    def check_http_service(self, name, url):
        print(f"📡 Testing {name} at {url}...")
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                self.results[name] = "✅ ONLINE"
            else:
                self.results[name] = (
                    f"⚠️ WARNING (Status {response.status_code})"
                )
        except Exception:
            self.results[name] = "❌ OFFLINE"

    def check_tcp_port(self, name, host, port):
        print(f"🔌 Testing {name} on {host}:{port}...")
        try:
            with socket.create_connection((host, port), timeout=3):
                self.results[name] = "✅ REACHABLE"
        except Exception:
            self.results[name] = "❌ UNREACHABLE"

    def test_ml_models(self):
        print("🧠 Testing Predictive ML Model...")
        try:
            # Add coldchain path to sys.path
            base_p = os.path.abspath("services/logistics/coldchain-service")
            if base_p not in sys.path:
                sys.path.append(base_p)

            from ml.failure_predictor import FailurePredictor
            predictor = FailurePredictor()
            # Test sample: [temp, vib, press, runtime]
            res = predictor.predict([4.0, 0.4, 140.0, 50.0])
            if res["status"] == "Safe":
                self.results["ML_PREDICTOR"] = "✅ FUNCTIONAL (Safe)"
            else:
                self.results["ML_PREDICTOR"] = "⚠️ ANOMALY DETECTED"
        except ImportError:
            self.results["ML_PREDICTOR"] = "❌ SKIPPED (Missing dependencies)"
        except Exception as e:
            self.results["ML_PREDICTOR"] = f"❌ ERROR: {str(e)}"

    def test_report_generation(self):
        print("📄 Testing PDF Report Generation...")
        try:
            # Fixing the import relative to the project root
            base_p = os.path.abspath("services/logistics/coldchain-service")
            if base_p not in sys.path:
                sys.path.append(base_p)

            from services.report_generator import ColdChainReport
            mock_data = [{'time': '12:00', 'temp': 4.0, 'humidity': 80}]
            generator = ColdChainReport("TEST-BATCH-001", mock_data)
            path = generator.generate()
            if os.path.exists(path):
                name = os.path.basename(path)
                self.results["REPORT_GEN"] = f"✅ SUCCESS ({name})"
                # Cleanup test report
                # os.remove(path)
            else:
                self.results["REPORT_GEN"] = "❌ FILE NOT FOUND"
        except ImportError as e:
            self.results["REPORT_GEN"] = f"❌ SKIPPED (Import Error: {str(e)})"
        except Exception as e:
            self.results["REPORT_GEN"] = f"❌ ERROR: {str(e)}"

    def run_all(self):
        print("🚀 STARTING GLOBAL INTEGRATION SMOKE TESTS\n" + "=" * 40)

        # 1. Check Microservices
        for name, url in SERVICES.items():
            self.check_http_service(name, url)

        # 2. Check Infrastructure
        for name, (host, port) in INFRASTRUCTURE.items():
            self.check_tcp_port(name, host, port)

        # 3. Check ML Logic
        self.test_ml_models()

        # 4. Check Reporting
        # self.test_report_generation() # Skipped for now

        self.print_summary()

    def print_summary(self):
        print("\n" + "=" * 40 + "\n📊 INTEGRATION SUMMARY\n" + "=" * 40)
        for service, status in self.results.items():
            print(f"{service:20} : {status}")

        duration = datetime.now() - self.start_time
        print(f"\nTotal Test Duration: {duration.total_seconds():.2f}s")
        print("=" * 40)


if __name__ == "__main__":
    tester = GlobalIntegrationTester()
    tester.run_all()
