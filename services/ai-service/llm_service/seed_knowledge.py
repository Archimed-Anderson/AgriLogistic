"""
Knowledge Base Seeder for AgriLogistic AI

This script seeds the Qdrant vector database with agricultural knowledge
from various sources (manuals, best practices, research papers).
"""

import asyncio
import json
from typing import List, Dict, Any
import httpx
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# API endpoint
API_BASE_URL = "http://localhost:8000"


# ==================== Knowledge Data ====================

MAIZE_KNOWLEDGE = [
    {
        "text": """
        Culture du Maïs au Sénégal - Guide Complet
        
        Le maïs (Zea mays) est une céréale majeure au Sénégal, cultivée principalement en hivernage.
        
        VARIÉTÉS RECOMMANDÉES:
        - Précoces (90-100 jours): IRAT 200, Souna 3
        - Cycle moyen (110-120 jours): IRAT 297, CMS 8704
        
        PRÉPARATION DU SOL:
        - Labour profond (20-25 cm) avant les premières pluies
        - Billonnage pour faciliter le drainage
        - Apport de fumure organique: 5-10 tonnes/ha
        
        SEMIS:
        - Période: Juin-Juillet (début hivernage)
        - Densité: 62,500 plants/ha (80cm x 20cm)
        - Profondeur: 3-5 cm
        - Graines par poquet: 2-3 (démariage à 1 plant)
        
        FERTILISATION:
        - Fumure de fond: 150 kg/ha NPK 15-15-15
        - Première couverture (20 jours): 50 kg/ha Urée
        - Deuxième couverture (40 jours): 50 kg/ha Urée
        
        IRRIGATION:
        - Besoins en eau: 500-800 mm/cycle
        - Stades critiques: floraison et remplissage des grains
        - Irrigation de complément si pluies insuffisantes
        
        MALADIES ET RAVAGEURS:
        - Striure du maïs (Maize Streak Virus): utiliser variétés résistantes
        - Foreurs de tiges: traitement Cypermethrine 2 semaines après levée
        - Helminthosporiose: rotation des cultures, variétés résistantes
        
        RÉCOLTE:
        - Indicateur: grains durs, spathes sèches
        - Humidité optimale: 20-25%
        - Rendement moyen: 2-3 tonnes/ha (pluvial), 5-7 tonnes/ha (irrigué)
        
        CONSERVATION:
        - Séchage jusqu'à 12-14% humidité
        - Stockage en greniers aérés ou sacs traités
        - Protection contre charançons: Actellic 2% poudre
        """,
        "metadata": {
            "source": "Manuel ISRA - Culture du Maïs au Sénégal",
            "category": "maize",
            "crop": "maize",
            "region": "Senegal",
            "author": "ISRA",
            "date": "2024-01-15",
            "language": "fr",
        }
    },
    {
        "text": """
        Gestion Intégrée des Ravageurs du Maïs
        
        FOREURS DE TIGES (Sesamia calamistis, Busseola fusca):
        
        Symptômes:
        - Trous dans les feuilles
        - Galeries dans les tiges
        - Brisure des tiges
        - Réduction du rendement: 20-50%
        
        Lutte préventive:
        - Semis précoce (début hivernage)
        - Destruction des résidus de culture
        - Rotation avec légumineuses
        - Variétés tolérantes: CMS 8704
        
        Lutte biologique:
        - Trichogrammes (parasitoïdes d'œufs)
        - Cotesia sesamiae (parasitoïde de larves)
        - Bacillus thuringiensis (Bt)
        
        Lutte chimique (si nécessaire):
        - Cypermethrine 5% EC: 200 ml/ha
        - Application: 2 semaines après levée
        - Répéter si infestation > 10%
        
        CHARANÇONS DU MAÏS (Sitophilus zeamais):
        
        Dégâts:
        - Pertes de stockage: 10-30% en 6 mois
        - Grains perforés, poudre
        
        Prévention:
        - Séchage complet (< 14% humidité)
        - Nettoyage des greniers
        - Sacs hermétiques PICS
        
        Traitement:
        - Actellic Super 2% poudre: 50g/100kg
        - Phosphine (fumigation): 3 comprimés/m³
        """,
        "metadata": {
            "source": "Guide IPM Maïs - CORAF",
            "category": "maize",
            "crop": "maize",
            "topic": "pest_management",
            "author": "CORAF",
            "date": "2023-11-20",
            "language": "fr",
        }
    },
    {
        "text": """
        Calendrier Cultural du Maïs - Zone Soudano-Sahélienne
        
        PRÉPARATION (Avril-Mai):
        - Semaine 1-2: Labour profond
        - Semaine 3-4: Billonnage, apport fumure organique
        
        SEMIS (Juin):
        - Semaine 1-2: Semis dès premières pluies utiles (> 20mm)
        - Densité: 62,500 plants/ha
        - Traitement semences: Gaucho 350 FS
        
        ENTRETIEN (Juin-Août):
        - Semaine 2-3: Premier sarclage + démariage
        - Semaine 3: Première fertilisation (NPK)
        - Semaine 4-5: Deuxième sarclage
        - Semaine 5: Deuxième fertilisation (Urée)
        - Semaine 7: Troisième fertilisation (Urée)
        
        FLORAISON (Août):
        - Semaine 8-9: Floraison mâle puis femelle
        - Irrigation critique si déficit hydrique
        
        MATURATION (Septembre):
        - Semaine 10-12: Remplissage des grains
        - Surveillance ravageurs (oiseaux)
        
        RÉCOLTE (Octobre):
        - Semaine 13-14: Récolte épis
        - Séchage au champ ou aire de séchage
        
        POST-RÉCOLTE (Octobre-Novembre):
        - Égrenage
        - Séchage complet (12-14%)
        - Stockage sécurisé
        """,
        "metadata": {
            "source": "Calendrier ANCAR Sénégal",
            "category": "maize",
            "crop": "maize",
            "topic": "calendar",
            "region": "Sahel",
            "author": "ANCAR",
            "date": "2024-02-01",
            "language": "fr",
        }
    },
]

IRRIGATION_KNOWLEDGE = [
    {
        "text": """
        Irrigation Goutte-à-Goutte pour Cultures Maraîchères
        
        PRINCIPES:
        - Apport d'eau localisé au pied des plants
        - Économie d'eau: 30-50% vs aspersion
        - Réduction maladies foliaires
        - Fertigation possible
        
        COMPOSANTS:
        - Tête de réseau: pompe, filtres, injecteur
        - Réseau principal: PVC 63-90 mm
        - Rampes latérales: PE 16 mm
        - Goutteurs: 2-4 L/h, espacement 30-50 cm
        
        DIMENSIONNEMENT:
        - Débit goutteur: 2 L/h (tomate, piment)
        - Espacement goutteurs: 30 cm
        - Espacement rampes: 1 m (double ligne)
        - Pression de service: 1-1.5 bars
        
        GESTION:
        - Fréquence: quotidienne (saison chaude)
        - Durée: 1-3 heures selon stade
        - Dose: 20-40 mm/semaine
        - Ajustement selon ETc (évapotranspiration)
        
        FERTIGATION:
        - Injection engrais solubles
        - NPK 15-15-15: 50-100 kg/ha/cycle
        - Fractionnement: 2-3 fois/semaine
        - Rinçage après injection
        
        ENTRETIEN:
        - Nettoyage filtres: hebdomadaire
        - Vérification goutteurs: bi-mensuel
        - Traitement anti-colmatage: acide citrique 1%
        - Purge rampes: fin de saison
        
        COÛT:
        - Installation: 800,000-1,200,000 FCFA/ha
        - Durée de vie: 5-7 ans (rampes), 10-15 ans (réseau)
        - Retour sur investissement: 2-3 ans
        """,
        "metadata": {
            "source": "Guide Irrigation SAED",
            "category": "irrigation",
            "topic": "drip_irrigation",
            "author": "SAED",
            "date": "2023-09-10",
            "language": "fr",
        }
    },
]

WEATHER_KNOWLEDGE = [
    {
        "text": """
        Interprétation des Prévisions Météo pour l'Agriculture
        
        TEMPÉRATURE:
        - Optimum croissance maïs: 25-30°C
        - Stress thermique: > 35°C (floraison)
        - Gel: < 0°C (mortel pour jeunes plants)
        
        PLUVIOMÉTRIE:
        - Pluie utile: > 10 mm
        - Semis: attendre cumul > 20 mm
        - Excès: > 100 mm/semaine (risque inondation)
        
        HUMIDITÉ RELATIVE:
        - Optimum: 60-80%
        - < 40%: stress hydrique, irrigation
        - > 90%: risque maladies fongiques
        
        VENT:
        - Modéré (< 20 km/h): favorable pollinisation
        - Fort (> 40 km/h): risque verse, report traitements
        
        ÉVAPOTRANSPIRATION (ET0):
        - Faible: < 3 mm/jour
        - Moyenne: 3-5 mm/jour
        - Forte: > 5 mm/jour
        - Irrigation si ET0 > Pluie
        
        ACTIONS SELON PRÉVISIONS:
        
        Pluie annoncée (> 20 mm):
        - Reporter fertilisation (lessivage)
        - Reporter traitements phyto
        - Préparer drainage
        
        Sécheresse annoncée (> 7 jours):
        - Irrigation préventive
        - Paillage
        - Réduire fertilisation azotée
        
        Vent fort annoncé:
        - Tuteurage cultures hautes
        - Reporter pulvérisations
        - Protéger pépinières
        
        Canicule annoncée (> 35°C):
        - Irrigation matinale
        - Ombrage jeunes plants
        - Reporter transplantation
        """,
        "metadata": {
            "source": "Guide Agro-Météo ANACIM",
            "category": "weather",
            "topic": "interpretation",
            "author": "ANACIM",
            "date": "2024-01-05",
            "language": "fr",
        }
    },
]


# ==================== Seeding Functions ====================

async def seed_knowledge_base():
    """Seed the knowledge base with agricultural data"""
    
    async with httpx.AsyncClient() as client:
        # Combine all knowledge
        all_documents = MAIZE_KNOWLEDGE + IRRIGATION_KNOWLEDGE + WEATHER_KNOWLEDGE
        
        logger.info(f"Seeding {len(all_documents)} documents...")
        
        # Batch index
        try:
            response = await client.post(
                f"{API_BASE_URL}/ai/knowledge/batch",
                json={"documents": all_documents},
                timeout=60.0,
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ Successfully indexed {result['count']} documents")
                logger.info(f"Document IDs: {result['document_ids'][:3]}...")
            else:
                logger.error(f"❌ Error: {response.status_code} - {response.text}")
                
        except Exception as e:
            logger.error(f"❌ Failed to seed knowledge base: {e}")


async def test_consultation():
    """Test the RAG consultation endpoint"""
    
    test_questions = [
        "Comment cultiver le maïs au Sénégal?",
        "Quels sont les ravageurs du maïs et comment les contrôler?",
        "Quelle est la meilleure période pour semer le maïs?",
        "Comment fonctionne l'irrigation goutte-à-goutte?",
        "Comment interpréter les prévisions météo pour l'agriculture?",
    ]
    
    async with httpx.AsyncClient() as client:
        for question in test_questions:
            logger.info(f"\n📝 Question: {question}")
            
            try:
                response = await client.post(
                    f"{API_BASE_URL}/ai/consult",
                    json={"question": question, "top_k": 3},
                    timeout=30.0,
                )
                
                if response.status_code == 200:
                    result = response.json()
                    logger.info(f"✅ Answer: {result['answer'][:200]}...")
                    logger.info(f"Confidence: {result['confidence']:.2f}")
                    logger.info(f"Sources: {len(result['sources'])}")
                else:
                    logger.error(f"❌ Error: {response.status_code}")
                    
            except Exception as e:
                logger.error(f"❌ Failed: {e}")


async def check_system_health():
    """Check system health"""
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{API_BASE_URL}/health")
            
            if response.status_code == 200:
                health = response.json()
                logger.info(f"✅ System Status: {health['status']}")
                logger.info(f"Services: {health['services']}")
            else:
                logger.error(f"❌ Health check failed: {response.status_code}")
                
        except Exception as e:
            logger.error(f"❌ Cannot connect to API: {e}")
            logger.error("Make sure the service is running: docker-compose up -d")


# ==================== Main ====================

async def main():
    """Main seeding workflow"""
    
    logger.info("=" * 60)
    logger.info("AgriLogistic Knowledge Base Seeder")
    logger.info("=" * 60)
    
    # Step 1: Check health
    logger.info("\n1️⃣ Checking system health...")
    await check_system_health()
    
    # Step 2: Seed knowledge
    logger.info("\n2️⃣ Seeding knowledge base...")
    await seed_knowledge_base()
    
    # Step 3: Test consultation
    logger.info("\n3️⃣ Testing RAG consultation...")
    await test_consultation()
    
    logger.info("\n" + "=" * 60)
    logger.info("✅ Seeding complete!")
    logger.info("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
