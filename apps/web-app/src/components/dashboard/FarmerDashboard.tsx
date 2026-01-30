"use client"

import * as React from "react"
import { KPICard } from "./KPICard"
import { Field3D } from "./Field3D"
import { mockKPIs } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FarmerDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Agriculteur</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de vos parcelles et métriques agricoles
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {mockKPIs.map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* 3D Field Visualization */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visualisation 3D du Terrain</CardTitle>
            <CardDescription>
              Jumeau numérique de votre parcelle - Survolez pour interagir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Field3D width={600} height={400} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la Parcelle</CardTitle>
            <CardDescription>Détails sur votre terrain</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Superficie</p>
              <p className="text-2xl font-bold">12.5 ha</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type de culture</p>
              <p className="text-lg">Maïs</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date de plantation</p>
              <p className="text-lg">15 Mars 2024</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">État</p>
              <p className="text-lg text-green-600">En croissance</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
