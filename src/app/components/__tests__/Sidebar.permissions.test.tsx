import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Sidebar } from "@components/Sidebar";
import { Permission } from "@domain/value-objects/permissions.vo";
import { UserRole } from "@domain/enums/user-role.enum";

describe("Sidebar tabs", () => {
  test("shows expected admin sidebar tabs (per spec)", () => {
    render(
      <Sidebar
        currentRoute="/admin/dashboard"
        onNavigate={vi.fn()}
        type="admin"
        userRole={UserRole.FARMER}
        userPermissions={[
          Permission.VIEW_ALL_PRODUCTS,
          Permission.VIEW_ANALYTICS,
          Permission.VIEW_OWN_ORDERS,
        ]}
      />
    );

    // Sidebar no longer hides tabs; access control is enforced on the route level (AccessDenied).
    expect(screen.getByText("Gestion Utilisateurs")).toBeTruthy();
    expect(screen.getByText("Produits")).toBeTruthy();
    // expect(screen.getByText("Commandes")).toBeTruthy(); // Moved to Navbar
    expect(screen.getByText("Catégories")).toBeTruthy();
    expect(screen.getByText("Rapports")).toBeTruthy();
    expect(screen.getByText("Logistique")).toBeTruthy();
    expect(screen.getByText("Calculateur Transport")).toBeTruthy();
    // expect(screen.getByText("Suivi Livraison")).toBeTruthy(); // Moved to Navbar
    expect(screen.getByText("Affiliations")).toBeTruthy();
    expect(screen.getByText("Crop Intelligence")).toBeTruthy();
    expect(screen.getByText("IoT Hub")).toBeTruthy();
    expect(screen.getByText("AI Insights")).toBeTruthy();
    expect(screen.getByText("Finance")).toBeTruthy();
    expect(screen.getByText("Automation")).toBeTruthy();
    // expect(screen.getByText("Paramètres")).toBeTruthy(); // Moved to Navbar
    expect(screen.getByText("Gestion Main-d'œuvre")).toBeTruthy();
  });

  test("shows expected customer sidebar tabs", () => {
    render(
      <Sidebar
        currentRoute="/customer/dashboard"
        onNavigate={vi.fn()}
        type="customer"
        userRole={UserRole.BUYER}
        userPermissions={[
          Permission.VIEW_ALL_PRODUCTS,
          Permission.CREATE_ORDER,
          Permission.VIEW_OWN_ORDERS,
          Permission.VIEW_ANALYTICS,
        ]}
      />
    );

    expect(screen.getByText("Dashboard")).toBeTruthy();
    // expect(screen.getByText("Mes Commandes")).toBeTruthy(); // Moved to Navbar
    expect(screen.getByText("Calculateur Transport")).toBeTruthy();
    // expect(screen.getByText("Suivi Livraison")).toBeTruthy(); // Moved to Navbar
    expect(screen.getByText("Paiements")).toBeTruthy();
    // expect(screen.getByText("Paramètres")).toBeTruthy(); // Moved to Navbar
  });
});

