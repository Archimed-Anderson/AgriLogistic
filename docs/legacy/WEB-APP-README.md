# AgriLogistic Link - Admin & Public Modules

AgriLogistic Link is a comprehensive logistics platform connecting farmers, buyers, and transporters ("The Uber of Agriculture"). This module includes a public-facing command center and a robust administration dashboard.

## 🚀 Features

### Public Command Center (`/products/agrilogistic-link`)
- **Interactive Map**: Real-time visualization of loads (Red) and trucks (Blue) using Leaflet.
- **Smart Matching AI**: Visual demonstration of AI routing with "Green Line" connections.
- **Route Comparator**: Compare "Fastest" vs "Eco-Friendly" routes.
- **Driver Chat**: Floating action button to simulate driver communication.

### Admin Dashboard (`/admin/link-manager`)
A complete fleet management system with 4 main views:
1.  **Cockpit**:
    - High-level KPIs (Revenue, CO2 Saved).
    - World Heatmap Overlay.
    - Predictive Supply/Demand Graph (Recharts).
    - Top Matches Table.
2.  **Cargos**:
    - Full DataGrid for managing loads.
    - Filtering (Pending, Matched, Delivered).
    - Add/Edit/Delete actions.
3.  **Fleet**:
    - Truck monitoring table.
    - Status management (Force Maintenance, Release).
    - Location tracking.
4.  **Alerts**:
    - IoT Incident Timeline.
    - 3-level Severity System (Critical, Warning, Info).
    - Resolve actions impacting global state.

## 🛠️ Tech Stack
-   **Framework**: Next.js 14 (App Router)
-   **Styling**: Tailwind CSS + Shadcn UI (Dark/Neon Mode)
-   **State Management**: Zustand (`useLogisticsStore`)
-   **Maps**: React-Leaflet
-   **Charts**: Recharts
-   **Icons**: Lucide React

## 📂 Project Structure (Key Files)
```
apps/web-app/src/
├── app/
│   ├── products/agrilogistic-link/   # Public Page
│   └── admin/link-manager/           # Admin Dashboard
├── components/
│   ├── admin/logistics/
│   │   ├── views/                    # Admin Tabs (Cockpit, Cargos, Fleet, Alerts)
│   │   └── AgriLogisticLink.tsx      # Main Admin Container
│   └── maps/LogisticsMap.tsx         # Shared Map Component
├── data/
│   └── logistics-operations.ts       # Central mocking engine & types
└── store/
    └── useLogisticsStore.ts          # Global State (Zustand)
```

## 🔄 Development
Run the development server:
```bash
pnpm dev
```
Open [http://localhost:3003](http://localhost:3003) to view the application.
