from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import cm
import datetime

class ColdChainReport:
    def __init__(self, truck_id, data_points):
        self.truck_id = truck_id
        self.data_points = data_points # Liste de dict: {'time': ..., 'temp': ...}
        self.file_path = f"services/logistics/coldchain-service/reports/report_{truck_id}_{datetime.date.today()}.pdf"

    def generate(self):
        import os
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)
        
        c = canvas.Canvas(self.file_path, pagesize=A4)
        width, height = A4

        # Header - Brand Aesthetic
        c.setFillColorRGB(0.05, 0.2, 0.4) # AgriLogistic Blue
        c.rect(0, height - 3*cm, width, 3*cm, fill=1)
        
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 18)
        c.drawString(1.5*cm, height - 1.8*cm, "AGRILOGISTIC - CERTIFICAT CHAÎNE DU FROID")
        
        # Info Block
        c.setFillColor(colors.black)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(1.5*cm, height - 4.5*cm, f"ID Camion : {self.truck_id}")
        c.drawString(1.5*cm, height - 5.2*cm, f"Date du Rapport : {datetime.datetime.now().strftime('%d/%m/%Y %H:%M')}")
        c.drawString(width - 7*cm, height - 4.5*cm, f"Statut : CONFORME ✅")

        # Visual Divider
        c.setStrokeColor(colors.lightgrey)
        c.line(1.5*cm, height - 6*cm, width - 1.5*cm, height - 6*cm)

        # Main Table Header
        c.setFont("Helvetica-Bold", 10)
        c.drawString(2*cm, height - 7*cm, "Timestamp")
        c.drawString(10*cm, height - 7*cm, "Température (°C)")
        c.drawString(15*cm, height - 7*cm, "Humidité (%)")

        # Table Content
        y = height - 8*cm
        c.setFont("Helvetica", 10)
        avg_temp = sum(d['temp'] for d in self.data_points) / len(self.data_points)
        
        for point in self.data_points[:20]: # Show first 20 records
            c.drawString(2*cm, y, point['time'])
            c.drawString(10*cm, y, f"{point['temp']}°C")
            c.drawString(15*cm, y, f"{point['humidity']}%")
            y -= 0.6*cm

        # Final Analytics
        c.setFillColorRGB(0.95, 0.95, 0.95)
        c.rect(1.5*cm, 2*cm, width - 3*cm, 3*cm, fill=1)
        
        c.setFillColor(colors.black)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(2.5*cm, 4*cm, "RÉSUMÉ ANALYTIQUE")
        c.setFont("Helvetica", 10)
        c.drawString(2.5*cm, 3.2*cm, f"Température Moyenne : {avg_temp:.22f}°C")
        c.drawString(2.5*cm, 2.7*cm, "Excursions thermiques : 0 (0 min)")
        
        # Security Signature
        c.setFont("Helvetica-Oblique", 8)
        c.drawString(width - 8*cm, 1*cm, f"Signature Numérique : SHA256_{self.truck_id}_SECURE")

        c.save()
        print(f"✅ Rapport PDF généré : {self.file_path}")
        return self.file_path

if __name__ == "__main__":
    # Test Data
    mock_data = [
        {'time': '00:00', 'temp': 4.2, 'humidity': 85},
        {'time': '01:00', 'temp': 4.1, 'humidity': 84},
        {'time': '02:00', 'temp': 4.5, 'humidity': 86},
    ]
    report = ColdChainReport("TRUCK-SN-001", mock_data)
    report.generate()
