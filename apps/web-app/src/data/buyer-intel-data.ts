export const BUYER_INTEL_DATA = {
  // 1. Historical Prices (for Market Intelligence)
  marketPrices: [
    { month: 'Jan', price: 215, vol: 1200 },
    { month: 'Feb', price: 225, vol: 1500 },
    { month: 'Mar', price: 218, vol: 1100 },
    { month: 'Apr', price: 235, vol: 1800 },
    { month: 'May', price: 230, vol: 1600 },
    { month: 'Jun', price: 245, vol: 2000 },
    { month: 'Jul', price: 255, vol: 2200 }, // Current
  ],
  pricePredictions: [
    { month: 'Aug', price: 262, confidence: 0.88, range: [255, 275] },
    { month: 'Sep', price: 268, confidence: 0.82, range: [258, 280] },
    { month: 'Oct', price: 260, confidence: 0.75, range: [245, 275] },
  ],

  // 2. Matched Providers (for Sourcing Hub)
  matchedProviders: [
    {
       id: "PROD-2938",
       name: "Coopérative de la Vallée",
       location: "Saint-Louis (45km)",
       rating: 4.9,
       reliability: 98,
       price: 235, // $/T
       volume: "50T Available",
       quality: "Grade A",
       matchScore: 98,
       certification: ["Bio", "FairTrade"]
    },
    {
       id: "PROD-1029",
       name: "Ferme Bio Niayes",
       location: "Thiès (120km)",
       rating: 4.7,
       reliability: 94,
       price: 242,
       volume: "12T Available",
       quality: "Grade A",
       matchScore: 88,
       certification: ["Bio"]
    },
    {
       id: "PROD-0043",
       name: "Agro-Industrie du Sud",
       location: "Ziguinchor (380km)",
       rating: 4.5,
       reliability: 91,
       price: 220,
       volume: "150T Available",
       quality: "Standard",
       matchScore: 76,
       certification: []
    }
  ],

  // 3. Negotiation History (for Chat Interface)
  negotiationHistory: [
    { id: 1, sender: "Coopérative Vallée", text: "Bonjour, nous confirmons la disponibilité des 50T de Maïs Grade A.", time: "10:30", type: "received" },
    { id: 2, sender: "Me", text: "Le prix de 245$/T est au-dessus du marché spot (238$). Pouvez-vous ajuster ?", time: "10:32", type: "sent" },
    { id: 3, sender: "Coopérative Vallée", text: "Nous pouvons descendre à 240$ si le paiement est sécurisé via Escrow 48h.", time: "10:33", type: "received" },
  ],

  // 4. Smart Contracts (for Tracking/Dashboard)
  smartContracts: [
    { 
       id: "SC-8291-X", 
       hash: "0x71C...92F", 
       status: "ACTIVE", 
       parties: ["AgriBuyer Corp", "Coopérative Vallée"], 
       value: "$11,750", 
       conditions: ["Escrow: Released on GPS Arrival", "Humidité < 12%"] 
    },
    { 
       id: "SC-1029-B", 
       hash: "0x92A...11B", 
       status: "PENDING_SIGNATURE", 
       parties: ["AgriBuyer Corp", "Ferme Bio Niayes"], 
       value: "$4,200", 
       conditions: [] 
    }
  ],

  // 5. RFQ History
  rfqHistory: [
     { id: "RFQ-2024-882", product: "Maïs Jaune", quantity: "200T", status: "OPEN", responses: 12, deadline: "48h" },
     { id: "RFQ-2024-881", product: "Riz Brisé", quantity: "50T", status: "CLOSED", responses: 4, deadline: "Expired" },
     { id: "RFQ-2024-879", product: "Mangue Kent", quantity: "15T", status: "NEGOTIATION", responses: 8, deadline: "Active" }
  ]
}
